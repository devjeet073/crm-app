<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAccountRequest;
use App\Http\Requests\UpdateAccountRequest;
use App\Models\Account;
use App\Models\User;
use App\Picklists;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString() ?: null;
        [$sort, $direction] = $this->resolveSort($request);

        $accounts = Account::query()
            ->with('assignedUser')
            ->withCount(['calls', 'meetings', 'tasks', 'leads'])
            ->when($search, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->when(
                $sort === 'assigned_to',
                fn ($query) => $query
                    ->leftJoin('users as assigned_users', 'accounts.assigned_user_id', '=', 'assigned_users.id')
                    ->select('accounts.*')
                    ->orderBy('assigned_users.name', $direction),
                fn ($query) => $query->orderBy($sort, $direction),
            )
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('accounts/index', [
            'accounts' => $accounts,
            'filters' => ['search' => $search, 'sort' => $sort, 'direction' => $direction],
            ...$this->formProps(),
        ]);
    }

    /**
     * @return array{0: string, 1: 'asc'|'desc'}
     */
    private function resolveSort(Request $request): array
    {
        $sortable = ['name', 'website', 'type', 'billing_address_country', 'assigned_to'];

        $sort = $request->string('sort')->toString();
        $sort = \in_array($sort, $sortable, true) ? $sort : 'name';

        $direction = $request->string('direction')->toString() === 'desc' ? 'desc' : 'asc';

        return [$sort, $direction];
    }

    public function create(): Response
    {
        return Inertia::render('accounts/create', $this->formProps());
    }

    public function store(StoreAccountRequest $request): RedirectResponse
    {
        $account = Account::create($request->validated() + [
            'created_by_id' => $request->user()->id,
            'modified_by_id' => $request->user()->id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Account created.')]);

        return to_route('accounts.show', $account);
    }

    public function show(Account $account): Response
    {
        $account->load(['assignedUser', 'createdBy'])
            ->loadCount(['calls', 'meetings', 'tasks', 'leads']);

        return Inertia::render('accounts/show', [
            'account' => $account,
        ]);
    }

    public function edit(Account $account): Response
    {
        return Inertia::render('accounts/edit', [
            'account' => $account,
            ...$this->formProps(),
        ]);
    }

    public function update(UpdateAccountRequest $request, Account $account): RedirectResponse
    {
        $account->update($request->validated() + [
            'modified_by_id' => $request->user()->id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Account updated.')]);

        return to_route('accounts.show', $account);
    }

    public function destroy(Account $account): RedirectResponse
    {
        $account->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Account deleted.')]);

        return to_route('accounts.index');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $ids = collect(explode(',', $request->string('ids')->toString()))
            ->map(fn (string $id) => (int) trim($id))
            ->filter()
            ->values();

        Account::whereIn('id', $ids)->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Accounts deleted.')]);

        return to_route('accounts.index', [
            'search' => $request->string('search')->toString() ?: null,
            'sort' => $request->string('sort')->toString() ?: 'name',
            'direction' => $request->string('direction')->toString() ?: 'asc',
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function formProps(): array
    {
        return [
            'accountTypes' => Picklists::ACCOUNT_TYPES,
            'industries' => Picklists::INDUSTRIES,
        ];
    }
}
