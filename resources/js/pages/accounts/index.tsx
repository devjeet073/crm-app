import { Head, router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Download, Pencil, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AccountController from '@/actions/App/Http/Controllers/AccountController';
import { AccountDrawer } from '@/components/accounts/account-drawer';
import type { AccountDrawerState } from '@/components/accounts/account-drawer';
import { DataTable, DataTableColumnHeader } from '@/components/data-table';
import { DeleteAlertDialog } from '@/components/delete-alert-dialog';
import Heading from '@/components/heading';
import Pagination from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { index as accountsIndex } from '@/routes/accounts';
import type { Account, BreadcrumbItem, Paginated, Auth } from '@/types';

type PageProps = {
    accounts: Paginated<Account>;
    filters: {
        search: string | null;
        sort: string;
        direction: 'asc' | 'desc';
    };
    accountTypes: string[];
    industries: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Accounts', href: accountsIndex() },
];

export default function AccountsIndex({
    accounts,
    filters,
    accountTypes,
    industries,
}: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [drawer, setDrawer] = useState<AccountDrawerState | null>(null);
    const [selectedAccounts, setSelectedAccounts] = useState<Account[]>([]);
    const isMobile = useIsMobile();
    const { auth } = usePage<{ auth: Auth }>().props;

    const canInsert = auth.isAdmin || auth.module_permissions?.['Accounts']?.insert;
    const canUpdate = auth.isAdmin || auth.module_permissions?.['Accounts']?.update;
    const canDelete = auth.isAdmin || auth.module_permissions?.['Accounts']?.delete;

    useEffect(() => {
        setSearch(filters.search ?? '');
    }, [filters.search]);

    useEffect(() => {
        const nextSearch = search.trim();
        const currentSearch = filters.search ?? '';

        if (nextSearch === currentSearch) {
            return;
        }

        const timeout = window.setTimeout(() => {
            router.get(
                accountsIndex.url(),
                {
                    search: nextSearch || undefined,
                    sort: filters.sort,
                    direction: filters.direction,
                },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 350);

        return () => window.clearTimeout(timeout);
    }, [search, filters.sort, filters.direction, filters.search]);

    function handleSortChange(sort: string, direction: 'asc' | 'desc') {
        router.get(
            accountsIndex.url(),
            { search: search.trim() || undefined, sort, direction },
            { preserveState: true, replace: true, preserveScroll: true },
        );
    }

    function resetFilters() {
        setSearch('');
        router.get(
            accountsIndex.url(),
            {
                sort: filters.sort,
                direction: filters.direction,
            },
            { preserveState: true, replace: true, preserveScroll: true },
        );
    }

    function exportAccounts(accountsToExport: Account[]) {
        const headers = ['Name', 'Website', 'Type', 'Country', 'Assigned To'];
        const rows = accountsToExport.map((account) => [
            account.name ?? '',
            account.website ?? '',
            account.type ?? '',
            account.billing_address_country ?? '',
            account.assigned_user?.name ?? '',
        ]);
        const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'accounts.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    function deleteAccounts(accountsToDelete: Account[]) {
        const ids = accountsToDelete.map((a) => a.id).join(',');
        const params = new URLSearchParams({
            ids,
            search: search.trim() || '',
            sort: filters.sort,
            direction: filters.direction,
        });
        router.delete(`/accounts/bulk?${params.toString()}`, {
            onFinish: () => setSelectedAccounts([]),
        });
    }

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!canInsert || e.key !== 'n' || e.metaKey || e.ctrlKey || e.altKey) {
            return;
        }

        const tag = (e.target as HTMLElement)?.tagName;

        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
            return;
        }

        e.preventDefault();
        setDrawer({ mode: 'create' });
    }, [canInsert]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const columns = useMemo<ColumnDef<Account>[]>(
        () => [
            {
                accessorKey: 'name',
                header: ({ column, table }) => (
                    <DataTableColumnHeader
                        column={column}
                        table={table}
                        title="Name"
                    />
                ),
                meta: { label: 'Name' },
                cell: ({ row }) => (
                    <button
                        type="button"
                        onClick={() => {
                            if (isMobile) {
                                router.visit(`/accounts/${row.original.id}`);
                            } else {
                                setDrawer({
                                    mode: 'view',
                                    account: row.original,
                                });
                            }
                        }}
                        className="font-medium hover:underline"
                    >
                        {row.original.name}
                    </button>
                ),
            },
            {
                accessorKey: 'website',
                header: ({ column, table }) => (
                    <DataTableColumnHeader
                        column={column}
                        table={table}
                        title="Website"
                    />
                ),
                meta: { label: 'Website' },
                cell: ({ row }) => (
                    <span className="text-muted-foreground">
                        {row.original.website ?? '—'}
                    </span>
                ),
            },
            {
                accessorKey: 'type',
                header: ({ column, table }) => (
                    <DataTableColumnHeader
                        column={column}
                        table={table}
                        title="Type"
                    />
                ),
                meta: { label: 'Type' },
                cell: ({ row }) => (
                    <span className="text-muted-foreground">
                        {row.original.type ?? '—'}
                    </span>
                ),
            },
            {
                accessorKey: 'billing_address_country',
                header: ({ column, table }) => (
                    <DataTableColumnHeader
                        column={column}
                        table={table}
                        title="Country"
                    />
                ),
                meta: { label: 'Country' },
                cell: ({ row }) => (
                    <span className="text-muted-foreground">
                        {row.original.billing_address_country ?? '—'}
                    </span>
                ),
            },
            {
                id: 'assigned_to',
                accessorFn: (account) => account.assigned_user?.name ?? '',
                header: ({ column, table }) => (
                    <DataTableColumnHeader
                        column={column}
                        table={table}
                        title="Assigned to"
                    />
                ),
                meta: { label: 'Assigned to' },
                cell: ({ row }) => (
                    <span className="text-muted-foreground">
                        {row.original.assigned_user?.name ?? '—'}
                    </span>
                ),
            },
            {
                id: 'actions',
                header: 'Actions',
                enableSorting: false,
                enableHiding: false,
                cell: ({ row }) => {
                    const account = row.original;

                    return (
                        <div className="flex items-center justify-end gap-1">
                            {canUpdate && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (isMobile) {
                                            router.visit(
                                                `/accounts/${account.id}/edit`,
                                            );
                                        } else {
                                            setDrawer({ mode: 'edit', account });
                                        }
                                    }}
                                    className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                                    title="Edit"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                            )}
                            {canDelete && (
                                <DeleteAlertDialog
                                    trigger={
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center rounded-md p-1.5 text-destructive hover:bg-destructive/10"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                }
                                title="Delete account?"
                                description={`This will permanently delete "${account.name}". This action cannot be undone.`}
                                onConfirm={() =>
                                    router.delete(
                                        AccountController.destroy.url(account),
                                    )
                                }
                            />
                            )}
                        </div>
                    );
                },
            },
        ],
        [isMobile, canUpdate, canDelete],
    );

    return (
        <>
            <Head title="Accounts" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title="Accounts"
                        description={`${accounts.total} total`}
                    />

                    <div className="flex items-center gap-2">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name…"
                            className="w-56"
                        />

                        {(filters.search || search) && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={resetFilters}
                            >
                                Reset
                            </Button>
                        )}

                        {canInsert && (
                            <Button
                                onClick={() => {
                                    if (isMobile) {
                                        router.visit('/accounts/create');
                                    } else {
                                        setDrawer({ mode: 'create' });
                                    }
                                }}
                            >
                                New account
                                <kbd className="ml-2 hidden items-center gap-1 rounded-md border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                                    <span className="text-xs">N</span>
                                </kbd>
                            </Button>
                        )}
                    </div>
                </div>

                <DataTable
                    tableId="accounts-index-table"
                    columns={columns}
                    data={accounts.data}
                    emptyMessage="No accounts found."
                    sort={filters.sort}
                    direction={filters.direction}
                    onSortChange={handleSortChange}
                    enableRowSelection
                    onSelectedRowsChange={setSelectedAccounts}
                    bulkActions={
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => exportAccounts(selectedAccounts)}
                            >
                                <Download
                                    data-icon="inline-start"
                                    className="h-4 w-4"
                                />
                                Export
                            </Button>
                            {canDelete && (
                                <DeleteAlertDialog
                                    trigger={
                                        <Button variant="destructive" size="sm">
                                            <Trash2
                                                data-icon="inline-start"
                                                className="h-4 w-4"
                                            />
                                            Delete
                                        </Button>
                                    }
                                    title="Delete selected accounts?"
                                    description={`This will permanently delete ${selectedAccounts.length} account${selectedAccounts.length > 1 ? 's' : ''}. This action cannot be undone.`}
                                    onConfirm={() =>
                                        deleteAccounts(selectedAccounts)
                                    }
                                />
                            )}
                        </>
                    }
                />

                <Pagination links={accounts.links} />
            </div>

            <AccountDrawer
                state={drawer}
                onOpenChange={(open) => !open && setDrawer(null)}
                onEdit={(account) => setDrawer({ mode: 'edit', account })}
                accountTypes={accountTypes}
                industries={industries}
            />
        </>
    );
}

AccountsIndex.layout = { breadcrumbs };
