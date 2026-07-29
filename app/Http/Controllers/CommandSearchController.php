<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommandSearchRequest;
use App\Models\Account;
use App\Models\Lead;
use App\Models\Role;
use App\Models\Task;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class CommandSearchController extends Controller
{
    public function __invoke(CommandSearchRequest $request): JsonResponse
    {
        $search = $request->validated('search');
        $tab = $request->validated('tab') ?? 'all';
        $user = $request->user();
        $isAdmin = $user->isAdmin();

        if (! $search || mb_strlen(trim($search)) < 1) {
            return response()->json(['results' => []]);
        }

        $search = trim($search);
        $limit = 8;
        $results = collect();

        if ($tab === 'all' || $tab === 'accounts') {
            if ($isAdmin || $user->canViewModule('Accounts')) {
                Account::where('name', 'like', "%{$search}%")
                    ->limit($limit)
                    ->get(['id', 'name'])
                    ->each(fn ($r) => $results->push([
                        'id' => $r->id,
                        'label' => $r->name,
                        'entity' => 'Account',
                        'href' => route('accounts.show', $r),
                    ]));
            }
        }

        if ($tab === 'all' || $tab === 'leads') {
            if ($isAdmin || $user->canViewModule('Leads')) {
                Lead::whereAny(['first_name', 'last_name', 'account_name'], 'like', "%{$search}%")
                    ->limit($limit)
                    ->get(['id', 'first_name', 'last_name'])
                    ->each(fn ($r) => $results->push([
                        'id' => $r->id,
                        'label' => trim("{$r->first_name} {$r->last_name}"),
                        'entity' => 'Lead',
                        'href' => route('leads.show', $r),
                    ]));
            }
        }

        if ($tab === 'all' || $tab === 'tasks') {
            if ($isAdmin || $user->canViewModule('Tasks')) {
                Task::where('name', 'like', "%{$search}%")
                    ->limit($limit)
                    ->get(['id', 'name'])
                    ->each(fn ($r) => $results->push([
                        'id' => $r->id,
                        'label' => $r->name,
                        'entity' => 'Task',
                        'href' => route('tasks.show', $r),
                    ]));
            }
        }

        if ($tab === 'all' || $tab === 'users') {
            if ($isAdmin) {
                User::whereAny(['name', 'email'], 'like', "%{$search}%")
                    ->limit($limit)
                    ->get(['id', 'name', 'email'])
                    ->each(fn ($r) => $results->push([
                        'id' => $r->id,
                        'label' => $r->name,
                        'entity' => 'User',
                        'href' => route('users.show', $r),
                    ]));
            }
        }

        if ($tab === 'all' || $tab === 'teams') {
            if ($isAdmin) {
                Team::where('name', 'like', "%{$search}%")
                    ->limit($limit)
                    ->get(['id', 'name'])
                    ->each(fn ($r) => $results->push([
                        'id' => $r->id,
                        'label' => $r->name,
                        'entity' => 'Team',
                        'href' => route('teams.show', $r),
                    ]));
            }
        }

        if ($tab === 'all' || $tab === 'roles') {
            if ($isAdmin) {
                Role::where('name', 'like', "%{$search}%")
                    ->limit($limit)
                    ->get(['id', 'name'])
                    ->each(fn ($r) => $results->push([
                        'id' => $r->id,
                        'label' => $r->name,
                        'entity' => 'Role',
                        'href' => route('roles.show', $r),
                    ]));
            }
        }

        return response()->json(['results' => $results->values()]);
    }
}
