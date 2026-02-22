<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\User;
use App\Mail\UserSubscriptionConfirmationEmail;
use App\Mail\AdminNewSubscriptionEmail;
use App\Jobs\CancelWhopMembership;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class WhopWebhookController extends Controller
{
    /**
     * Handle Whop webhook events
     */
    public function handleWebhook(Request $request)
    {
        // Log the webhook for debugging
        Log::info('Whop webhook received', $request->all());

        $event = $request->input('type');
        $data = $request->input('data');

        switch ($event) {
            case 'checkout.session.completed':
            case 'membership.created':
            case 'membership.activated':
            case 'payment.succeeded':
                return $this->handleSuccessfulPayment($data);

            case 'payment.created':
                Log::info('Whop payment created (pending)', ['id' => $data['id'] ?? null]);
                return response()->json(['message' => 'Payment created acknowledged'], 200);

            case 'membership.cancelled':
            case 'membership.deactivated':
            case 'payment.failed':
                return $this->handleFailedPayment($data);

            case 'membership.expired':
                return $this->handleExpiredSubscription($data);

            default:
                Log::info('Unhandled Whop webhook event: ' . $event);
                return response()->json(['message' => 'Event not handled'], 200);
        }
    }

    /**
     * Handle successful payment from Whop
     */
    private function handleSuccessfulPayment($data)
    {
        try {
            // Extract relevant data from Whop webhook
            $email = $data['user']['email'] ?? $data['email'] ?? $data['customer']['email'] ?? null;
            $planId = $data['plan']['id'] ?? $data['plan_id'] ?? $data['product']['id'] ?? null;
            $receiptId = $data['id'] ?? $data['receipt_id'] ?? null;

            if (!$email) {
                Log::error('Missing email in Whop webhook', $data);
                return response()->json(['error' => 'Missing required data'], 400);
            }

            // Update the pending Payment record so the frontend poll can detect completion
            $membershipId = $data['membership']['id'] ?? null;
            $amount = $data['total'] ?? $data['subtotal'] ?? 0;
            $currency = $data['currency'] ?? null;

            $payment = Payment::where('whop_payment_id', $receiptId)->first();

            if (!$payment && $membershipId) {
                $payment = Payment::where('whop_membership_id', $membershipId)->first();
            }

            if (!$payment) {
                $payment = Payment::where('plan_id', $planId)
                    ->where('status', 'pending')
                    ->where('created_at', '>=', now()->subMinutes(10))
                    ->latest()
                    ->first();
            }

            if ($payment) {
                $payment->update([
                    'email' => $email,
                    'whop_payment_id' => $receiptId,
                    'whop_membership_id' => $membershipId,
                    'status' => 'paid',
                    'amount' => $amount,
                    'currency' => $currency,
                    'paid_at' => now(),
                ]);
                Log::info('Payment record updated to paid', ['payment_id' => $payment->id]);
            } else {
                $payment = Payment::create([
                    'email' => $email,
                    'whop_payment_id' => $receiptId,
                    'whop_membership_id' => $membershipId,
                    'plan_type' => $this->determinePlanType($planId),
                    'plan_id' => $planId,
                    'status' => 'paid',
                    'amount' => $amount,
                    'currency' => $currency,
                    'paid_at' => now(),
                ]);
                Log::info('New payment record created as paid (no pending record found)');
            }

            // Determine plan slug and resolve display name + price
            $planSlug = $this->determinePlanType($planId);
            $planName = config("payment.plan_names.{$planSlug}", ucfirst($planSlug));
            $price = config("payment.plan_prices.{$planSlug}", 'N/A');

            // Find the user by email (may not exist)
            $user = User::where('email', $email)->first();
            $buyerName = $data['user']['name'] ?? $data['user']['username'] ?? 'Customer';

            if ($user) {
                // Update user subscription status
                $user->update([
                    'payment_provider' => 'whop',
                    'whop_payment_id' => $receiptId,
                    'subscription_status' => 'active',
                ]);

                Log::info('Whop subscription activated for: ' . $email);
            } else {
                Log::info('Whop purchase by non-registered user: ' . $email);
            }

            // Build buyer object for emails (use User if exists, otherwise stdClass)
            $buyer = $user ?? (object) [
                'name' => $buyerName,
                'email' => $email,
            ];

            // Send confirmation emails
            try {
                Mail::to($email)->send(new UserSubscriptionConfirmationEmail($buyer, $planName, $price, 'active'));

                $adminEmail = config('payment.purchase_notification_email');
                if ($adminEmail) {
                    Mail::to($adminEmail)->send(new AdminNewSubscriptionEmail($buyer, $planName, $price, 'active'));
                }

                $supportEmail = config('mail.from.address');
                if ($supportEmail && $supportEmail !== $adminEmail) {
                    Mail::to($supportEmail)->send(new AdminNewSubscriptionEmail($buyer, $planName, $price, 'active'));
                }
            } catch (\Exception $e) {
                Log::error('Failed to send Whop purchase confirmation emails: ' . $e->getMessage());
            }

            // Cancel Whop membership asynchronously to allow repeat purchases
            $this->cancelWhopMembership($payment);

            return response()->json(['message' => 'Payment processed successfully'], 200);

        } catch (\Exception $e) {
            Log::error('Error processing Whop payment webhook: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * Handle failed payment from Whop
     */
    private function handleFailedPayment($data)
    {
        try {
            $email = $data['user']['email'] ?? $data['email'] ?? $data['customer']['email'] ?? null;

            if (!$email) {
                return response()->json(['error' => 'Missing email'], 400);
            }

            // Find and update the user
            $user = User::where('email', $email)->first();

            if ($user) {
                $user->update([
                    'subscription_status' => 'past_due',
                ]);

                Log::info('Whop subscription payment failed for: ' . $email);
            }

            return response()->json(['message' => 'Payment failure processed'], 200);

        } catch (\Exception $e) {
            Log::error('Error processing Whop payment failure: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * Handle expired subscription from Whop
     */
    private function handleExpiredSubscription($data)
    {
        try {
            $email = $data['user']['email'] ?? $data['email'] ?? $data['customer']['email'] ?? null;

            if (!$email) {
                return response()->json(['error' => 'Missing email'], 400);
            }

            // Find and update the user
            $user = User::where('email', $email)->first();

            if ($user) {
                $user->update([
                    'subscription_status' => 'canceled',
                ]);

                Log::info('Whop subscription expired for: ' . $email);
            }

            return response()->json(['message' => 'Subscription expiration processed'], 200);

        } catch (\Exception $e) {
            Log::error('Error processing Whop subscription expiration: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * Cancel Whop membership asynchronously after successful payment
     */
    private function cancelWhopMembership(Payment $payment): void
    {
        if (empty($payment->whop_membership_id)) {
            Log::info("No Whop membership ID found for payment {$payment->id}, skipping cancellation");
            return;
        }

        CancelWhopMembership::dispatch($payment)
            ->delay(now()->addSeconds(5));

        Log::info("Whop membership cancellation job dispatched for payment {$payment->id}", [
            'payment_id' => $payment->id,
            'membership_id' => $payment->whop_membership_id,
            'customer_email' => $payment->email,
        ]);
    }

    /**
     * Determine plan slug from Whop plan ID
     */
    protected function determinePlanType(?string $planId): string
    {
        if (!$planId) {
            return 'unknown';
        }

        $planMap = [
            'opposition' => 'chris_opposition_plan_id',
            'guidance' => 'strategic_guidance_plan_id',
            'two-hour' => 'two_hour_plan_id',
            'emergency' => 'emergency_plan_id',
            'soulmate' => 'soulmate_plan_id',
            'relationship' => 'relationship_plan_id',
        ];

        foreach ($planMap as $slug => $configKey) {
            if (config("payment.providers.whop.{$configKey}") === $planId) {
                return $slug;
            }
        }

        return 'unknown';
    }
}
