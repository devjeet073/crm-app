<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use App\Models\User;
use App\Picklists;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString() ?: null;
        $view = $request->string('view')->toString() ?: 'list';
        [$sort, $direction] = $this->resolveSort($request);

        $query = Task::query()
            ->with(['assignedUser', 'account'])
            ->when($search, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->when(
                $sort === 'assigned_to',
                fn ($query) => $query
                    ->leftJoin('users as assigned_users', 'tasks.assigned_user_id', '=', 'assigned_users.id')
                    ->select('tasks.*')
                    ->orderBy('assigned_users.name', $direction),
                fn ($query) => $query->orderBy($sort, $direction),
            );

        if ($view === 'kanban') {
            $perPage = 20;
            $page = max(1, (int) $request->input('page', 1));

            $tasks = $query
                ->offset(($page - 1) * $perPage)
                ->limit($perPage)
                ->get();

            $total = (clone $query)->count();

            return Inertia::render('tasks/index', [
                'tasks' => $tasks,
                'view' => $view,
                'page' => $page,
                'hasMore' => $page * $perPage < $total,
                'filters' => ['search' => $search, 'sort' => $sort, 'direction' => $direction],
                ...$this->formProps(),
            ]);
        }

        $tasks = $query->paginate(15)->withQueryString();

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'view' => $view,
            'filters' => ['search' => $search, 'sort' => $sort, 'direction' => $direction],
            ...$this->formProps(),
        ]);
    }

    public function page(Request $request): \Illuminate\Http\JsonResponse
    {
        $search = $request->string('search')->toString() ?: null;
        [$sort, $direction] = $this->resolveSort($request);
        $perPage = 20;
        $page = max(1, (int) $request->input('page', 1));

        $tasks = Task::query()
            ->with(['assignedUser', 'account'])
            ->when($search, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->when(
                $sort === 'assigned_to',
                fn ($query) => $query
                    ->leftJoin('users as assigned_users', 'tasks.assigned_user_id', '=', 'assigned_users.id')
                    ->select('tasks.*')
                    ->orderBy('assigned_users.name', $direction),
                fn ($query) => $query->orderBy($sort, $direction),
            )
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->get();

        $total = Task::query()
            ->when($search, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->count();

        return response()->json([
            'tasks' => $tasks,
            'page' => $page,
            'hasMore' => $page * $perPage < $total,
        ]);
    }

    /**
     * @return array{0: string, 1: 'asc'|'desc'}
     */
    private function resolveSort(Request $request): array
    {
        $sortable = ['name', 'status', 'priority', 'date_end', 'assigned_to'];

        $sort = $request->string('sort')->toString();
        $sort = \in_array($sort, $sortable, true) ? $sort : 'created_at';

        $direction = $request->string('direction')->toString() === 'asc' ? 'asc' : 'desc';

        return [$sort, $direction];
    }

    public function create(): Response
    {
        return Inertia::render('tasks/create', $this->formProps());
    }

    public function store(StoreTaskRequest $request): RedirectResponse
    {
        $task = Task::create($request->validated() + [
            'created_by_id' => $request->user()->id,
            'modified_by_id' => $request->user()->id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Task created.')]);

        return to_route('tasks.show', $task);
    }

    public function show(Task $task): Response
    {
        $task->load(['assignedUser', 'createdBy', 'account']);

        return Inertia::render('tasks/show', [
            'task' => $task,
        ]);
    }

    public function edit(Task $task): Response
    {
        return Inertia::render('tasks/edit', [
            'task' => $task,
            ...$this->formProps(),
        ]);
    }

    public function update(UpdateTaskRequest $request, Task $task): RedirectResponse
    {
        $task->update($request->validated() + [
            'modified_by_id' => $request->user()->id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Task updated.')]);

        return to_route('tasks.show', $task);
    }

    public function destroy(Task $task): RedirectResponse
    {
        $task->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Task deleted.')]);

        return to_route('tasks.index');
    }

    public function updateStatus(Request $request, Task $task): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'status' => ['required', 'string', \Illuminate\Validation\Rule::in(Picklists::TASK_STATUSES)],
        ]);

        $task->update([
            'status' => $request->input('status'),
            'modified_by_id' => $request->user()->id,
        ]);

        return response()->json(['task' => $task->fresh(['assignedUser', 'account'])]);
    }

    /**
     * @return array<string, mixed>
     */
    private function formProps(): array
    {
        return [
            'statuses' => Picklists::TASK_STATUSES,
            'priorities' => Picklists::TASK_PRIORITIES,
        ];
    }
}
