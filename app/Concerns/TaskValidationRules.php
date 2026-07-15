<?php

namespace App\Concerns;

use App\Models\User;
use App\Picklists;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait TaskValidationRules
{
    /**
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function taskRules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'status' => ['nullable', 'string', Rule::in(Picklists::TASK_STATUSES)],
            'priority' => ['nullable', 'string', Rule::in(Picklists::TASK_PRIORITIES)],
            'date_start' => ['nullable', 'date'],
            'date_end' => ['nullable', 'date', 'after_or_equal:date_start'],
            'date_start_date' => ['nullable', 'date'],
            'date_end_date' => ['nullable', 'date', 'after_or_equal:date_start_date'],
            'description' => ['nullable', 'string'],
            'account_id' => ['nullable', 'integer'],
            'contact_id' => ['nullable', 'integer'],
            'assigned_user_id' => ['nullable', Rule::exists(User::class, 'id')],
        ];
    }
}
