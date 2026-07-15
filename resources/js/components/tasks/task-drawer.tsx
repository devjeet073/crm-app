import { router } from '@inertiajs/react';
import TaskController from '@/actions/App/Http/Controllers/TaskController';
import { DeleteAlertDialog } from '@/components/delete-alert-dialog';
import { TaskDetails } from '@/components/tasks/task-details';
import TaskForm from '@/components/tasks/task-form';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { DrawerResizeHandle } from '@/components/ui/drawer-resize-handle';
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
    const { width, handleMouseDown } = useDrawerResize();

    return (
        <Drawer
            direction="right"
            open={state !== null}
            onOpenChange={onOpenChange}
        >
            <DrawerContent className="sm:max-w-none" style={{ width }}>
                <DrawerResizeHandle onMouseDown={handleMouseDown} />
                {state?.mode === 'create' && (
                    <>
                        <DrawerHeader>
                            <DrawerTitle>New task</DrawerTitle>
                            <DrawerDescription>
                                Create a new task.
                            </DrawerDescription>
                        </DrawerHeader>
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
                        <DrawerHeader>
                            <DrawerTitle>
                                Edit {taskName(state.task)}
                            </DrawerTitle>
                        </DrawerHeader>
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
                        <DrawerHeader>
                            <DrawerTitle>
                                {taskName(state.task)}
                            </DrawerTitle>
                            {state.task.status && (
                                <DrawerDescription>
                                    {state.task.status}
                                </DrawerDescription>
                            )}
                        </DrawerHeader>
                        <div className="overflow-y-auto px-4 pb-4">
                            <TaskDetails task={state.task} />
                        </div>
                        <DrawerFooter className="flex-row justify-end">
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
                                        TaskController.destroy.url(
                                            state.task,
                                        ),
                                    )
                                }
                            />
                            <Button
                                variant="outline"
                                onClick={() => onEdit(state.task)}
                            >
                                Edit
                            </Button>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
