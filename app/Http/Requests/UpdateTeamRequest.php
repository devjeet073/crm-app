<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTeamRequest extends FormRequest
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
        return [
            'name'            => ['sometimes', 'required', 'string', 'max:100'],
            'description'     => ['nullable', 'string'],
            'position_list'   => ['nullable', 'array'],
            'position_list.*' => ['string', 'max:100'],
        ];
    }
}
