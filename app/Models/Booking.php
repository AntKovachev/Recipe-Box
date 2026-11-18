<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'uuid',
        'user_id',
        'flight',
        'passengers',
        'quantity',
        'total_price',
        'status',
        'payment_method',
        'stripe_checkout_session_id',
        'stripe_payment_intent_id',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'flight' => 'array',
            'passengers' => 'array',
            'paid_at' => 'datetime',
        ];
    }
}
