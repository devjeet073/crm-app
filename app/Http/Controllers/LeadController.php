<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeadRequest;
use App\Http\Requests\UpdateLeadRequest;
use App\Models\Lead;
use App\Picklists;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeadController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString() ?: null;
        [$sort, $direction] = $this->resolveSort($request);

        $leads = Lead::query()
            ->with(['assignedUser', 'createdAccount'])
            ->when($search, fn ($query, $search) => $query->where(fn ($q) => $q
                ->where('first_name', 'like', "%{$search}%")
                ->orWhere('last_name', 'like', "%{$search}%")
                ->orWhere('account_name', 'like', "%{$search}%")))
            ->when(
                $sort === 'name',
                fn ($query) => $query
                    ->orderBy('first_name', $direction)
                    ->orderBy('last_name', $direction),
                fn ($query) => $query->when(
                    $sort === 'assigned_to',
                    fn ($query) => $query
                        ->leftJoin('users as assigned_users', 'leads.assigned_user_id', '=', 'assigned_users.id')
                        ->select('leads.*')
                        ->orderBy('assigned_users.name', $direction),
                    fn ($query) => $query->orderBy($sort, $direction),
                ),
            )
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('leads/index', [
            'leads' => $leads,
            'filters' => ['search' => $search, 'sort' => $sort, 'direction' => $direction],
            ...$this->formProps(),
        ]);
    }

    /**
     * @return array{0: string, 1: 'asc'|'desc'}
     */
    private function resolveSort(Request $request): array
    {
        $sortable = ['name', 'status', 'source', 'assigned_to', 'created_at'];

        $sort = $request->string('sort')->toString();
        $sort = \in_array($sort, $sortable, true) ? $sort : 'created_at';

        $direction = $request->string('direction')->toString() === 'asc' ? 'asc' : 'desc';

        return [$sort, $direction];
    }

    public function create(): Response
    {
        return Inertia::render('leads/create', $this->formProps());
    }

    public function store(StoreLeadRequest $request): RedirectResponse
    {
        $lead = Lead::create($request->validated() + [
            'created_by_id' => $request->user()->id,
            'modified_by_id' => $request->user()->id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Lead created.')]);

        return to_route('leads.show', $lead);
    }

    public function show(Lead $lead): Response
    {
        $lead->load(['assignedUser', 'createdBy', 'createdAccount']);

        return Inertia::render('leads/show', [
            'lead' => $lead,
        ]);
    }

    public function edit(Lead $lead): Response
    {
        $lead->load('assignedUser');

        return Inertia::render('leads/edit', [
            'lead' => $lead,
            ...$this->formProps(),
        ]);
    }

    public function update(UpdateLeadRequest $request, Lead $lead): RedirectResponse
    {
        $lead->update($request->validated() + [
            'modified_by_id' => $request->user()->id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Lead updated.')]);

        return to_route('leads.show', $lead);
    }

    public function destroy(Lead $lead): RedirectResponse
    {
        $lead->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Lead deleted.')]);

        return to_route('leads.index');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $ids = collect(explode(',', $request->string('ids')->toString()))
            ->map(fn (string $id) => (int) trim($id))
            ->filter()
            ->values();

        Lead::whereIn('id', $ids)->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Leads deleted.')]);

        return to_route('leads.index', [
            'search' => $request->string('search')->toString() ?: null,
            'sort' => $request->string('sort')->toString() ?: 'created_at',
            'direction' => $request->string('direction')->toString() ?: 'desc',
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function formProps(): array
    {
        return [
            'statuses' => Picklists::LEAD_STATUSES,
            'sources' => Picklists::LEAD_SOURCES,
            'industries' => Picklists::INDUSTRIES,
            'salutations' => Picklists::SALUTATIONS,
        ];
    }
}
