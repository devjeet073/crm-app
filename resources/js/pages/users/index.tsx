import { Head, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import type { FilterField } from '@/components/advanced-filter';
import { AdvancedFilter } from '@/components/advanced-filter';
import { DataTable, DataTableColumnHeader } from '@/components/data-table';
import { DeleteAlertDialog } from '@/components/delete-alert-dialog';
import Heading from '@/components/heading';
import Pagination from '@/components/pagination';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/utils';
import { index as usersIndex, show as usersShow, destroy as usersDestroy } from '@/routes/users';
import type { BreadcrumbItem, CrmUser, Paginated } from '@/types';

type PageProps = {
    users: Paginated<CrmUser>;
    filters: Record<string, any>;
    filterOptions: Record<string, any[]>;
};

const TYPE_BADGE: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    admin: 'default',
    regular: 'secondary',
    portal: 'outline',
    api: 'outline',
    system: 'destructive',
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Users', href: usersIndex() }];

export default function UsersIndex({ users, filters, filterOptions }: PageProps) {

    const availableFields: FilterField[] = [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'email', label: 'Email', type: 'text' },
        { name: 'type', label: 'Type', type: 'select', options: filterOptions.types || [] },
        { name: 'is_active', label: 'Status', type: 'select', options: [{ label: 'Active', value: '1' }, { label: 'Inactive', value: '0' }] },
        { name: 'created_at', label: 'Created At', type: 'date' },
    ];

    const handleApplyFilters = (newFilters: any) => {
        router.get(usersIndex.url(), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const columns = useMemo<ColumnDef<CrmUser>[]>(() => [
        {
            accessorKey: 'name',
            header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Name" />,
            meta: { label: 'Name' },
            cell: ({ row }) => (
                <a href={usersShow.url(row.original)} className="flex items-center gap-3 font-medium hover:underline">
                    <Avatar className="h-7 w-7 text-[10px]">
                        <AvatarImage src={row.original.avatar_url ?? undefined} alt={row.original.name} />
                        <AvatarFallback style={{ backgroundColor: row.original.avatar_color ?? '#6366f1' }} className="text-white font-semibold">
                            {getInitials(row.original.name)}
                        </AvatarFallback>
                    </Avatar>
                    {row.original.name}
                </a>
            ),
        },
        {
            accessorKey: 'email',
            header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Email" />,
            meta: { label: 'Email' },
            cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
        },
        {
            accessorKey: 'type',
            header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Type" />,
            meta: { label: 'Type' },
            cell: ({ row }) => (
                <Badge variant={TYPE_BADGE[row.original.type] ?? 'secondary'}>
                    {row.original.type}
                </Badge>
            ),
        },
        {
            accessorKey: 'is_active',
            header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Status" />,
            meta: { label: 'Status' },
            cell: ({ row }) =>
                row.original.is_active
                    ? <span className="flex items-center gap-1 text-sm text-green-600"><CheckCircle2 className="h-3.5 w-3.5" /> Active</span>
                    : <span className="flex items-center gap-1 text-sm text-muted-foreground"><XCircle className="h-3.5 w-3.5" /> Inactive</span>,
        },
        {
            id: 'teams',
            accessorKey: 'teams_count',
            header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Teams" />,
            meta: { label: 'Teams' },
            cell: ({ row }) => (
                <Badge variant="secondary">{row.original.teams_count ?? 0}</Badge>
            ),
        },
        {
            id: 'roles',
            accessorKey: 'roles_count',
            header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Roles" />,
            meta: { label: 'Roles' },
            cell: ({ row }) => (
                <Badge variant="secondary">{row.original.roles_count ?? 0}</Badge>
            ),
        },
        {
            id: 'default_team',
            header: 'Default Team',
            meta: { label: 'Default Team' },
            cell: ({ row }) => (
                <span className="text-muted-foreground">
                    {row.original.default_team?.name ?? '—'}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Actions',
            enableSorting: false,
            enableHiding: false,
            cell: ({ row }) => {
                const user = row.original;

                return (
                    <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" asChild>
                            <a href={usersShow.url(user)}>View</a>
                        </Button>
                        <DeleteAlertDialog
                            trigger={
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            }
                            title={`Delete "${user.name}"?`}
                            description="This will permanently delete the user account. This cannot be undone."
                            onConfirm={() => router.delete(usersDestroy.url(user))}
                        />
                    </div>
                );
            },
        },
    ], []);

    return (
        <>
            <Head title="Users" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
                    <Heading
                        title="Users"
                        description={`${users.total} user${users.total !== 1 ? 's' : ''}`}
                    />
                </div>

                <AdvancedFilter
                    availableFields={availableFields}
                    onApply={handleApplyFilters}
                />

                <DataTable
                    tableId="users-table"
                    columns={columns}
                    data={users.data}
                    emptyMessage="No users found."
                />

                <Pagination links={users.links} />
            </div>
        </>
    );
}

UsersIndex.layout = { breadcrumbs };
