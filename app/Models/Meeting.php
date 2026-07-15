<?php

namespace App\Models;

use Database\Factories\MeetingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string|null $name
 * @property string $status
 * @property Carbon|null $date_start
 * @property Carbon|null $date_end
 * @property bool $is_all_day
 * @property string|null $description
 * @property string|null $uid
 * @property string|null $join_url
 * @property string|null $external_service
 * @property \Illuminate\Support\Carbon|null $date_start_date
 * @property \Illuminate\Support\Carbon|null $date_end_date
 * @property Carbon|null $stream_updated_at
 * @property int|null $parent_id
 * @property string|null $parent_type
 * @property int|null $account_id
 * @property int|null $created_by_id
 * @property int|null $modified_by_id
 * @property int|null $assigned_user_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable([
    'name', 'status', 'date_start', 'date_end', 'is_all_day', 'description', 'uid',
    'join_url', 'external_service', 'date_start_date', 'date_end_date', 'stream_updated_at',
    'parent_id', 'parent_type', 'account_id',
    'created_by_id', 'modified_by_id', 'assigned_user_id',
])]
class Meeting extends Model
{
    /** @use HasFactory<MeetingFactory> */
    use HasFactory, SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_start' => 'datetime',
            'date_end' => 'datetime',
            'is_all_day' => 'boolean',
            'date_start_date' => 'date',
            'date_end_date' => 'date',
            'stream_updated_at' => 'datetime',
        ];
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

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'meeting_user')
            ->using(MeetingUser::class)
            ->withPivot('status')
            ->wherePivotNull('deleted_at');
    }

    public function leads(): BelongsToMany
    {
        return $this->belongsToMany(Lead::class, 'lead_meeting')
            ->using(LeadMeeting::class)
            ->withPivot('status')
            ->wherePivotNull('deleted_at');
    }

    /**
     * Raw invitee rows; there is no `Contact` model in this app yet.
     */
    public function contactMeetings(): HasMany
    {
        return $this->hasMany(ContactMeeting::class);
    }

    public function leadMeetings(): HasMany
    {
        return $this->hasMany(LeadMeeting::class);
    }
}
