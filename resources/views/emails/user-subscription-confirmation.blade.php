<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Purchase Confirmed - {{ config('app.name') }}</title>
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
            background-color: #28a745;
            color: white;
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
        .footer {
            text-align: center;
            margin-top: 20px;
            padding: 20px;
            color: #6c757d;
            font-size: 14px;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .btn:hover {
            background-color: #0056b3;
        }
        .subscription-details {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #28a745;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            background-color: #28a745;
            color: white;
            border-radius: 3px;
            font-size: 12px;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Purchase Confirmed!</h1>
    </div>

    <div class="content">
        <h2>Hello {{ $user->name }}!</h2>

        <p>Great news! Your purchase of <strong>{{ $planName }}</strong> has been confirmed.</p>

        <div class="subscription-details">
            <h3>Purchase Details:</h3>
            <p><strong>Service:</strong> {{ $planName }}</p>
            <p><strong>Price:</strong> {{ $price }}</p>
            <p><strong>Status:</strong> <span class="status-badge">{{ ucfirst($subscriptionStatus) }}</span></p>
            <p><strong>Email:</strong> {{ $user->email }}</p>
            @if($phone)
            <p><strong>Phone:</strong> {{ $phone }}</p>
            @endif
        </div>

        <p>Here's what happens next:</p>
        <ul>
            <li>Chris will reach out to schedule your session</li>
            <li>Check your email for scheduling details</li>
            <li>Prepare any questions you'd like to discuss</li>
            <li>Contact us if you need to reschedule</li>
        </ul>

        @if($user instanceof \App\Models\User)
        <div style="text-align: center;">
            <a href="{{ route('dashboard') }}" class="btn">Access Your Dashboard</a>
        </div>
        @endif

        <p>If you have any questions about your purchase or need assistance, please don't hesitate to contact our support team.</p>

        <p>Thank you for choosing {{ config('app.name') }}!</p>
        <p>The {{ config('app.name') }} Team</p>
    </div>

    <div class="footer">
        <p>This email was sent to {{ $user->email ?? '' }} regarding your purchase on {{ config('app.name') }}.</p>
        <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
    </div>
</body>
</html>