import { Head, router, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from '@/components/ui/textarea';
import { index as rolesIndex, show as rolesShow, update as rolesUpdate } from '@/routes/roles';
import type { BreadcrumbItem, Role } from '@/types';

type PageProps = {
    role: Role;
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

export default function RoleEdit({ role, permissionColumns, permissionLevels, crmModules, crudActions }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Roles', href: rolesIndex() },
        { title: role.name, href: rolesShow.url(role) },
        { title: 'Edit', href: '' },
    ];

    const { data, setData, patch, errors, processing } = useForm<any>({
        name: role.name,
        description: role.description ?? '',
        data: crmModules.reduce((acc, mod) => {
            acc[mod] = crudActions.reduce((actAcc, action) => {
                actAcc[action] = ((role as any).data)?.[mod]?.[action] || 'not-set';

                return actAcc;
            }, {} as Record<string, string>);

            return acc;
        }, {} as Record<string, Record<string, string>>),
        ...Object.fromEntries(permissionColumns.map((col) => [col, (role as any)[col] ?? 'not-set'])),
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        patch(rolesUpdate.url(role));
    }

    return (
        <>
            <Head title={`Edit: ${role.name}`} />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <Heading title={`Edit "${role.name}"`} description="Update ACL role permissions" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Basic Info</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={3} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Scope Permissions</CardTitle>
                            <CardDescription>Adjust global permission levels for this role</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 sm:grid-cols-8">
                                {permissionColumns.map((col) => (
                                    <div key={col} className="space-y-1.5">
                                        <Label htmlFor={col}>{PERMISSION_LABELS[col] ?? col}</Label>
                                        <Select value={data[col]} onValueChange={(val) => setData(col, val)}>
                                            <SelectTrigger id={col}><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {permissionLevels.map((level) => (
                                                    <SelectItem key={level} value={level}>{level}</SelectItem>
                                                ))}
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
                            <CardDescription>Set fine-grained CRUD permissions for each CRM module</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[150px]">Module</TableHead>
                                            {crudActions.map(action => (
                                                <TableHead key={action} className="capitalize text-center">{action}</TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {crmModules.map(module => (
                                            <TableRow key={module}>
                                                <TableCell className="font-medium">{module}</TableCell>
                                                {crudActions.map(action => (
                                                    <TableCell key={action} className="p-2 align-middle">
                                                        <Select
                                                            value={data.data[module]?.[action] || 'not-set'}
                                                            onValueChange={(val) => {
                                                                const newData = { ...data.data };

                                                                if (!newData[module]) {
                                                                    newData[module] = {};
                                                                }

                                                                newData[module][action] = val;
                                                                setData('data', newData);
                                                            }}
                                                        >
                                                            <SelectTrigger className="h-8 w-full min-w-[100px]">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {permissionLevels.map(level => (
                                                                    <SelectItem key={level} value={level}>{level}</SelectItem>
                                                                ))}
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
                        <Button type="submit" disabled={processing}>{processing ? 'Saving…' : 'Save Changes'}</Button>
                        <Button variant="outline" type="button" onClick={() => router.visit(rolesShow.url(role))}>Cancel</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

RoleEdit.layout = { breadcrumbs: [] };
