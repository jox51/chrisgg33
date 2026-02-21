<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class WhopController extends Controller
{
    /**
     * Valid plan slugs mapped to their config keys
     */
    protected array $planMap = [
        'opposition' => 'chris_opposition_plan_id',
        'guidance' => 'strategic_guidance_plan_id',
        'two-hour' => 'two_hour_plan_id',
        'emergency' => 'emergency_plan_id',
        'soulmate' => 'soulmate_plan_id',
        'relationship' => 'relationship_plan_id',
    ];

    /**
     * Plan display names
     */
    protected array $planNames = [
        'opposition' => 'Oppositional Year Prep',
        'guidance' => 'Strategic Guidance',
        'two-hour' => '2.5 Hour Session',
        'emergency' => 'Emergency Services',
        'soulmate' => 'Soul Mate & Beneficial Dates',
        'relationship' => 'Relationship / Compatibility',
    ];

    /**
     * Get Whop plan ID based on plan slug
     */
    protected function getPlanId(string $planSlug): ?string
    {
        $configKey = $this->planMap[$planSlug] ?? null;
        if (!$configKey) {
            return null;
        }
        return config("payment.providers.whop.{$configKey}");
    }

    /**
     * Show checkout page with Whop embed
     */
    public function createSubscription(Request $request, string $planType)
    {
        if (!array_key_exists($planType, $this->planMap)) {
            return redirect()->back()->with('error', 'Invalid plan type.');
        }

        $planId = $this->getPlanId($planType);

        if (empty($planId)) {
            Log::error('Whop plan ID not configured', [
                'plan_type' => $planType,
                'config_key' => "payment.providers.whop.{$this->planMap[$planType]}"
            ]);
            return redirect()->back()->with('error', 'Plan not configured. Please contact support.');
        }

        Log::info('Whop checkout attempt', [
            'plan_id' => $planId,
            'plan_type' => $planType,
        ]);

        return Inertia::render('Subscription/WhopCheckout', [
            'planId' => $planId,
            'planType' => $planType,
            'planName' => $this->planNames[$planType] ?? ucfirst($planType),
        ]);
    }

    /**
     * Handle payment success callback
     */
    public function subscriptionSuccess(Request $request)
    {
        $receiptId = $request->get('receipt_id');
        $planId = $request->get('plan_id');

        if (!$receiptId || !$planId) {
            return redirect('/')->with('error', 'Invalid payment data.');
        }

        $planType = $this->determinePlanType($planId);
        $planName = $this->planNames[$planType] ?? ucfirst($planType);

        Log::info('Whop payment success', [
            'receipt_id' => $receiptId,
            'plan_type' => $planType,
        ]);

        return Inertia::render('Subscription/WhopSuccess', [
            'receiptId' => $receiptId,
            'planDescription' => $planName,
            'status' => 'completed',
            'message' => 'Payment successful! Thank you for your purchase.',
        ]);
    }

    /**
     * Handle payment cancellation
     */
    public function subscriptionCancel()
    {
        return Inertia::render('Subscription/Cancel', [
            'message' => 'Payment cancelled.'
        ]);
    }

    /**
     * Determine plan type from plan ID
     */
    protected function determinePlanType(string $planId): string
    {
        foreach ($this->planMap as $slug => $configKey) {
            if (config("payment.providers.whop.{$configKey}") === $planId) {
                return $slug;
            }
        }

        return 'unknown';
    }

    /**
     * Redirect to Whop billing page
     */
    public function redirectToBillingPortal(Request $request)
    {
        return redirect()->away('https://whop.com/hub/');
    }
}
