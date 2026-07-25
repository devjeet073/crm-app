import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import TaskForm from '@/components/tasks/task-form';
import { Button } from '@/components/ui/button';
import { create as tasksCreate, index as tasksIndex } from '@/routes/tasks';
import type { BreadcrumbItem } from '@/types';

type PageProps = {
    statuses: string[];
    priorities: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tasks', href: tasksIndex() },
    { title: 'New task', href: tasksCreate() },
];

export default function TasksCreate({ statuses, priorities }: PageProps) {
    return (
        <>
            <Head title="New task" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading title="New task" description="Create a new task." />
                    <Button variant="outline" onClick={() => router.visit(tasksIndex.url())}>
                        <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                    </Button>
                </div>

                <TaskForm statuses={statuses} priorities={priorities} />
            </div>
        </>
    );
}

TasksCreate.layout = { breadcrumbs };
