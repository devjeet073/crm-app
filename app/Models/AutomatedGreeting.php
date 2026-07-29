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
 * @property string $type birthday|festival
 * @property Carbon|null $event_date
 * @property string $template_subject
 * @property string $template_body
 * @property string $target_type all|leads|users
 * @property string $status active|paused
 * @property bool $recurring
 * @property Carbon|null $last_run_at
 * @property int|null $created_by_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable([
    'title',
    'type',
    'event_date',
    'template_subject',
    'template_body',
    'target_type',
    'status',
    'recurring',
    'last_run_at',
    'created_by_id',
])]
class AutomatedGreeting extends Model
{
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'recurring' => 'boolean',
            'last_run_at' => 'datetime',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }
}
