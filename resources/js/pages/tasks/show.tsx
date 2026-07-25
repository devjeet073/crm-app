import { Head, Link, router, setLayoutProps, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import TaskController from '@/actions/App/Http/Controllers/TaskController';
import { DeleteAlertDialog } from '@/components/delete-alert-dialog';
import Heading from '@/components/heading';
import { TaskDetails } from '@/components/tasks/task-details';
import { Button } from '@/components/ui/button';
import { index as tasksIndex } from '@/routes/tasks';
import type { BreadcrumbItem, Task } from '@/types';

type PageProps = {
    task: Task;
};
import type { Auth } from '@/types';

export default function TaskShow({ task }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tasks', href: tasksIndex() },
        {
            title: task.name ?? `Task #${task.id}`,
            href: TaskController.show(task),
        },
    ];

    const { auth } = usePage<{ auth: Auth }>().props;
    const canUpdate = auth.isAdmin || auth.module_permissions?.['Tasks']?.update;
    const canDelete = auth.isAdmin || auth.module_permissions?.['Tasks']?.delete;

    setLayoutProps({ breadcrumbs });

    return (
        <>
            <Head title={task.name ?? 'Task'} />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title={task.name ?? 'Untitled task'}
                        description={task.status}
                    />

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => router.visit(tasksIndex.url())}
                        >
                            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                        </Button>
                        {canUpdate && (
                            <Button variant="outline" asChild>
                                <Link href={TaskController.edit(task)}>Edit</Link>
                            </Button>
                        )}
                        {canDelete && (
                            <DeleteAlertDialog
                                trigger={
                                    <Button variant="destructive">Delete</Button>
                                }
                                title="Delete task?"
                                description={`This will permanently delete "${task.name ?? `Task #${task.id}`}". This action cannot be undone.`}
                                onConfirm={() =>
                                    router.delete(TaskController.destroy.url(task))
                                }
                            />
                        )}
                    </div>
                </div>

                <TaskDetails task={task} />
            </div>
        </>
    );
}
