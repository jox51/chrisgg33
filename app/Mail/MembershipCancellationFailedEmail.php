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

    public function __construct(
        public Payment $payment,
        public ?string $errorMessage = null
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Whop Membership Cancellation Failed - Payment #{$this->payment->id}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.membership-cancellation-failed',
            with: [
                'payment' => $this->payment,
                'errorMessage' => $this->errorMessage ?? 'Unknown error',
                'planType' => config("payment.plan_names.{$this->payment->plan_type}", ucfirst($this->payment->plan_type)),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
