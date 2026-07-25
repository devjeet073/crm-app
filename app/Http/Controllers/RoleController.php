<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Models\CrmModule;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString() ?: null;

        $roles = Role::query()
            ->withCount(['users', 'teams'])
            ->when($search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('roles/index', [
            'roles' => $roles,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('roles/create', $this->formProps());
    }

    public function store(StoreRoleRequest $request): RedirectResponse
    {
        $role = Role::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Role created.')]);

        return to_route('roles.show', $role);
    }

    public function show(Role $role): Response
    {
        $role->loadCount('users');

        return Inertia::render('roles/show', [
            'role' => $role,
            'users' => Inertia::defer(fn () => $role->users()->get()),
            ...$this->formProps(),
        ]);
    }

    public function edit(Role $role): Response
    {
        return Inertia::render('roles/edit', [
            'role' => $role,
            ...$this->formProps(),
        ]);
    }

    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        $role->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Role updated.')]);

        return to_route('roles.edit', $role);
    }

    public function destroy(Role $role): RedirectResponse
    {
        $role->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Role deleted.')]);

        return to_route('roles.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function formProps(): array
    {
        return [
            'permissionColumns' => Role::permissionColumns(),
            'permissionLevels' => Role::permissionLevels(),
            'crmModules' => CrmModule::pluck('name')->toArray(),
            'crudActions' => ['view', 'insert', 'update', 'delete'],
        ];
    }
}
