import { router } from '@inertiajs/react';
import TaskController from '@/actions/App/Http/Controllers/TaskController';
import { DeleteAlertDialog } from '@/components/delete-alert-dialog';
import { TaskDetails } from '@/components/tasks/task-details';
import TaskForm from '@/components/tasks/task-form';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { SheetResizeHandle } from '@/components/ui/sheet-resize-handle';
import { useDrawerResize } from '@/hooks/use-drawer-resize';
import type { Task } from '@/types';

export type TaskDrawerState =
    | { mode: 'create' }
    | { mode: 'edit'; task: Task }
    | { mode: 'view'; task: Task };

type TaskDrawerProps = {
    state: TaskDrawerState | null;
    onOpenChange: (open: boolean) => void;
    onEdit: (task: Task) => void;
    statuses: string[];
    priorities: string[];
};

function taskName(task: Task): string {
    return task.name || `Task #${task.id}`;
}

export function TaskDrawer({
    state,
    onOpenChange,
    onEdit,
    statuses,
    priorities,
}: TaskDrawerProps) {
    const { width, handlePointerDown } = useDrawerResize();

    return (
        <Sheet
            direction="right"
            open={state !== null}
            onOpenChange={onOpenChange}
        >
            <SheetContent className="sm:max-w-none" style={{ width }}>
                <SheetResizeHandle onPointerDown={handlePointerDown} />
                {state?.mode === 'create' && (
                    <>
                        <SheetHeader>
                            <SheetTitle>New task</SheetTitle>
                            <SheetDescription>
                                Create a new task.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="overflow-y-auto px-4 pb-4">
                            <TaskForm
                                statuses={statuses}
                                priorities={priorities}
                                onCancel={() => onOpenChange(false)}
                            />
                        </div>
                    </>
                )}

                {state?.mode === 'edit' && (
                    <>
                        <SheetHeader>
                            <SheetTitle>
                                Edit {taskName(state.task)}
                            </SheetTitle>
                        </SheetHeader>
                        <div className="overflow-y-auto px-4 pb-4">
                            <TaskForm
                                task={state.task}
                                statuses={statuses}
                                priorities={priorities}
                                onCancel={() => onOpenChange(false)}
                            />
                        </div>
                    </>
                )}

                {state?.mode === 'view' && (
                    <>
                        <SheetHeader>
                            <SheetTitle>{taskName(state.task)}</SheetTitle>
                            {state.task.status && (
                                <SheetDescription>
                                    {state.task.status}
                                </SheetDescription>
                            )}
                        </SheetHeader>
                        <div className="overflow-y-auto px-4 pb-4">
                            <TaskDetails task={state.task} />
                        </div>
                        <SheetFooter className="flex-row justify-end">
                            <DeleteAlertDialog
                                trigger={
                                    <Button variant="destructive">
                                        Delete
                                    </Button>
                                }
                                title="Delete task?"
                                description={`This will permanently delete "${taskName(state.task)}". This action cannot be undone.`}
                                onConfirm={() =>
                                    router.delete(
                                        TaskController.destroy.url(state.task),
                                    )
                                }
                            />
                            <Button
                                variant="outline"
                                onClick={() => onEdit(state.task)}
                            >
                                Edit
                            </Button>
                        </SheetFooter>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
