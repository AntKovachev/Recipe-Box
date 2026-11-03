<?php

namespace App\Http\Requests;

use App\Enums\CollectionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

class CollectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', Rule::enum(CollectionType::class)],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
