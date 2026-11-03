<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RecipeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'instructions' => ['required', 'string'],
            'prep_time' => ['required', 'integer', 'min:0'],
            'cook_time' => ['required', 'integer', 'min:0'],
            'servings' => ['required', 'integer', 'min:1'],
        ];
    }
}
