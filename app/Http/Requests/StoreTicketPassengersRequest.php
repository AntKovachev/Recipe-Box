<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTicketPassengersRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'quantity' => ['required', 'integer', 'min:1', 'max:4'],

            'passengers' => ['required', 'array', 'size:' . $this->input('quantity')],

            'passengers.*.first_name' => ['required', 'string', 'max:100'],
            'passengers.*.last_name' => ['required', 'string', 'max:100'],
            'passengers.*.date_of_birth' => ['required', 'date'],
            'passengers.*.nationality' => ['required', 'string', 'max:100'],
            'passengers.*.document_number' => ['required', 'string', 'max:100'],
            'passengers.*.email' => ['required', 'email'],
        ];
    }
}
