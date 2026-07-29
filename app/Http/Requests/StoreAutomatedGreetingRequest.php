<?php

namespace App\Http\Requests;

use App\Concerns\AutomatedGreetingValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreAutomatedGreetingRequest extends FormRequest
{
    use AutomatedGreetingValidationRules;

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
        return $this->automatedGreetingRules();
    }
}
