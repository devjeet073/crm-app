<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Allow self-edit or admin editing any user
        return $this->user()?->isAdmin() || $this->user()?->is($this->route('user'));
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $isAdmin = $this->user()?->isAdmin();

        return [
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'email' => ['sometimes', 'required', 'email', Rule::unique('users', 'email')->ignore($this->route('user'))],
            'title' => ['nullable', 'string', 'max:100'],
            'salutation_name' => ['nullable', 'string', 'max:20'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'gender' => ['nullable', Rule::in(['Male', 'Female', 'Other'])],
            'avatar_color' => ['nullable', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'default_team_id' => ['nullable', 'exists:teams,id'],

            // Admin-only fields
            'type' => $isAdmin ? ['sometimes', 'required', Rule::in(['regular', 'admin', 'portal', 'api'])] : ['prohibited'],
            'is_active' => $isAdmin ? ['sometimes', 'boolean'] : ['prohibited'],
        ];
    }
}
