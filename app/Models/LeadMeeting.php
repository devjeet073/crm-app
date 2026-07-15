<?php

namespace App\Models;

use Database\Factories\LeadMeetingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $lead_id
 * @property int|null $meeting_id
 * @property string $status
 * @property Carbon|null $deleted_at
 */
#[Fillable(['lead_id', 'meeting_id', 'status'])]
#[WithoutTimestamps]
class LeadMeeting extends Pivot
{
    /** @use HasFactory<LeadMeetingFactory> */
    use HasFactory, SoftDeletes;

    public $incrementing = true;

    public function meeting(): BelongsTo
    {
        return $this->belongsTo(Meeting::class);
    }

    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }
}
