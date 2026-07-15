<?php

namespace App\Models;

use Database\Factories\AppSecretFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string|null $name
 * @property string|null $value
 * @property string|null $description
 * @property string $delete_id
 * @property int|null $created_by_id
 * @property int|null $modified_by_id
 */
#[Fillable(['name', 'value', 'description', 'delete_id', 'created_by_id', 'modified_by_id'])]
class AppSecret extends Model
{
    /** @use HasFactory<AppSecretFactory> */
    use HasFactory, SoftDeletes;

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function modifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'modified_by_id');
    }
}
