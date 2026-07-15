import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import type { FormEventHandler } from 'react';
import TaskController from '@/actions/App/Http/Controllers/TaskController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import UserCombobox from '@/components/user-combobox';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';

type TaskFormData = {
    name: string;
    status: string;
    priority: string;
    date_start: string;
    date_end: string;
    description: string;
    assigned_user_id: string;
};

function toFormData(task?: Task): TaskFormData {
    return {
        name: task?.name ?? '',
        status: task?.status ?? 'Not Started',
        priority: task?.priority ?? 'Normal',
        date_start: task?.date_start
            ? new Date(task.date_start).toISOString().slice(0, 10)
            : '',
        date_end: task?.date_end
            ? new Date(task.date_end).toISOString().slice(0, 16)
            : '',
        description: task?.description ?? '',
        assigned_user_id: task?.assigned_user_id
            ? String(task.assigned_user_id)
            : '',
    };
}

export default function TaskForm({
    task,
    statuses,
    priorities,
    onCancel,
}: {
    task?: Task;
    statuses: string[];
    priorities: string[];
    onCancel?: () => void;
}) {
    const { data, setData, post, put, processing, errors } =
        useForm<TaskFormData>(toFormData(task));

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (task) {
            put(TaskController.update.url(task));
        } else {
            post(TaskController.store.url());
        }
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2 sm:col-span-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={data.status}
                            onValueChange={(value) =>
                                setData('status', value)
                            }
                        >
                            <SelectTrigger id="status" className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                            value={data.priority}
                            onValueChange={(value) =>
                                setData('priority', value)
                            }
                        >
                            <SelectTrigger id="priority" className="w-full">
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                {priorities.map((priority) => (
                                    <SelectItem key={priority} value={priority}>
                                        {priority}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.priority} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="date_start">Start date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date_start"
                                    variant="outline"
                                    className={cn(
                                        'w-full justify-start text-left font-normal',
                                        !data.date_start &&
                                            'text-muted-foreground',
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {data.date_start ? (
                                        format(
                                            new Date(data.date_start),
                                            'PPP',
                                        )
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={
                                        data.date_start
                                            ? new Date(data.date_start)
                                            : undefined
                                    }
                                    onSelect={(selected) =>
                                        setData(
                                            'date_start',
                                            selected
                                                ? format(
                                                      selected,
                                                      'yyyy-MM-dd',
                                                  )
                                                : '',
                                        )
                                    }
                                />
                            </PopoverContent>
                        </Popover>
                        <InputError message={errors.date_start} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="date_end">Due date</Label>
                        {/* <Input
                            id="date_end"
                            type="datetime-local"
                            value={data.date_end}
                            onChange={(e) => setData('date_end', e.target.value)}
                        /> */}

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date_end"
                                    variant="outline"
                                    className={cn(
                                        'w-full justify-start text-left font-normal',
                                        !data.date_end &&
                                            'text-muted-foreground',
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {data.date_end ? (
                                        format(
                                            new Date(data.date_end),
                                            'PPP',
                                        )
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    captionLayout='dropdown'
                                    selected={
                                        data.date_end
                                            ? new Date(data.date_end)
                                            : undefined
                                    }
                                    onSelect={(selected) =>
                                        setData(
                                            'date_end',
                                            selected
                                                ? format(
                                                      selected,
                                                      'yyyy-MM-dd',
                                                  )
                                                : '',
                                        )
                                    }
                                />
                            </PopoverContent>
                        </Popover>
                        <InputError message={errors.date_end} />
                    </div>


                    <div className="grid gap-2 sm:col-span-2">
                        <Label htmlFor="assigned_user_id">Assigned user</Label>
                        <UserCombobox
                            id="assigned_user_id"
                            value={data.assigned_user_id}
                            onChange={(userId) =>
                                setData('assigned_user_id', userId)
                            }
                        />
                        <InputError message={errors.assigned_user_id} />
                    </div>

                    <div className="grid gap-2 sm:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                        />
                        <InputError message={errors.description} />
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center gap-4">
                <Button disabled={processing}>
                    {task ? 'Save changes' : 'Create task'}
                </Button>
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );
}
