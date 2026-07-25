import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

export function TaskDetails({ task }: { task: Task }) {
    return (
        <div className="flex flex-col gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <Field label="Status" value={task.status}>
                        <Badge variant="outline">{task.status}</Badge>
                    </Field>
                    <Field label="Priority" value={task.priority}>
                        <Badge variant={priorityVariant(task.priority)}>
                            {task.priority}
                        </Badge>
                    </Field>
                    <Field
                        label="Start date"
                        value={
                            task.date_start
                                ? format(
                                      new Date(task.date_start),
                                      'dd MMM HH:mm',
                                  )
                                : null
                        }
                    />
                    <Field
                        label="Due date"
                        value={
                            task.date_end
                                ? format(
                                      new Date(task.date_end),
                                      'dd MMM HH:mm',
                                  )
                                : null
                        }
                    />
                    <Field
                        label="Assigned to"
                        value={task.assigned_user?.name}
                    />
                    <Field label="Account" value={task.account?.name} />
                    {task.description && (
                        <div className="grid gap-1 sm:col-span-2">
                            <span className="text-sm text-muted-foreground">
                                Description
                            </span>
                            <p className="whitespace-pre-line">
                                {task.description}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function Field({
    label,
    value,
    children,
}: {
    label: string;
    value?: string | null;
    children?: React.ReactNode;
}) {
    return (
        <div className="grid gap-1">
            <span className="text-sm text-muted-foreground">{label}</span>
            {children ?? <span>{value || '—'}</span>}
        </div>
    );
}
