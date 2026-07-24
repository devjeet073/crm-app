import { Draggable } from '@hello-pangea/dnd';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import type { Task } from '@/types';

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

function taskName(task: Task): string {
    return task.name || `Task #${task.id}`;
}

type KanbanCardProps = {
    task: Task;
    index: number;
    onTaskClick: (task: Task) => void;
};

export function KanbanCard({ task, index, onTaskClick }: KanbanCardProps) {
    return (
        <Draggable draggableId={String(task.id)} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onTaskClick(task)}
                    className={`cursor-grab rounded-lg border bg-card p-3 shadow-sm transition-shadow active:cursor-grabbing ${
                        snapshot.isDragging
                            ? 'shadow-md ring-2 ring-primary/20'
                            : ''
                    }`}
                >
                    <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium leading-none">
                            {taskName(task)}
                        </span>
                    </div>

                    {task.description && (
                        <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                            {task.description}
                        </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <Badge
                            variant={priorityVariant(task.priority)}
                            className="text-xs"
                        >
                            {task.priority}
                        </Badge>
                        {task.date_end && (
                            <span className="text-xs text-muted-foreground">
                                Due{' '}
                                {format(
                                    new Date(task.date_end),
                                    'dd MMM HH:mm',
                                )}
                            </span>
                        )}
                    </div>

                    {task.assigned_user && (
                        <div className="mt-2 flex items-center gap-1.5">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                                {task.assigned_user.name.charAt(0)}
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {task.assigned_user.name}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </Draggable>
    );
}
