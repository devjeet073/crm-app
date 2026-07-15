<?php

namespace App\Models;

use Database\Factories\ContactMeetingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $contact_id
 * @property int|null $meeting_id
 * @property string $status
 * @property Carbon|null $deleted_at
 */
#[Fillable(['contact_id', 'meeting_id', 'status'])]
#[WithoutTimestamps]
class ContactMeeting extends Pivot
{
    /** @use HasFactory<ContactMeetingFactory> */
    use HasFactory, SoftDeletes;

    public $incrementing = true;

    public function meeting(): BelongsTo
    {
        return $this->belongsTo(Meeting::class);
    }

    // No `Contact` model exists in this app yet; `contact_id` is a plain column for now.
}
