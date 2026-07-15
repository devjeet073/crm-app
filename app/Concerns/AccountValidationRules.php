<?php

namespace App\Concerns;

use App\Models\User;
use App\Picklists;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait AccountValidationRules
{
    /**
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function accountRules(): array
    {
        return [
            'name' => ['required', 'string', 'max:249'],
            'website' => ['nullable', 'string', 'max:255', 'url'],
            'type' => ['nullable', 'string', Rule::in(Picklists::ACCOUNT_TYPES)],
            'industry' => ['nullable', 'string', Rule::in(Picklists::INDUSTRIES)],
            'sic_code' => ['nullable', 'string', 'max:40'],
            'billing_address_street' => ['nullable', 'string', 'max:255'],
            'billing_address_city' => ['nullable', 'string', 'max:100'],
            'billing_address_state' => ['nullable', 'string', 'max:100'],
            'billing_address_country' => ['nullable', 'string', 'max:100'],
            'billing_address_postal_code' => ['nullable', 'string', 'max:40'],
            'shipping_address_street' => ['nullable', 'string', 'max:255'],
            'shipping_address_city' => ['nullable', 'string', 'max:100'],
            'shipping_address_state' => ['nullable', 'string', 'max:100'],
            'shipping_address_country' => ['nullable', 'string', 'max:100'],
            'shipping_address_postal_code' => ['nullable', 'string', 'max:40'],
            'description' => ['nullable', 'string'],
            'is_locked' => ['sometimes', 'boolean'],
            'assigned_user_id' => ['nullable', Rule::exists(User::class, 'id')],
        ];
    }
}
