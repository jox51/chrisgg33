<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'email',
        'phone',
        'whop_payment_id',
        'whop_membership_id',
        'plan_type',
        'plan_id',
        'status',
        'amount',
        'currency',
        'paid_at',
        'emails_sent',
    ];

    protected $casts = [
        'paid_at' => 'datetime',
        'amount' => 'decimal:2',
        'emails_sent' => 'boolean',
    ];

    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }
}
