<?php

namespace App\Http\Requests;

use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $levels = Role::permissionLevels();

        $permissionRules = collect(Role::permissionColumns())
            ->mapWithKeys(fn ($col) => [$col => ['nullable', Rule::in($levels)]])
            ->all();

        return array_merge([
            'name' => ['sometimes', 'required', 'string', 'max:150', Rule::unique('roles', 'name')->ignore($this->route('role'))],
            'description' => ['nullable', 'string'],
            'data' => ['nullable', 'array'],
            'data.*' => ['nullable', 'array'],
            'data.*.*' => ['nullable', 'string', Rule::in($levels)],
            'field_data' => ['nullable', 'array'],
        ], $permissionRules);
    }
}
