<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string|null $name
 * @property string $status
 * @property string|null $type
 * @property string|null $publish_date
 * @property string|null $expiration_date
 * @property string|null $description
 * @property string|null $file_id
 * @property string|null $folder_id
 * @property string|null $created_by_id
 * @property string|null $modified_by_id
 * @property string|null $assigned_user_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable([
    'id', 'name', 'status', 'type', 'publish_date', 'expiration_date',
    'description', 'file_id', 'folder_id',
    'created_by_id', 'modified_by_id', 'assigned_user_id',
])]
class Document extends Model
{
    use SoftDeletes;

    /** EspoCRM uses varchar(17) PKs — not auto-increment integers. */
    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'publish_date' => 'date',
            'expiration_date' => 'date',
        ];
    }

    // ── Relationships ──────────────────────────────────────────────────────

    public function file(): BelongsTo
    {
        return $this->belongsTo(File::class, 'file_id');
    }

    public function folder(): BelongsTo
    {
        return $this->belongsTo(DocumentFolder::class, 'folder_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function modifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'modified_by_id');
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    /**
     * Leads linked to this document via document_lead junction.
     */
    public function leads(): BelongsToMany
    {
        return $this->belongsToMany(Lead::class, 'document_lead', 'document_id', 'lead_id')
            ->wherePivot('deleted', 0);
    }

    /**
     * Accounts linked to this document via account_document junction.
     */
    public function accounts(): BelongsToMany
    {
        return $this->belongsToMany(Account::class, 'account_document', 'document_id', 'account_id')
            ->wherePivot('deleted', 0);
    }
}
