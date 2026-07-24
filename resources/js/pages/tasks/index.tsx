import { Head, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { LayoutGrid, List, Pencil, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import TaskController from '@/actions/App/Http/Controllers/TaskController';
import { DataTable, DataTableColumnHeader } from '@/components/data-table';
import { DeleteAlertDialog } from '@/components/delete-alert-dialog';
import Heading from '@/components/heading';
import Pagination from '@/components/pagination';
import { KanbanBoard } from '@/components/tasks/kanban-board';
import { TaskDrawer } from '@/components/tasks/task-drawer';
import type { TaskDrawerState } from '@/components/tasks/task-drawer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { index as tasksIndex } from '@/routes/tasks';
import type {
    BreadcrumbItem,
    Paginated,
    Task,
} from '@/types';

type PageProps = {
    tasks: Paginated<Task> | Task[];
    view: string;
    page?: number;
    hasMore?: boolean;
    filters: {
        search: string | null;
        sort: string;
        direction: 'asc' | 'desc';
    };
    statuses: string[];
    priorities: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tasks', href: tasksIndex() },
];

function taskName(task: Task): string {
    return task.name || `Task #${task.id}`;
}

function priorityVariant(
    priority: string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (priority) {
        case 'Urgent':
            return 'destructive';
        case 'High':
            return 'default';
        case 'Normal':
            return 'secondary';
        default:
            return 'outline';
    }
}

function isPaginated(
    tasks: Paginated<Task> | Task[],
): tasks is Paginated<Task> {
    return 'data' in tasks && 'current_page' in tasks;
}

export default function TasksIndex({
    tasks,
    view: initialView,
    page: initialPage,
    hasMore: initialHasMore,
    filters,
    statuses,
    priorities,
}: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [drawer, setDrawer] = useState<TaskDrawerState | null>(null);
    const [view, setView] = useState<string>(initialView);

    useEffect(() => {
        setSearch(filters.search ?? '');
    }, [filters.search]);

    useEffect(() => {
        const nextSearch = search.trim();
        const currentSearch = filters.search ?? '';

        if (nextSearch === currentSearch) {
            return;
        }

        const timeout = window.setTimeout(() => {
            router.get(
                tasksIndex.url(),
                {
                    search: nextSearch || undefined,
                    sort: filters.sort,
                    direction: filters.direction,
                    view,
                },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 350);

        return () => window.clearTimeout(timeout);
    }, [search, filters.sort, filters.direction, filters.search, view]);

    function handleSortChange(sort: string, direction: 'asc' | 'desc') {
        router.get(
            tasksIndex.url(),
            { search: search.trim() || undefined, sort, direction, view },
            { preserveState: true, replace: true, preserveScroll: true },
        );
    }

    function handleViewChange(newView: string) {
        setView(newView);
        router.get(
            tasksIndex.url(),
            {
                search: search.trim() || undefined,
                sort: filters.sort,
                direction: filters.direction,
                view: newView,
            },
            { preserveState: true, replace: true, preserveScroll: true },
        );
    }

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key !== 'n' || e.metaKey || e.ctrlKey || e.altKey) {
                return;
            }

            const tag = (e.target as HTMLElement)?.tagName;

            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
                return;
            }

            e.preventDefault();
            setDrawer({ mode: 'create' });
        },
        [],
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const columns = useMemo<ColumnDef<Task>[]>(
        () => [
            {
                id: 'name',
                accessorFn: (task) => taskName(task),
                header: ({ column, table }) => (
                    <DataTableColumnHeader
                        column={column}
                        table={table}
                        title="Name"
                    />
                ),
                meta: { label: 'Name' },
                cell: ({ row }) => (
                    <button
                        type="button"
                        onClick={() =>
                            setDrawer({ mode: 'view', task: row.original })
                        }
                        className="font-medium hover:underline"
                    >
                        {taskName(row.original)}
                    </button>
                ),
            },
            {
                accessorKey: 'status',
                header: ({ column, table }) => (
                    <DataTableColumnHeader
                        column={column}
                        table={table}
                        title="Status"
                    />
                ),
                meta: { label: 'Status' },
                cell: ({ row }) => (
                    <Badge variant="outline">{row.original.status}</Badge>
                ),
            },
            {
                accessorKey: 'priority',
                header: ({ column, table }) => (
                    <DataTableColumnHeader
                        column={column}
                        table={table}
                        title="Priority"
                    />
                ),
                meta: { label: 'Priority' },
                cell: ({ row }) => (
                    <Badge variant={priorityVariant(row.original.priority)}>
                        {row.original.priority}
                    </Badge>
                ),
            },
            {
                accessorKey: 'date_end',
                header: ({ column, table }) => (
                    <DataTableColumnHeader
                        column={column}
                        table={table}
                        title="Due Date"
                    />
                ),
                meta: { label: 'Due Date' },
                cell: ({ row }) => (
                    <span className="text-muted-foreground">
                        {row.original.date_end
                            ? format(
                                  new Date(row.original.date_end),
                                  'dd MMM HH:mm',
                              )
                            : '—'}
                    </span>
                ),
            },
            {
                id: 'assigned_to',
                accessorFn: (task) => task.assigned_user?.name ?? '',
                header: ({ column, table }) => (
                    <DataTableColumnHeader
                        column={column}
                        table={table}
                        title="Assigned to"
                    />
                ),
                meta: { label: 'Assigned to' },
                cell: ({ row }) => (
                    <span className="text-muted-foreground">
                        {row.original.assigned_user?.name ?? '—'}
                    </span>
                ),
            },
            {
                id: 'actions',
                header: '',
                enableSorting: false,
                enableHiding: false,
                cell: ({ row }) => {
                    const task = row.original;

                    return (
                        <div className="flex items-center justify-end gap-1">
                            <button
                                type="button"
                                onClick={() =>
                                    setDrawer({ mode: 'edit', task })
                                }
                                className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                                title="Edit"
                            >
                                <Pencil className="h-4 w-4" />
                            </button>
                            <DeleteAlertDialog
                                trigger={
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center rounded-md p-1.5 text-destructive hover:bg-destructive/10"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                }
                                title="Delete task?"
                                description={`This will permanently delete "${taskName(task)}". This action cannot be undone.`}
                                onConfirm={() =>
                                    router.delete(
                                        TaskController.destroy.url(task),
                                    )
                                }
                            />
                        </div>
                    );
                },
            },
        ],
        [],
    );

    const kanbanTasks = isPaginated(tasks) ? tasks.data : tasks;

    return (
        <>
            <Head title="Tasks" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title="Tasks"
                        description={`${isPaginated(tasks) ? tasks.total : kanbanTasks.length} total`}
                    />

                    <div className="flex items-center gap-2">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name…"
                            className="w-56"
                        />

                        <div className="flex items-center rounded-md border">
                            <button
                                type="button"
                                onClick={() => handleViewChange('list')}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm ${
                                    view === 'list'
                                        ? 'bg-muted font-medium text-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <List className="h-4 w-4" />
                                List
                            </button>
                            <button
                                type="button"
                                onClick={() => handleViewChange('kanban')}
                                className={`inline-flex items-center gap-1.5 border-l px-3 py-1.5 text-sm ${
                                    view === 'kanban'
                                        ? 'bg-muted font-medium text-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <LayoutGrid className="h-4 w-4" />
                                Kanban
                            </button>
                        </div>

                        <Button onClick={() => setDrawer({ mode: 'create' })}>
                            New task
                            <kbd className="ml-2 hidden items-center gap-1 rounded-md border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                                <span className="text-xs">N</span>
                            </kbd>
                        </Button>
                    </div>
                </div>

                {view === 'kanban' ? (
                    <KanbanBoard
                        tasks={kanbanTasks}
                        statuses={statuses}
                        onTaskClick={(task) =>
                            setDrawer({ mode: 'view', task })
                        }
                        initialPage={initialPage ?? 1}
                        initialHasMore={initialHasMore ?? false}
                        search={filters.search ?? undefined}
                        sort={filters.sort}
                        direction={filters.direction}
                    />
                ) : (
                    <>
                        <DataTable tableId="tasks-index-table"
                            columns={columns}
                            data={isPaginated(tasks) ? tasks.data : []}
                            emptyMessage="No tasks found."
                            sort={filters.sort}
                            direction={filters.direction}
                            onSortChange={handleSortChange}
                        />

                        {isPaginated(tasks) && (
                            <Pagination links={tasks.links} />
                        )}
                    </>
                )}
            </div>

            <TaskDrawer
                state={drawer}
                onOpenChange={(open) => !open && setDrawer(null)}
                onEdit={(task) => setDrawer({ mode: 'edit', task })}
                statuses={statuses}
                priorities={priorities}
            />
        </>
    );
}

TasksIndex.layout = { breadcrumbs };
