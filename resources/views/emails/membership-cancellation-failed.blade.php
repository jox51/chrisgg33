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
        }
        .header {
            background-color: #ffc107;
            color: #333;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .content {
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            border: 1px solid #e9ecef;
        }
        .warning-box {
            background-color: #fff3cd;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #ffc107;
            color: #856404;
        }
        .payment-details {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #6c757d;
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
            padding: 15px;
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
        .footer {
            text-align: center;
            margin-top: 20px;
            padding: 20px;
            color: #6c757d;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Whop Membership Cancellation Failed</h1>
    </div>

    <div class="content">
        <p>Hello Admin,</p>

        <div class="warning-box">
            <strong>Automatic Membership Cancellation Failed</strong>
            <p>A purchase was completed successfully, but the automatic cancellation of the Whop membership failed after multiple retry attempts. The customer's membership needs to be canceled manually.</p>
        </div>

        <div class="payment-details">
            <h3 style="margin-top: 0;">Payment Details</h3>
            <p><strong>Payment ID:</strong> #{{ $payment->id }}</p>
            <p><strong>Service:</strong> {{ $planType }}</p>
            <p><strong>Customer Email:</strong> {{ $payment->email }}</p>
            @if($payment->whop_membership_id)
            <p><strong>Whop Membership ID:</strong> <code>{{ $payment->whop_membership_id }}</code></p>
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
                <li><strong>Log into the Whop dashboard</strong> at <a href="https://whop.com" target="_blank">whop.com</a></li>
                <li><strong>Navigate to Memberships</strong> and search for: <code>{{ $payment->whop_membership_id ?? 'N/A' }}</code></li>
                <li><strong>Cancel the membership immediately</strong> so the customer can make future purchases</li>
            </ol>
        </div>
    </div>

    <div class="footer">
        <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
    </div>
</body>
</html>
