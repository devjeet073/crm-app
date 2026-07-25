<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Handles assign/revoke operations for:
 *  - roles  ↔ users
 *  - roles  ↔ teams
 *  - teams  ↔ users
 */
class AccessManagementController extends Controller
{
    // ── Role ↔ User ─────────────────────────────────────────────────────────

    public function assignRoleToUser(Request $request, Role $role): RedirectResponse
    {
        $request->validate([
            'user_ids' => ['required', 'array'],
            'user_ids.*' => ['exists:users,id'],
        ]);

        $role->users()->syncWithoutDetaching($request->input('user_ids'));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Role assigned to users.')]);

        return back();
    }

    public function revokeRoleFromUser(Request $request, Role $role): RedirectResponse
    {
        $request->validate(['user_id' => ['required', 'exists:users,id']]);

        $role->users()->detach($request->integer('user_id'));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Role revoked from user.')]);

        return back();
    }

    // ── Role ↔ Team ─────────────────────────────────────────────────────────

    public function assignRoleToTeam(Request $request, Role $role): RedirectResponse
    {
        $request->validate(['team_id' => ['required', 'exists:teams,id']]);

        $role->teams()->syncWithoutDetaching([$request->integer('team_id')]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Role assigned to team.')]);

        return back();
    }

    public function revokeRoleFromTeam(Request $request, Role $role): RedirectResponse
    {
        $request->validate(['team_id' => ['required', 'exists:teams,id']]);

        $role->teams()->detach($request->integer('team_id'));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Role revoked from team.')]);

        return back();
    }

    // ── Team ↔ User ─────────────────────────────────────────────────────────

    public function assignUserToTeam(Request $request, Team $team): RedirectResponse
    {
        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'role' => ['nullable', 'string', 'max:100'],
        ]);

        $team->users()->syncWithoutDetaching([
            $request->integer('user_id') => ['role' => $request->input('role')],
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('User added to team.')]);

        return back();
    }

    public function revokeUserFromTeam(Request $request, Team $team): RedirectResponse
    {
        $request->validate(['user_id' => ['required', 'exists:users,id']]);

        $team->users()->detach($request->integer('user_id'));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('User removed from team.')]);

        return back();
    }
}
