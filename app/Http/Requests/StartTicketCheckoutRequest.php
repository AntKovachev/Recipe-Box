<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StartTicketCheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'flight.id' => ['required', 'integer'],
            'flight.from' => ['required', 'string'],
            'flight.to' => ['required', 'string'],
            'flight.date' => ['required', 'date'],
            'flight.time' => ['required', 'string'],
            'flight.price' => ['required', 'numeric'],
        ];
    }
}
