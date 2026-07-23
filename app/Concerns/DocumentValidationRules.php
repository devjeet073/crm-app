<?php

namespace App\Concerns;

use App\Models\DocumentFolder;
use App\Models\User;
use App\Picklists;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

trait DocumentValidationRules
{
    /**
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function documentRules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', Rule::in(Picklists::DOCUMENT_STATUSES)],
            'type' => ['nullable', 'string', Rule::in(Picklists::DOCUMENT_TYPES)],
            'publish_date' => ['nullable', 'date'],
            'expiration_date' => ['nullable', 'date', 'after_or_equal:publish_date'],
            'description' => ['nullable', 'string'],
            'folder_id' => ['nullable', Rule::exists(DocumentFolder::class, 'id')],
            'assigned_user_id' => ['nullable', Rule::exists(User::class, 'id')],
            'file' => [
                'nullable',
                File::types(Picklists::DOCUMENT_ALLOWED_MIME_TYPES)
                    ->max(51200),
            ],
            'remove_file' => ['nullable', 'boolean'],
        ];
    }

    /**
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function documentFolderRules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'parent_id' => ['nullable', Rule::exists(DocumentFolder::class, 'id')],
        ];
    }
}
