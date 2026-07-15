<?php

namespace App\Models;

use Database\Factories\TaskFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string|null $name
 * @property string $status
 * @property string $priority
 * @property Carbon|null $date_start
 * @property Carbon|null $date_end
 * @property \Illuminate\Support\Carbon|null $date_start_date
 * @property \Illuminate\Support\Carbon|null $date_end_date
 * @property Carbon|null $date_completed
 * @property string|null $description
 * @property Carbon|null $stream_updated_at
 * @property int|null $parent_id
 * @property string|null $parent_type
 * @property int|null $account_id
 * @property int|null $contact_id
 * @property int|null $email_id
 * @property int|null $created_by_id
 * @property int|null $modified_by_id
 * @property int|null $assigned_user_id
 * @property int $version_number
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable([
    'name', 'status', 'priority', 'date_start', 'date_end', 'date_start_date', 'date_end_date',
    'date_completed', 'description', 'stream_updated_at',
    'parent_id', 'parent_type', 'account_id', 'contact_id', 'email_id',
    'created_by_id', 'modified_by_id', 'assigned_user_id', 'version_number',
])]
class Task extends Model
{
    /** @use HasFactory<TaskFactory> */
    use HasFactory, SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_start' => 'datetime',
            'date_end' => 'datetime',
            'date_start_date' => 'date',
            'date_end_date' => 'date',
            'date_completed' => 'datetime',
            'stream_updated_at' => 'datetime',
            'version_number' => 'integer',
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
}
