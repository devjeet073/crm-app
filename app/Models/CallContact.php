<?php

namespace App\Models;

use Database\Factories\CallContactFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $call_id
 * @property int|null $contact_id
 * @property string $status
 * @property Carbon|null $deleted_at
 */
#[Fillable(['call_id', 'contact_id', 'status'])]
#[WithoutTimestamps]
class CallContact extends Pivot
{
    /** @use HasFactory<CallContactFactory> */
    use HasFactory, SoftDeletes;

    public $incrementing = true;

    public function call(): BelongsTo
    {
        return $this->belongsTo(Call::class);
    }

    // No `Contact` model exists in this app yet; `contact_id` is a plain column for now.
}
