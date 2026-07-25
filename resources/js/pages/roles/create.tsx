import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { index as rolesIndex, store as rolesStore } from '@/routes/roles';
import type { BreadcrumbItem } from '@/types';

type PageProps = {
    permissionColumns: string[];
    permissionLevels: string[];
    crmModules: string[];
    crudActions: string[];
};

const PERMISSION_LABELS: Record<string, string> = {
    assignment_permission: 'Assignment',
    user_permission: 'User Access',
    message_permission: 'Messaging',
    portal_permission: 'Portal',
    group_email_account_permission: 'Group Email',
    export_permission: 'Export',
    mass_update_permission: 'Mass Update',
    data_privacy_permission: 'Data Privacy',
    follower_management_permission: 'Follower Management',
    audit_permission: 'Audit Log',
    mention_permission: 'Mentions',
    user_calendar_permission: 'User Calendars',
    lock_permission: 'Record Lock',
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Roles', href: rolesIndex() },
    { title: 'New Role', href: '' },
];

export default function RoleCreate({
    permissionColumns,
    permissionLevels,
    crmModules,
    crudActions,
}: PageProps) {
    const { data, setData, post, errors, processing } = useForm<any>({
        name: '',
        description: '',
        data: crmModules.reduce(
            (acc, mod) => {
                acc[mod] = crudActions.reduce(
                    (actAcc, action) => {
                        actAcc[action] = 'not-set';

                        return actAcc;
                    },
                    {} as Record<string, string>,
                );

                return acc;
            },
            {} as Record<string, Record<string, string>>,
        ),
        ...Object.fromEntries(permissionColumns.map((col) => [col, 'not-set'])),
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(rolesStore.url());
    }

    return (
        <>
            <Head title="New Role" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <Heading
                    title="New Role"
                    description="Create an ACL role with specific permission levels"
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name">
                                    Name{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="e.g. Sales Manager"
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Describe what this role allows…"
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Scope Permissions</CardTitle>
                            <CardDescription>
                                Set global permission levels. Values: not-set,
                                yes, no, own, team, all
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid content-start items-start gap-6 sm:grid-cols-2">
                                {permissionColumns.map((col) => (
                                    <div key={col} className="space-y-1.5">
                                        <Label htmlFor={col}>
                                            {PERMISSION_LABELS[col] ?? col}
                                        </Label>
                                        <Select
                                            value={data[col]}
                                            onValueChange={(val) =>
                                                setData(col, val)
                                            }
                                        >
                                            <SelectTrigger id={col}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {permissionLevels.map(
                                                    (level) => (
                                                        <SelectItem
                                                            key={level}
                                                            value={level}
                                                        >
                                                            {level}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Module Permissions</CardTitle>
                            <CardDescription>
                                Set fine-grained CRUD permissions for each CRM
                                module
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[150px]">
                                                Module
                                            </TableHead>
                                            {crudActions.map((action) => (
                                                <TableHead
                                                    key={action}
                                                    className="text-center capitalize"
                                                >
                                                    {action}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {crmModules.map((module) => (
                                            <TableRow key={module}>
                                                <TableCell className="font-medium">
                                                    {module}
                                                </TableCell>
                                                {crudActions.map((action) => (
                                                    <TableCell
                                                        key={action}
                                                        className="p-2 align-middle"
                                                    >
                                                        <Select
                                                            value={
                                                                data.data[
                                                                    module
                                                                ]?.[action] ||
                                                                'not-set'
                                                            }
                                                            onValueChange={(
                                                                val,
                                                            ) => {
                                                                const newData =
                                                                    {
                                                                        ...data.data,
                                                                    };

                                                                if (
                                                                    !newData[
                                                                        module
                                                                    ]
                                                                ) {
                                                                    newData[
                                                                        module
                                                                    ] = {};
                                                                }

                                                                newData[module][
                                                                    action
                                                                ] = val;
                                                                setData(
                                                                    'data',
                                                                    newData,
                                                                );
                                                            }}
                                                        >
                                                            <SelectTrigger className="h-8 w-full min-w-[100px]">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {permissionLevels.map(
                                                                    (level) => (
                                                                        <SelectItem
                                                                            key={
                                                                                level
                                                                            }
                                                                            value={
                                                                                level
                                                                            }
                                                                        >
                                                                            {
                                                                                level
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-3">
                        <Button variant="outline" type="button" onClick={() => router.visit(rolesIndex.url())}>
                            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating…' : 'Create Role'}
                        </Button>
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => router.visit(rolesIndex.url())}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

RoleCreate.layout = { breadcrumbs };
