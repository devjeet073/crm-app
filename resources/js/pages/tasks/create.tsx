import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import TaskForm from '@/components/tasks/task-form';
import {
    create as tasksCreate,
    index as tasksIndex,
} from '@/routes/tasks';
import type { BreadcrumbItem } from '@/types';

type PageProps = {
    statuses: string[];
    priorities: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tasks', href: tasksIndex() },
    { title: 'New task', href: tasksCreate() },
];

export default function TasksCreate({
    statuses,
    priorities,
}: PageProps) {
    return (
        <>
            <Head title="New task" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <Heading
                    title="New task"
                    description="Create a new task."
                />

                <TaskForm
                    statuses={statuses}
                    priorities={priorities}
                />
            </div>
        </>
    );
}

TasksCreate.layout = { breadcrumbs };
