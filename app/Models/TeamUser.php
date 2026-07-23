<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * Pivot model for the team_user junction table.
 * Carries an optional `role` string (position label within the team).
 *
 * @property int $id
 * @property int $team_id
 * @property int $user_id
 * @property string|null $role
 * @property Carbon|null $deleted_at
 */
class TeamUser extends Pivot
{
    use SoftDeletes;

    public $incrementing = true;

    protected $table = 'team_user';
}
