import { Head, router, useForm, WhenVisible, setLayoutProps } from '@inertiajs/react';
import {
    ArrowLeft,
    Shield,
    Users,
    Pencil,
    Trash2,
    UserMinus,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { DeleteAlertDialog } from '@/components/delete-alert-dialog';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { UserMultiSelect } from '@/components/user-multi-select';
import {
    index as rolesIndex,
    show as rolesShow,
    edit as rolesEdit,
    destroy as rolesDestroy,
    revokeUser as rolesRevokeUser,
    revokeTeam as rolesRevokeTeam,
    assignUser as rolesAssignUser,
    assignTeam as rolesAssignTeam,
} from '@/routes/roles';
import type { BreadcrumbItem, Role, CrmUser, Team } from '@/types';

type PageProps = {
    role: Role & { users_count: number };
    users?: CrmUser[];
    permissionColumns: string[];
    permissionLevels: string[];
    crmModules: string[];
    crudActions: string[];
};

const PERMISSION_COLORS: Record<string, string> = {
    'not-set': 'secondary',
    yes: 'default',
    no: 'destructive',
    own: 'outline',
    team: 'outline',
    all: 'default',
};

const PERMISSION_LABELS: Record<string, string> = {
    assignment_permission: 'Assignment',
    user_permission: 'Users',
    message_permission: 'Messaging',
    portal_permission: 'Portal',
    group_email_account_permission: 'Group Email',
    export_permission: 'Export',
    mass_update_permission: 'Mass Update',
    data_privacy_permission: 'Data Privacy',
    follower_management_permission: 'Followers',
    audit_permission: 'Audit Log',
    mention_permission: 'Mentions',
    user_calendar_permission: 'Calendars',
    lock_permission: 'Record Lock',
};

export default function RoleShow({
    role,
    users,
    crmModules,
    crudActions,
}: PageProps) {
    const [selectedUsers, setSelectedUsers] = useState<CrmUser[]>([]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Roles', href: rolesIndex() },
        { title: role.name, href: rolesShow.url(role) },
    ];

    setLayoutProps({ breadcrumbs });

    function handleAssignUser(e: React.FormEvent) {
        e.preventDefault();

        if (selectedUsers.length === 0) {
            return;
        }

        router.post(
            rolesAssignUser.url(role),
            { user_ids: selectedUsers.map((u) => u.id) },
            { preserveScroll: true, onSuccess: () => setSelectedUsers([]) },
        );
    }

    return (
        <>
            <Head title={`Role: ${role.name}`} />
            <div className="flex flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title={role.name}
                        description={role.description ?? 'No description'}
                    />
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => router.visit(rolesIndex.url())}
                        >
                            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                        </Button>
                        <Button variant="outline" asChild>
                            <a href={rolesEdit.url(role)}>
                                <Pencil className="mr-1.5 h-4 w-4" /> Edit
                            </a>
                        </Button>
                        <DeleteAlertDialog
                            trigger={
                                <Button variant="destructive">
                                    <Trash2 className="mr-1.5 h-4 w-4" /> Delete
                                </Button>
                            }
                            title={`Delete "${role.name}"?`}
                            description="This will remove the role from all users and teams permanently."
                            onConfirm={() =>
                                router.delete(rolesDestroy.url(role), {
                                    onSuccess: () =>
                                        router.visit(rolesIndex.url()),
                                })
                            }
                        />
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Scope Permissions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-4 w-4" /> Scope Permissions
                            </CardTitle>
                            <CardDescription>
                                Global permission levels for this role
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(PERMISSION_LABELS).map(
                                    ([key, label]) => {
                                        const val =
                                            (role as any)[key] ?? 'not-set';

                                        return (
                                            <div
                                                key={key}
                                                className="flex items-center justify-between gap-2 rounded-md border px-3 py-1.5 text-sm"
                                            >
                                                <span className="text-muted-foreground">
                                                    {label}
                                                </span>
                                                <Badge
                                                    variant={
                                                        PERMISSION_COLORS[
                                                            val
                                                        ] as
                                                            | 'default'
                                                            | 'secondary'
                                                            | 'destructive'
                                                            | 'outline'
                                                    }
                                                >
                                                    {val}
                                                </Badge>
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Entity ACL */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Entity Access (ACL)</CardTitle>
                            <CardDescription>
                                Per-entity CRUD permission levels
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
                                                {crudActions.map((action) => {
                                                    const val =
                                                        (role as any).data?.[
                                                            module
                                                        ]?.[action] ||
                                                        'not-set';

                                                    return (
                                                        <TableCell
                                                            key={action}
                                                            className="p-2 text-center"
                                                        >
                                                            <Badge
                                                                variant={
                                                                    PERMISSION_COLORS[
                                                                        val
                                                                    ] as any
                                                                }
                                                            >
                                                                {val}
                                                            </Badge>
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Users */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-4 w-4" /> Users (
                                {role.users_count})
                            </CardTitle>
                            <CardDescription>
                                Users directly assigned this role
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <form
                                onSubmit={handleAssignUser}
                                className="flex items-start gap-2"
                            >
                                <UserMultiSelect
                                    selectedUsers={selectedUsers}
                                    onChange={setSelectedUsers as any}
                                />
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={selectedUsers.length === 0}
                                >
                                    Assign
                                </Button>
                            </form>
                            <Separator />
                            <WhenVisible
                                data="users"
                                fallback={
                                    <div className="animate-pulse py-2 text-sm text-muted-foreground">
                                        Loading users...
                                    </div>
                                }
                            >
                                {users && users.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No users assigned.
                                    </p>
                                ) : (
                                    <div className="space-y-1">
                                        {users?.map((user) => (
                                            <div
                                                key={user.id}
                                                className="flex items-center justify-between rounded-md p-1.5 hover:bg-muted/50"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {user.email}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() =>
                                                        router.delete(
                                                            rolesRevokeUser.url(
                                                                role,
                                                            ),
                                                            {
                                                                data: {
                                                                    user_id:
                                                                        user.id,
                                                                },
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </WhenVisible>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

