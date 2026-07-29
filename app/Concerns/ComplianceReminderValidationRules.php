<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait ComplianceReminderValidationRules
{
    /**
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function complianceReminderRules(bool $isUpdate = false): array
    {
        $rules = [
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::in(['gst', 'itr', 'emi', 'other'])],
            'due_date' => ['required', 'date'],
            'amount' => ['nullable', 'numeric', 'min:0'],
            'risk_level' => ['required', Rule::in(['low', 'medium', 'high', 'critical'])],
            'remind_days_before' => ['required', 'integer', 'min:1', 'max:90'],
            'recurring_frequency' => ['required', Rule::in(['none', 'monthly', 'quarterly', 'yearly'])],
            'notes' => ['nullable', 'string'],
            'assigned_user_id' => ['nullable', Rule::exists(User::class, 'id')],
        ];

        if ($isUpdate) {
            $rules['status'] = ['required', Rule::in(['pending', 'reminded', 'completed', 'overdue'])];
        }

        return $rules;
    }
}
