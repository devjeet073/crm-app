import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { DataTable, DataTableColumnHeader } from '@/components/data-table';
import { DeleteAlertDialog } from '@/components/delete-alert-dialog';
import Heading from '@/components/heading';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index as usersIndex, show as usersShow, destroy as usersDestroy } from '@/routes/users';
import type { BreadcrumbItem, CrmUser, Paginated } from '@/types';

type PageProps = {
    users: Paginated<CrmUser>;
    filters: { search: string | null; type: string | null };
    types: string[];
};

const TYPE_BADGE: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    admin:   'default',
    regular: 'secondary',
    portal:  'outline',
    api:     'outline',
    system:  'destructive',
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Users', href: usersIndex() }];

export default function UsersIndex({ users, filters, types }: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [type,   setType]   = useState(filters.type   ?? '');

    useEffect(() => { setSearch(filters.search ?? ''); }, [filters.search]);
    useEffect(() => { setType(filters.type     ?? ''); }, [filters.type]);

    // debounced search
    useEffect(() => {
        const next = search.trim();
        if (next === (filters.search ?? '')) return;
        const t = window.setTimeout(() => {
            router.get(usersIndex.url(), { search: next || undefined, type: type || undefined }, { preserveState: true, replace: true });
        }, 350);
        return () => window.clearTimeout(t);
    }, [search, filters.search, type]);

    function handleTypeChange(val: string) {
        setType(val);
        router.get(usersIndex.url(), { search: search.trim() || undefined, type: val || undefined }, { preserveState: true, replace: true });
    }

    const columns = useMemo<ColumnDef<CrmUser>[]>(() => [
        {
            accessorKey: 'name',
            header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Name" />,
            meta: { label: 'Name' },
            cell: ({ row }) => (
                <a href={usersShow.url(row.original)} className="font-medium hover:underline">
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
            header: '',
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
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title="Users"
                        description={`${users.total} user${users.total !== 1 ? 's' : ''}`}
                    />
                    <div className="flex items-center gap-2">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name or email…"
                            className="w-56"
                        />
                        <Select value={type} onValueChange={handleTypeChange}>
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="All types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All types</SelectItem>
                                {types.map((t) => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {(filters.search || filters.type) && (
                            <Button variant="ghost" onClick={() => { setSearch(''); handleTypeChange(''); }}>
                                Reset
                            </Button>
                        )}
                    </div>
                </div>

                <DataTable
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
