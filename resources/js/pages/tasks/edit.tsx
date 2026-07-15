import { Head, setLayoutProps } from '@inertiajs/react';
import TaskController from '@/actions/App/Http/Controllers/TaskController';
import Heading from '@/components/heading';
import TaskForm from '@/components/tasks/task-form';
import { index as tasksIndex } from '@/routes/tasks';
import type { BreadcrumbItem, Task } from '@/types';

type PageProps = {
    task: Task;
    statuses: string[];
    priorities: string[];
};

export default function TasksEdit({
    task,
    statuses,
    priorities,
}: PageProps) {
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
                <Heading title={`Edit ${task.name ?? 'task'}`} />

                <TaskForm
                    task={task}
                    statuses={statuses}
                    priorities={priorities}
                />
            </div>
        </>
    );
}
