<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * Pivot model for the role_team junction table.
 *
 * @property int $id
 * @property int $role_id
 * @property int $team_id
 * @property Carbon|null $deleted_at
 */
class RoleTeam extends Pivot
{
    use SoftDeletes;

    public $incrementing = true;

    protected $table = 'role_team';
}
