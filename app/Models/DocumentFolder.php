<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string|null $name
 * @property string|null $description
 * @property string|null $parent_id
 * @property string|null $created_by_id
 * @property string|null $modified_by_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable([
    'id', 'name', 'description', 'parent_id', 'created_by_id', 'modified_by_id',
])]
class DocumentFolder extends Model
{
    use SoftDeletes;

    /** EspoCRM uses varchar(17) PKs — not auto-increment integers. */
    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * Parent folder (immediate ancestor).
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(DocumentFolder::class, 'parent_id');
    }

    /**
     * Direct child folders.
     */
    public function children(): HasMany
    {
        return $this->hasMany(DocumentFolder::class, 'parent_id');
    }

    /**
     * All ancestor closure rows where this folder is the descendant.
     */
    public function ancestorPaths(): HasMany
    {
        return $this->hasMany(DocumentFolderPath::class, 'descendor_id');
    }

    /**
     * All descendant closure rows where this folder is the ancestor.
     */
    public function descendantPaths(): HasMany
    {
        return $this->hasMany(DocumentFolderPath::class, 'ascendor_id');
    }

    /**
     * Documents directly inside this folder.
     */
    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'folder_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function modifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'modified_by_id');
    }
}
