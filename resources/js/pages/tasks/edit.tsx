import { Head, router, setLayoutProps } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import TaskController from '@/actions/App/Http/Controllers/TaskController';
import Heading from '@/components/heading';
import TaskForm from '@/components/tasks/task-form';
import { Button } from '@/components/ui/button';
import { index as tasksIndex } from '@/routes/tasks';
import type { BreadcrumbItem, Task } from '@/types';

type PageProps = {
    task: Task;
    statuses: string[];
    priorities: string[];
};

export default function TasksEdit({ task, statuses, priorities }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tasks', href: tasksIndex() },
        {
            title: task.name ?? `Task #${task.id}`,
            href: TaskController.show(task),
        },
        { title: 'Edit', href: TaskController.edit(task) },
    ];

    setLayoutProps({ breadcrumbs });

    return (
        <>
            <Head title={`Edit ${task.name ?? 'task'}`} />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading title={`Edit ${task.name ?? 'task'}`} />
                    <Button
                        variant="outline"
                        onClick={() => router.visit(tasksIndex.url())}
                    >
                        <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                    </Button>
                </div>

                <TaskForm
                    task={task}
                    statuses={statuses}
                    priorities={priorities}
                />
            </div>
        </>
    );
}
