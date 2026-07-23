import {
    DragDropContext,
    Droppable,
} from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';

import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import TaskController from '@/actions/App/Http/Controllers/TaskController';
import { KanbanCard } from '@/components/tasks/kanban-card';
import type { Task } from '@/types';

type KanbanBoardProps = {
    tasks: Task[];
    statuses: string[];
    onTaskClick: (task: Task) => void;
    initialPage: number;
    initialHasMore: boolean;
    search?: string;
    sort: string;
    direction: 'asc' | 'desc';
};

type TasksByStatus = Record<string, Task[]>;

function groupByStatus(tasks: Task[], statuses: string[]): TasksByStatus {
    const grouped: TasksByStatus = {};

    for (const status of statuses) {
        grouped[status] = [];
    }

    for (const task of tasks) {
        const status = task.status || 'Not Started';

        if (!grouped[status]) {
            grouped[status] = [];
        }

        grouped[status].push(task);
    }

    return grouped;
}

export function KanbanBoard({
    tasks,
    statuses,
    onTaskClick,
    initialPage,
    initialHasMore,
    search,
    sort,
    direction,
}: KanbanBoardProps) {
    const [allTasks, setAllTasks] = useState<Task[]>(tasks);
    const [loading, setLoading] = useState(false);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const pageRef = useRef(initialPage);
    const hasMoreRef = useRef(initialHasMore);
    const loadingRef = useRef(false);

    useEffect(() => {
        setAllTasks(tasks);
        pageRef.current = initialPage;
        hasMoreRef.current = initialHasMore;
    }, [tasks, initialPage, initialHasMore]);

    useEffect(() => {
        const sentinel = sentinelRef.current;

        if (!sentinel) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0]?.isIntersecting || loadingRef.current || !hasMoreRef.current) {
                    return;
                }

                loadingRef.current = true;
                setLoading(true);

                const nextPage = pageRef.current + 1;
                const params = new URLSearchParams({
                    page: String(nextPage),
                    sort,
                    direction,
                });

                if (search) {
                    params.set('search', search);
                }

                fetch(`/tasks/page?${params.toString()}`)
                    .then((res) => res.json())
                    .then((json) => {
                        setAllTasks((prev) => [...prev, ...json.tasks]);
                        pageRef.current = json.page;
                        hasMoreRef.current = json.hasMore;
                    })
                    .catch(() => {})
                    .finally(() => {
                        loadingRef.current = false;
                        setLoading(false);
                    });
            },
            { rootMargin: '200px' },
        );

        observer.observe(sentinel);

        return () => observer.disconnect();
    }, [search, sort, direction]);

    const [tasksByStatus, setTasksByStatus] = useState<TasksByStatus>(() =>
        groupByStatus(allTasks, statuses),
    );

    useEffect(() => {
        setTasksByStatus(groupByStatus(allTasks, statuses));
    }, [allTasks, statuses]);

    const onDragEnd = useCallback(
        (result: DropResult) => {
            const { source, destination, draggableId } = result;

            if (!destination) {
                return;
            }

            if (
                source.droppableId === destination.droppableId &&
                source.index === destination.index
            ) {
                return;
            }

            const newStatus = destination.droppableId;
            const taskId = Number(draggableId);

            setTasksByStatus((prev) => {
                const next = { ...prev };

                const sourceList = [...(next[source.droppableId] || [])];
                const destList =
                    source.droppableId === destination.droppableId
                        ? sourceList
                        : [...(next[destination.droppableId] || [])];

                const [moved] = sourceList.splice(source.index, 1);

                if (moved) {
                    destList.splice(destination.index, 0, {
                        ...moved,
                        status: newStatus,
                    });
                }

                next[source.droppableId] = sourceList;

                if (source.droppableId !== destination.droppableId) {
                    next[destination.droppableId] = destList;
                }

                return next;
            });

            const task = allTasks.find((t) => t.id === taskId);

            if (task && task.status !== newStatus) {
                fetch(TaskController.updateStatus.url(task), {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-XSRF-TOKEN': decodeURIComponent(
                            document.cookie
                                .split('; ')
                                .find((row) => row.startsWith('XSRF-TOKEN='))
                                ?.split('=')[1] || '',
                        ),
                    },
                    body: JSON.stringify({ status: newStatus }),
                }).catch((error) => {
                    console.error('Failed to update task status:', error);
                });
            }
        },
        [allTasks],
    );

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div
                style={{ position: 'relative' }}
                className="flex gap-4 pb-4"
            >
                {statuses.map((status) => (
                    <div
                        key={status}
                        className="flex min-w-[280px] flex-1 flex-col"
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-foreground">
                                {status}
                            </h3>
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                {tasksByStatus[status]?.length ?? 0}
                            </span>
                        </div>

                        <Droppable droppableId={status}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    style={{ minHeight: 200 }}
                                    className={`flex flex-1 flex-col gap-2 rounded-lg border border-dashed p-2 transition-colors ${
                                        snapshot.isDraggingOver
                                            ? 'border-primary/40 bg-primary/5'
                                            : 'border-border bg-muted/30'
                                    }`}
                                >
                                    {(tasksByStatus[status] || []).map(
                                        (task, index) => (
                                            <KanbanCard
                                                key={task.id}
                                                task={task}
                                                index={index}
                                                onTaskClick={onTaskClick}
                                            />
                                        ),
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </div>

            <div ref={sentinelRef} />

            {loading && (
                <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
            )}
        </DragDropContext>
    );
}
