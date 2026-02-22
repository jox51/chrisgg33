<?php

namespace App\Jobs;

use App\Models\Payment;
use App\Services\WhopApiService;
use App\Mail\MembershipCancellationFailedEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class CancelWhopMembership implements ShouldQueue
{
    use Queueable;

    public $tries = 3;
    public $backoff = [10, 30, 60];

    public function __construct(
        public Payment $payment
    ) {}

    public function handle(): void
    {
        if (empty($this->payment->whop_membership_id)) {
            Log::info("No Whop membership ID found for payment {$this->payment->id}, skipping cancellation");
            return;
        }

        try {
            Log::info("Background job: Initiating Whop membership cancellation for payment {$this->payment->id}", [
                'payment_id' => $this->payment->id,
                'membership_id' => $this->payment->whop_membership_id,
                'customer_email' => $this->payment->email,
            ]);

            $whopService = new WhopApiService();
            $success = $whopService->cancelMembership($this->payment->whop_membership_id);

            if ($success) {
                Log::info("Background job: Whop membership successfully canceled for payment {$this->payment->id}", [
                    'payment_id' => $this->payment->id,
                    'membership_id' => $this->payment->whop_membership_id,
                    'customer_email' => $this->payment->email,
                ]);
            } else {
                $this->sendFailureAlert();
            }

        } catch (\Exception $e) {
            Log::error("Background job: Exception during Whop membership cancellation for payment {$this->payment->id}: " . $e->getMessage(), [
                'payment_id' => $this->payment->id,
                'membership_id' => $this->payment->whop_membership_id,
                'exception' => $e->getMessage(),
            ]);

            $this->sendFailureAlert($e->getMessage());
            throw $e;
        }
    }

    private function sendFailureAlert(?string $errorMessage = null): void
    {
        try {
            $adminEmail = config('payment.purchase_notification_email');
            if ($adminEmail) {
                Mail::to($adminEmail)->send(
                    new MembershipCancellationFailedEmail($this->payment, $errorMessage)
                );
            }

            Log::warning("Background job: Membership cancellation failure alert sent for payment {$this->payment->id}", [
                'payment_id' => $this->payment->id,
                'membership_id' => $this->payment->whop_membership_id,
            ]);
        } catch (\Exception $e) {
            Log::error("Background job: Failed to send membership cancellation alert: " . $e->getMessage());
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error("Background job: CancelWhopMembership job failed permanently for payment {$this->payment->id}", [
            'payment_id' => $this->payment->id,
            'membership_id' => $this->payment->whop_membership_id,
            'exception' => $exception->getMessage(),
        ]);

        $this->sendFailureAlert($exception->getMessage());
    }
}
