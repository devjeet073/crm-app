<?php

namespace App\Concerns;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait AutomatedGreetingValidationRules
{
    /**
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function automatedGreetingRules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::in(['birthday', 'festival'])],
            'event_date' => ['nullable', 'date'],
            'template_subject' => ['required', 'string', 'max:255'],
            'template_body' => ['required', 'string'],
            'target_type' => ['required', Rule::in(['all', 'leads', 'users'])],
            'status' => ['required', Rule::in(['active', 'paused'])],
            'recurring' => ['sometimes', 'boolean'],
        ];
    }
}
