# Whop Automatic Membership Cancellation - Implementation Guide

## Table of Contents
1. [Overview](#overview)
2. [Problem Statement](#problem-statement)
3. [Solution Architecture](#solution-architecture)
4. [Prerequisites](#prerequisites)
5. [Implementation Steps](#implementation-steps)
6. [Configuration](#configuration)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Overview

This guide explains how to implement automatic Whop membership cancellation after successful one-time purchases. This is essential for products that use Whop for payment processing but don't require ongoing memberships.

### Use Case
- Customer makes a one-time purchase (e.g., TikTok account)
- Product is delivered automatically
- Whop membership must be canceled to allow repeat purchases
- Entire process happens automatically without manual intervention

---

## Problem Statement

### The Challenge
Whop creates a membership for every purchase. For one-time products, this creates two issues:

1. **Repeat Purchases Blocked**: Customers cannot make additional purchases because they already have an active membership
2. **Manual Cancellation Required**: Admin must manually cancel each membership in Whop dashboard

### Why It Happens
Whop's architecture is designed for subscription-based products. One-time purchases still create memberships that must be managed.

---

## Solution Architecture

### Flow Diagram

```
Customer Purchase
      ↓
Whop Checkout
      ↓
Payment Succeeded (webhook) → Webhook Handler
      ↓                              ↓
Deliver Product                Update Payment Record
      ↓                              ↓
Send Emails                    Dispatch Background Job
      ↓                              ↓
Return 200 OK to Whop          [5 seconds delay]
      ↓                              ↓
Checkout Redirects             Cancel Membership API Call
                                     ↓
                              Log Success/Failure
                                     ↓
                            [If Failed] → Email Admin
```

### Key Design Decisions

1. **Asynchronous Processing**: Membership cancellation happens in a background job to prevent webhook timeouts
2. **Retry Logic**: 3 retry attempts with exponential backoff (1s, 2s, 4s)
3. **Admin Notifications**: Automatic email alerts when cancellation fails
4. **Recent Payment Matching**: Only updates payments created within last 10 minutes to avoid updating stale records

---

## Prerequisites

### Required Tools & Technologies
- Laravel 10+ (PHP framework)
- MySQL/PostgreSQL database
- Queue system (database-based queue is sufficient)
- Whop API Key with required scopes:
  - `member:manage`
  - `member:email:read`
  - `member:basic:read`

### Environment Variables Needed
```env
WHOP_API_KEY=apik_xxxxxxxxxxxxxxx
WHOP_API_URL=https://api.whop.com/api/v1
QUEUE_CONNECTION=database
```

---

## Implementation Steps

### Step 1: Update Configuration File

**File**: `config/payment.php`

Add Whop API configuration:

```php
'whop' => [
    'enabled' => env('WHOP_ENABLED', false),
    'api_key' => env('WHOP_API_KEY', ''),
    'api_url' => env('WHOP_API_URL', 'https://api.whop.com/api/v1'),
    'webhook_secret' => env('WHOP_WEBHOOK_SECRET', ''),
    // ... your plan IDs
],
```

**Purpose**: Centralizes Whop API configuration for easy access throughout the application.

---

### Step 2: Create Whop API Service

**File**: `app/Services/WhopApiService.php`

This service handles all Whop API interactions with built-in retry logic.

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhopApiService
{
    private string $apiKey;
    private string $apiUrl;
    private int $maxRetries = 3;
    private array $retryDelays = [1, 2, 4]; // Exponential backoff in seconds

    public function __construct()
    {
        $this->apiKey = config('payment.providers.whop.api_key');
        $this->apiUrl = config('payment.providers.whop.api_url');
    }

    /**
     * Cancel a Whop membership immediately
     *
     * @param string $membershipId The Whop membership ID (format: mem_xxxxxxxxxxxxxx)
     * @return bool True if cancellation was successful, false otherwise
     */
    public function cancelMembership(string $membershipId): bool
    {
        if (empty($this->apiKey)) {
            Log::error('Whop API key is not configured');
            return false;
        }

        if (empty($membershipId)) {
            Log::error('Membership ID is empty');
            return false;
        }

        $endpoint = "{$this->apiUrl}/memberships/{$membershipId}/cancel";

        for ($attempt = 1; $attempt <= $this->maxRetries; $attempt++) {
            try {
                Log::info("Attempting to cancel Whop membership {$membershipId} (Attempt {$attempt}/{$this->maxRetries})");

                $response = Http::withHeaders([
                    'Authorization' => "Bearer {$this->apiKey}",
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ])
                ->timeout(10)
                ->post($endpoint, [
                    'cancellation_mode' => 'immediate',
                ]);

                // Check if the request was successful
                if ($response->successful()) {
                    Log::info("Successfully canceled Whop membership {$membershipId}", [
                        'membership_id' => $membershipId,
                        'response_status' => $response->status(),
                    ]);
                    return true;
                }

                // Log the error response
                $errorMessage = $this->extractErrorMessage($response);
                Log::warning("Failed to cancel Whop membership {$membershipId} (Attempt {$attempt}/{$this->maxRetries})", [
                    'membership_id' => $membershipId,
                    'status_code' => $response->status(),
                    'error_message' => $errorMessage,
                    'response_body' => $response->body(),
                ]);

                // Don't retry on 4xx errors (except 429 rate limit) as they won't succeed
                if ($response->clientError() && $response->status() !== 429) {
                    Log::error("Client error when canceling Whop membership {$membershipId}. Not retrying.", [
                        'membership_id' => $membershipId,
                        'status_code' => $response->status(),
                        'error_message' => $errorMessage,
                    ]);
                    return false;
                }

                // If we have more attempts left, wait before retrying
                if ($attempt < $this->maxRetries) {
                    $delay = $this->retryDelays[$attempt - 1];
                    Log::info("Retrying in {$delay} seconds...");
                    sleep($delay);
                }

            } catch (\Exception $e) {
                Log::error("Exception when canceling Whop membership {$membershipId} (Attempt {$attempt}/{$this->maxRetries})", [
                    'membership_id' => $membershipId,
                    'exception' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);

                // If we have more attempts left, wait before retrying
                if ($attempt < $this->maxRetries) {
                    $delay = $this->retryDelays[$attempt - 1];
                    Log::info("Retrying in {$delay} seconds...");
                    sleep($delay);
                }
            }
        }

        // All retry attempts exhausted
        Log::error("Failed to cancel Whop membership {$membershipId} after {$this->maxRetries} attempts", [
            'membership_id' => $membershipId,
        ]);

        return false;
    }

    /**
     * Extract error message from API response
     *
     * @param \Illuminate\Http\Client\Response $response
     * @return string
     */
    private function extractErrorMessage($response): string
    {
        $body = $response->json();

        // Try to extract error message from different possible formats
        if (isset($body['error']['message'])) {
            return $body['error']['message'];
        }

        if (isset($body['error'])) {
            return is_string($body['error']) ? $body['error'] : json_encode($body['error']);
        }

        if (isset($body['message'])) {
            return $body['message'];
        }

        return 'Unknown error';
    }
}
```

**Key Features**:
- Retry logic with exponential backoff
- Proper error handling for different HTTP status codes
- Comprehensive logging
- No retry on client errors (4xx) except rate limits

---

### Step 3: Create Background Job

**File**: `app/Jobs/CancelWhopMembership.php`

Generate the job:
```bash
php artisan make:job CancelWhopMembership
```

Implement the job:

```php
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

    public $tries = 3; // Retry the job 3 times if it fails
    public $backoff = [10, 30, 60]; // Wait 10s, 30s, 60s between retries

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Payment $payment
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Only attempt cancellation if we have a Whop membership ID
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
                // If cancellation failed after retries in the API service,
                // send admin notification
                $this->sendFailureAlert();
            }

        } catch (\Exception $e) {
            Log::error("Background job: Exception during Whop membership cancellation for payment {$this->payment->id}: " . $e->getMessage(), [
                'payment_id' => $this->payment->id,
                'membership_id' => $this->payment->whop_membership_id,
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Send admin notification
            $this->sendFailureAlert($e->getMessage());

            // Re-throw to allow job retry mechanism
            throw $e;
        }
    }

    /**
     * Send failure alert to admin
     */
    private function sendFailureAlert(?string $errorMessage = null): void
    {
        try {
            Mail::to('your-admin@email.com')->send(
                new MembershipCancellationFailedEmail($this->payment, $errorMessage)
            );

            Log::warning("Background job: Membership cancellation failure alert sent for payment {$this->payment->id}", [
                'payment_id' => $this->payment->id,
                'membership_id' => $this->payment->whop_membership_id,
            ]);
        } catch (\Exception $e) {
            Log::error("Background job: Failed to send membership cancellation alert: " . $e->getMessage());
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("Background job: CancelWhopMembership job failed permanently for payment {$this->payment->id}", [
            'payment_id' => $this->payment->id,
            'membership_id' => $this->payment->whop_membership_id,
            'exception' => $exception->getMessage(),
        ]);

        // Send final failure notification
        $this->sendFailureAlert($exception->getMessage());
    }
}
```

**Key Features**:
- Job-level retry mechanism (separate from API retries)
- Failure handling with admin notifications
- Comprehensive logging at each step

---

### Step 4: Create Admin Notification Email

**File**: `app/Mail/MembershipCancellationFailedEmail.php`

```php
<?php

namespace App\Mail;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MembershipCancellationFailedEmail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Payment $payment,
        public ?string $errorMessage = null
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "⚠️ Whop Membership Cancellation Failed - Payment #{$this->payment->id}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.membership-cancellation-failed',
            with: [
                'payment' => $this->payment,
                'errorMessage' => $this->errorMessage ?? 'Unknown error',
                'planType' => ucfirst(str_replace('_', ' ', $this->payment->plan_type)),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
```

**File**: `resources/views/emails/membership-cancellation-failed.blade.php`

```blade
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Membership Cancellation Failed</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px 20px;
        }
        .warning-box {
            background-color: #fff3cd;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #ffc107;
            color: #856404;
        }
        .payment-details {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .detail-row {
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #dee2e6;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: bold;
            color: #495057;
            display: inline-block;
            width: 180px;
        }
        .value {
            color: #212529;
        }
        .error-box {
            background-color: #f8d7da;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
            border-left: 4px solid #dc3545;
            color: #721c24;
            font-family: 'Courier New', monospace;
            font-size: 13px;
        }
        .action-box {
            background-color: #d1ecf1;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #17a2b8;
        }
        code {
            background-color: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚠️ Whop Membership Cancellation Failed</h1>
        </div>

        <div class="content">
            <p>Hello Admin,</p>

            <div class="warning-box">
                <h3>⚠️ Automatic Membership Cancellation Failed</h3>
                <p>A product was <strong>successfully delivered</strong> to the customer, but the automatic cancellation of the Whop membership failed after multiple retry attempts.</p>
            </div>

            <div class="payment-details">
                <h3 style="margin-top: 0;">Payment & Membership Details</h3>
                <div class="detail-row">
                    <span class="label">Payment ID:</span>
                    <span class="value">#{{ $payment->id }}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Plan Type:</span>
                    <span class="value">{{ $planType }}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Customer Email:</span>
                    <span class="value">{{ $payment->email }}</span>
                </div>
                @if($payment->whop_membership_id)
                <div class="detail-row">
                    <span class="label">Whop Membership ID:</span>
                    <span class="value"><strong>{{ $payment->whop_membership_id }}</strong></span>
                </div>
                @endif
            </div>

            @if($errorMessage && $errorMessage !== 'Unknown error')
            <div class="error-box">
                <strong>Error Message:</strong><br>
                {{ $errorMessage }}
            </div>
            @endif

            <div class="action-box">
                <h3 style="margin-top: 0;">Required Actions</h3>
                <ol>
                    <li><strong>Manually cancel the Whop membership</strong> with ID: <code>{{ $payment->whop_membership_id ?? 'N/A' }}</code></li>
                    <li><strong>Log into the Whop dashboard</strong> at <a href="https://whop.com" target="_blank">whop.com</a></li>
                    <li><strong>Navigate to Memberships</strong> and search for membership ID</li>
                    <li><strong>Cancel the membership immediately</strong> to allow the customer to make future purchases</li>
                </ol>
            </div>

            <h3>Technical Details</h3>
            <p>The system attempted to cancel the membership via the Whop API with multiple retry attempts but was unsuccessful. Check the Laravel logs for more details:</p>
            <code>tail -f storage/logs/laravel.log</code>
        </div>
    </div>
</body>
</html>
```

---

### Step 5: Integrate into Delivery Service

**File**: `app/Services/AccountDeliveryService.php` (or your equivalent)

Add the cancellation call after successful delivery:

```php
use App\Jobs\CancelWhopMembership;

class AccountDeliveryService
{
    public function deliverAccount(Payment $payment): bool
    {
        try {
            // ... existing delivery logic ...

            // Send delivery emails
            Mail::to($payment->email)->send(new AccountDeliveryEmail($payment));
            Mail::to(self::ADMIN_EMAIL)->send(new AdminAccountDeliveredEmail($payment));

            // Cancel Whop membership asynchronously after successful delivery
            $this->cancelWhopMembership($payment);

            // ... rest of delivery logic ...

            return true;
        } catch (\Exception $e) {
            Log::error("Failed to deliver account: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Cancel Whop membership asynchronously after successful delivery
     * Uses a queued job to avoid blocking the webhook response
     */
    private function cancelWhopMembership(Payment $payment): void
    {
        // Only attempt cancellation if we have a Whop membership ID
        if (empty($payment->whop_membership_id)) {
            Log::info("No Whop membership ID found for payment {$payment->id}, skipping cancellation");
            return;
        }

        // Dispatch the cancellation job to run in the background
        // This ensures the webhook responds quickly to Whop
        CancelWhopMembership::dispatch($payment)
            ->delay(now()->addSeconds(5)); // Wait 5 seconds to ensure delivery emails are sent first

        Log::info("Whop membership cancellation job dispatched for payment {$payment->id}", [
            'payment_id' => $payment->id,
            'membership_id' => $payment->whop_membership_id,
            'customer_email' => $payment->email,
        ]);
    }
}
```

**Why 5-second delay?**
- Ensures delivery emails are sent before cancellation
- Prevents race conditions
- Gives webhook time to return 200 OK to Whop

---

### Step 6: Update Webhook Handler

**File**: `app/Http/Controllers/WhopWebhookController.php`

Fix payment record matching to avoid updating stale records:

```php
private function handleSuccessfulPayment($data)
{
    try {
        $email = $data['user']['email'] ?? null;
        $planId = $data['plan']['id'] ?? null;
        $paymentId = $data['id'] ?? null;
        $membershipId = $data['membership']['id'] ?? null;

        // ... validation ...

        // Find payment record by trying multiple methods
        // 1. Try by whop_payment_id (most specific)
        $payment = Payment::where('whop_payment_id', $paymentId)->first();

        // 2. Try by membership_id (links payment.succeeded to membership.activated)
        if (!$payment && $membershipId) {
            $payment = Payment::where('whop_membership_id', $membershipId)->first();
        }

        // 3. Try most recent pending payment for this plan (created in last 10 minutes)
        // This ensures we get the payment created when user opened checkout, not an old one
        if (!$payment) {
            $payment = Payment::where('plan_id', $planId)
                ->where('status', 'pending')
                ->where('created_at', '>=', now()->subMinutes(10))
                ->latest()
                ->first();
        }

        if ($payment) {
            // Update existing payment
            $payment->update([
                'email' => $email,
                'whop_payment_id' => $paymentId,
                'whop_membership_id' => $membershipId,
                'status' => 'paid',
                'amount' => $amount,
                'currency' => $currency,
                'paid_at' => now(),
                'metadata' => $data,
            ]);
        } else {
            // Create new payment record
            $payment = Payment::create([
                'email' => $email,
                'whop_payment_id' => $paymentId,
                'whop_membership_id' => $membershipId,
                'plan_type' => $this->determinePlanType($planId),
                'plan_id' => $planId,
                'status' => 'paid',
                'amount' => $amount,
                'currency' => $currency,
                'paid_at' => now(),
                'metadata' => $data,
            ]);
        }

        // Trigger auto-delivery
        $deliveryService = new AccountDeliveryService();
        $deliveryService->deliverAccount($payment);

        return response()->json(['message' => 'Payment processed successfully'], 200);

    } catch (\Exception $e) {
        Log::error('Error processing Whop payment webhook: ' . $e->getMessage());
        return response()->json(['error' => 'Internal server error'], 500);
    }
}
```

**Key Improvement**: The 10-minute time window prevents webhook from updating old payment records.

---

## Configuration

### Environment Variables

Add to your `.env` file:

```env
# Whop API Configuration
WHOP_ENABLED=true
WHOP_API_KEY=apik_xxxxxxxxxxxxxxxxxxxxxxxx
WHOP_API_URL=https://api.whop.com/api/v1

# Queue Configuration
QUEUE_CONNECTION=database
```

### Database Queue Setup

If using database queue (recommended for simplicity):

```bash
php artisan queue:table
php artisan migrate
```

---

## Deployment

### Production Server Setup

#### Option 1: Supervisor (Recommended)

1. **Install Supervisor**:
```bash
sudo apt-get install supervisor
```

2. **Create config file**: `/etc/supervisor/conf.d/yourapp-worker.conf`
```ini
[program:yourapp-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/your/app/artisan queue:work database --tries=3 --timeout=60 --sleep=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/path/to/your/app/storage/logs/queue-worker.log
stopwaitsecs=3600
```

3. **Start Supervisor**:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start yourapp-worker:*
```

4. **Check status**:
```bash
sudo supervisorctl status yourapp-worker:*
```

#### Option 2: systemd Service

1. **Create service file**: `/etc/systemd/system/yourapp-queue.service`
```ini
[Unit]
Description=YourApp Queue Worker
After=network.target

[Service]
User=www-data
Group=www-data
Restart=always
ExecStart=/usr/bin/php /path/to/your/app/artisan queue:work database --tries=3 --timeout=60 --sleep=3

[Install]
WantedBy=multi-user.target
```

2. **Enable and start**:
```bash
sudo systemctl enable yourapp-queue
sudo systemctl start yourapp-queue
sudo systemctl status yourapp-queue
```

### Deployment Workflow

After each deployment:

1. **Restart queue workers**:
```bash
# With Supervisor:
sudo supervisorctl restart yourapp-worker:*

# With systemd:
sudo systemctl restart yourapp-queue

# Or use Laravel command (works with all):
php artisan queue:restart
```

2. **Clear caches**:
```bash
php artisan config:clear
php artisan cache:clear
```

---

## Troubleshooting

### Common Issues

#### 1. Webhook Timeout / No Redirect

**Symptoms**:
- Checkout doesn't redirect to success page
- Membership is canceled but redirect fails

**Cause**: Delivery process takes too long, webhook times out

**Solution**: Ensure cancellation happens asynchronously:
```php
// BAD - Synchronous (blocks webhook)
$whopService->cancelMembership($membershipId);

// GOOD - Asynchronous (doesn't block)
CancelWhopMembership::dispatch($payment)->delay(now()->addSeconds(5));
```

#### 2. Wrong Payment Record Updated

**Symptoms**:
- Old payment gets marked as 'paid'
- New payment stays 'pending'
- Redirect never happens

**Cause**: Webhook finds old payment record

**Solution**: Add time-based filtering:
```php
$payment = Payment::where('plan_id', $planId)
    ->where('status', 'pending')
    ->where('created_at', '>=', now()->subMinutes(10)) // KEY LINE
    ->latest()
    ->first();
```

#### 3. Cancellation Fails Silently

**Symptoms**:
- No error logs
- Membership not canceled
- No admin notification

**Cause**: Queue worker not running

**Solution**:
```bash
# Check if queue worker is running
ps aux | grep "queue:work"

# Start queue worker
php artisan queue:work --tries=3 --timeout=60

# Or restart supervisor
sudo supervisorctl restart yourapp-worker:*
```

#### 4. API Key Invalid

**Symptoms**:
- All cancellation attempts fail with 401
- Error: "Unauthorized"

**Cause**: Invalid or missing API key

**Solution**:
1. Verify `.env` has correct `WHOP_API_KEY`
2. Check API key has required scopes in Whop dashboard
3. Clear config cache: `php artisan config:clear`

#### 5. Job Fails Immediately

**Symptoms**:
- Job appears in `failed_jobs` table
- Error: "Payment model not found"

**Cause**: Payment record deleted or serialization issue

**Solution**:
```bash
# Check failed jobs
php artisan queue:failed

# Retry failed jobs
php artisan queue:retry all

# Or retry specific job
php artisan queue:retry <job-id>
```

### Monitoring

#### Check Queue Status
```bash
# View failed jobs
php artisan queue:failed

# Monitor queue in real-time
php artisan queue:listen --timeout=60

# Check job count in database
mysql -u root -p yourdb -e "SELECT COUNT(*) FROM jobs;"
```

#### Check Logs
```bash
# Watch Laravel logs in real-time
tail -f storage/logs/laravel.log

# Filter for membership cancellation
tail -f storage/logs/laravel.log | grep "membership cancellation"

# Filter for errors
tail -f storage/logs/laravel.log | grep ERROR
```

#### Useful Log Entries to Look For

**Success**:
```
Background job: Successfully canceled Whop membership mem_xxxxx
```

**Failure**:
```
Failed to cancel Whop membership mem_xxxxx after 3 attempts
Membership cancellation failure alert sent
```

**Queue Issues**:
```
No Whop membership ID found for payment X
Background job: Exception during Whop membership cancellation
```

---

## Testing

### Local Testing

1. **Start queue worker**:
```bash
php artisan queue:work --tries=3 --timeout=60
```

2. **Make test purchase** on Whop with test plan

3. **Monitor logs**:
```bash
tail -f storage/logs/laravel.log
```

4. **Verify in Whop dashboard**:
   - Check membership status is "Canceled"
   - Verify cancellation timestamp

### Test Checklist

- [ ] Checkout completes successfully
- [ ] Customer redirected to success page
- [ ] Product delivered to customer email
- [ ] Admin receives delivery notification
- [ ] Membership cancellation job dispatched (check logs)
- [ ] Membership canceled in Whop dashboard within 10 seconds
- [ ] Customer can make repeat purchase

### Failure Testing

Test admin notifications work:

1. **Temporarily break API key**:
```env
WHOP_API_KEY=invalid_key
```

2. **Make purchase**

3. **Verify**:
   - Admin receives failure email
   - Email contains membership ID
   - Email has manual cancellation instructions

4. **Restore API key** and test again

---

## Performance Considerations

### Timing Breakdown

```
Webhook received
    ↓ (< 100ms)
Deliver product
    ↓ (< 500ms)
Send emails
    ↓ (< 200ms)
Dispatch job
    ↓ (< 50ms)
Return 200 OK to Whop
    ↓
[Total: < 1 second]

[5 second delay]
    ↓
Execute cancellation job
    ↓ (1-7 seconds with retries)
Complete
```

### Scalability

**Database Queue**: Suitable for low-medium volume (< 1000 jobs/hour)

**For High Volume**, switch to Redis:

```env
QUEUE_CONNECTION=redis
```

And run multiple workers:

```ini
[program:yourapp-worker]
numprocs=4  # Run 4 workers
process_name=%(program_name)s_%(process_num)02d
```

---

## Security Considerations

### Webhook Validation

Add webhook signature verification:

```php
public function handleWebhook(Request $request)
{
    // Verify webhook signature
    $signature = $request->header('Whop-Signature');
    $secret = config('payment.providers.whop.webhook_secret');

    $computedSignature = hash_hmac('sha256', $request->getContent(), $secret);

    if (!hash_equals($signature, $computedSignature)) {
        Log::warning('Invalid webhook signature');
        return response()->json(['error' => 'Invalid signature'], 401);
    }

    // Process webhook...
}
```

### API Key Protection

- Store API key in `.env` file (never commit to git)
- Use different keys for development/production
- Rotate keys periodically
- Monitor API usage in Whop dashboard

---

## Summary

This implementation provides:

✅ **Automatic membership cancellation** after purchase
✅ **No webhook timeouts** via asynchronous processing
✅ **Reliable delivery** with retry logic
✅ **Admin notifications** when issues occur
✅ **Production-ready** with queue worker setup
✅ **Comprehensive logging** for debugging

### Key Takeaways

1. **Always use background jobs** for external API calls in webhooks
2. **Implement retry logic** at multiple levels (API + Job)
3. **Add time-based filtering** when matching payment records
4. **Monitor via logs** and admin notifications
5. **Test failure scenarios** to ensure notifications work

---

## Additional Resources

- [Whop API Documentation](https://docs.whop.com/api-reference)
- [Laravel Queues Documentation](https://laravel.com/docs/queues)
- [Supervisor Documentation](http://supervisord.org/)

---

**Questions or Issues?**

Check logs first: `tail -f storage/logs/laravel.log`

Look for:
- "Successfully canceled Whop membership" (success)
- "Failed to cancel Whop membership" (failure)
- Error messages with membership IDs and reasons
