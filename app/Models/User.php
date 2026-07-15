<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $type  regular|admin|portal|api|system
 * @property bool $is_active
 * @property string|null $title
 * @property string|null $avatar_color
 * @property string|null $salutation_name
 * @property string|null $middle_name
 * @property string|null $gender
 * @property string|null $auth_method
 * @property string|null $api_key
 * @property int|null $default_team_id
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'password', 'type', 'is_active', 'title', 'avatar_color', 'salutation_name', 'middle_name', 'gender', 'auth_method', 'api_key', 'default_team_id'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at'       => 'datetime',
            'password'                => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_active'               => 'boolean',
        ];
    }

    // ── Access-management helpers ─────────────────────────────────────────

    public function isAdmin(): bool
    {
        return $this->type === 'admin';
    }

    /** Resolve all effective permission levels (direct roles + team roles). */
    public function effectivePermission(string $column): string
    {
        $levels = ['not-set', 'no', 'own', 'team', 'yes', 'all'];

        $directRoles = $this->roles()->get();
        $teamRoles   = Role::whereHas('teams', fn ($q) => $q->whereHas('users', fn ($q) => $q->where('users.id', $this->id)))->get();

        $best = 'not-set';
        foreach ($directRoles->merge($teamRoles) as $role) {
            $val = $role->{$column} ?? 'not-set';
            if (array_search($val, $levels) > array_search($best, $levels)) {
                $best = $val;
            }
        }

        return $best;
    }

    // ── Activity relationships ─────────────────────────────────────────────

    public function calls(): BelongsToMany
    {
        return $this->belongsToMany(Call::class, 'call_user')
            ->using(CallUser::class)
            ->withPivot('status')
            ->wherePivotNull('deleted_at');
    }

    public function meetings(): BelongsToMany
    {
        return $this->belongsToMany(Meeting::class, 'meeting_user')
            ->using(MeetingUser::class)
            ->withPivot('status')
            ->wherePivotNull('deleted_at');
    }

    public function workingTimeRanges(): BelongsToMany
    {
        return $this->belongsToMany(WorkingTimeRange::class, 'user_working_time_range')
            ->using(UserWorkingTimeRange::class)
            ->wherePivotNull('deleted_at');
    }

    public function assignedCalls(): HasMany
    {
        return $this->hasMany(Call::class, 'assigned_user_id');
    }

    public function assignedMeetings(): HasMany
    {
        return $this->hasMany(Meeting::class, 'assigned_user_id');
    }

    public function assignedTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'assigned_user_id');
    }

    public function reminders(): HasMany
    {
        return $this->hasMany(Reminder::class);
    }

    // ── Access-control relationships ──────────────────────────────────────

    /** Roles directly assigned to this user. */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_user')
            ->using(RoleUser::class)
            ->wherePivotNull('deleted_at');
    }

    /** Teams this user belongs to. */
    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'team_user')
            ->using(TeamUser::class)
            ->withPivot('role')
            ->wherePivotNull('deleted_at');
    }

    /** The user's default team. */
    public function defaultTeam(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'default_team_id');
    }

    /** Login audit log entries for this user. */
    public function authLogRecords(): HasMany
    {
        return $this->hasMany(AuthLogRecord::class);
    }
}
