<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Closure-table row: one entry per (ancestor, descendant) pair,
 * including self-pairs (ascendor_id === descendor_id).
 *
 * @property int $id
 * @property string|null $ascendor_id
 * @property string|null $descendor_id
 */
class DocumentFolderPath extends Model
{
    public $timestamps = false;

    protected $fillable = ['ascendor_id', 'descendor_id'];

    public function ascendor(): BelongsTo
    {
        return $this->belongsTo(DocumentFolder::class, 'ascendor_id');
    }

    public function descendor(): BelongsTo
    {
        return $this->belongsTo(DocumentFolder::class, 'descendor_id');
    }
}
