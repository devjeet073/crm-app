<?php

namespace App\Models;

use Database\Factories\CallLeadFactory;
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
 * @property int|null $lead_id
 * @property string $status
 * @property Carbon|null $deleted_at
 */
#[Fillable(['call_id', 'lead_id', 'status'])]
#[WithoutTimestamps]
class CallLead extends Pivot
{
    /** @use HasFactory<CallLeadFactory> */
    use HasFactory, SoftDeletes;

    public $incrementing = true;

    public function call(): BelongsTo
    {
        return $this->belongsTo(Call::class);
    }

    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }
}
