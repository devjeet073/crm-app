<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $title
 * @property string $category gst|itr|emi|other
 * @property Carbon $due_date
 * @property float|null $amount
 * @property string $risk_level low|medium|high|critical
 * @property int $remind_days_before
 * @property string $recurring_frequency none|monthly|quarterly|yearly
 * @property string $status pending|reminded|completed|overdue
 * @property string|null $notes
 * @property int|null $assigned_user_id
 * @property int|null $created_by_id
 * @property Carbon|null $last_notified_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable([
    'title',
    'category',
    'due_date',
    'amount',
    'risk_level',
    'remind_days_before',
    'recurring_frequency',
    'status',
    'notes',
    'assigned_user_id',
    'created_by_id',
    'last_notified_at',
])]
class ComplianceReminder extends Model
{
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'due_date' => 'date',
            'amount' => 'decimal:2',
            'remind_days_before' => 'integer',
            'last_notified_at' => 'datetime',
        ];
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }
}
