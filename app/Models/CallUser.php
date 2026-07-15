<?php

namespace App\Models;

use Database\Factories\CallUserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $user_id
 * @property int|null $call_id
 * @property string $status
 * @property Carbon|null $deleted_at
 */
#[Fillable(['user_id', 'call_id', 'status'])]
#[WithoutTimestamps]
class CallUser extends Pivot
{
    /** @use HasFactory<CallUserFactory> */
    use HasFactory, SoftDeletes;

    public $incrementing = true;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function call(): BelongsTo
    {
        return $this->belongsTo(Call::class);
    }
}
