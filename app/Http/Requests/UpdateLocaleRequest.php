<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateLocaleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $supportedLocales = config('app.available_locales', [
            'en' => 'English',
            'es' => 'Spanish',
            'fr' => 'French',
        ]);

        return [
            'locale' => ['required', 'string', 'in:'.implode(',', array_keys($supportedLocales))],
        ];
    }
}
