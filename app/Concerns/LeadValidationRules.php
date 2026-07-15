<?php

namespace App\Concerns;

use App\Models\User;
use App\Picklists;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait LeadValidationRules
{
    /**
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function leadRules(): array
    {
        return [
            'salutation_name' => ['nullable', 'string', Rule::in(Picklists::SALUTATIONS)],
            'first_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'title' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'string', Rule::in(Picklists::LEAD_STATUSES)],
            'source' => ['nullable', 'string', Rule::in(Picklists::LEAD_SOURCES)],
            'industry' => ['nullable', 'string', Rule::in(Picklists::INDUSTRIES)],
            'opportunity_amount' => ['nullable', 'numeric', 'min:0'],
            'opportunity_amount_currency' => ['nullable', 'string', 'size:3'],
            'website' => ['nullable', 'string', 'max:255'],
            'address_street' => ['nullable', 'string', 'max:255'],
            'address_city' => ['nullable', 'string', 'max:100'],
            'address_state' => ['nullable', 'string', 'max:100'],
            'address_country' => ['nullable', 'string', 'max:100'],
            'address_postal_code' => ['nullable', 'string', 'max:40'],
            'do_not_call' => ['sometimes', 'boolean'],
            'description' => ['nullable', 'string'],
            'account_name' => ['nullable', 'string', 'max:255'],
            'assigned_user_id' => ['nullable', Rule::exists(User::class, 'id')],
        ];
    }
}
