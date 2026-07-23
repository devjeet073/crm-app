import { Head, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Download, Pencil, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import LeadController from '@/actions/App/Http/Controllers/LeadController';
import { DataTable, DataTableColumnHeader } from '@/components/data-table';
import { DeleteAlertDialog } from '@/components/delete-alert-dialog';
import Heading from '@/components/heading';
import { LeadDrawer } from '@/components/leads/lead-drawer';
import type { LeadDrawerState } from '@/components/leads/lead-drawer';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { index as leadsIndex } from '@/routes/leads';
import type { BreadcrumbItem, Lead, Paginated, User } from '@/types';

type PageProps = {
    leads: Paginated<Lead>;
    filters: {
        search: string | null;
        sort: string;
        direction: 'asc' | 'desc';
    };
    users: User[];
    statuses: string[];
    sources: string[];
    industries: string[];
    salutations: string[];
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Leads', href: leadsIndex() }];

function leadName(lead: Lead): string {
    return (
        [lead.first_name, lead.last_name].filter(Boolean).join(' ') ||
        `Lead #${lead.id}`
    );
}

export default function LeadsIndex({
    leads,
    filters,
    users,
    statuses,
    sources,
    industries,
    salutations,
}: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [drawer, setDrawer] = useState<LeadDrawerState | null>(null);
    const [selectedLeads, setSelectedLeads] = useState<Lead[]>([]);

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
                leadsIndex.url(),
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
            leadsIndex.url(),
            { search: search.trim() || undefined, sort, direction },
            { preserveState: true, replace: true, preserveScroll: true },
        );
    }

    function resetFilters() {
        setSearch('');
        router.get(
            leadsIndex.url(),
            {
                sort: filters.sort,
                direction: filters.direction,
            },
            { preserveState: true, replace: true, preserveScroll: true },
        );
    }

    function exportLeads(leadsToExport: Lead[]) {
        const headers = [
            'Name',
            'Status',
            'Source',
            'Assigned To',
            'Created At',
        ];
        const rows = leadsToExport.map((lead) => [
            leadName(lead),
            lead.status,
            lead.source ?? '',
            lead.assigned_user?.name ?? '',
            format(new Date(lead.created_at), 'dd/MM/yyyy'),
        ]);
        const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'leads.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    function deleteLeads(leadsToDelete: Lead[]) {
        const ids = leadsToDelete.map((l) => l.id).join(',');
        const params = new URLSearchParams({
            ids,
            search: search.trim() || '',
            sort: filters.sort,
            direction: filters.direction,
        });
        router.delete(`/leads/bulk?${params.toString()}`, {
            onFinish: () => setSelectedLeads([]),
        });
    }

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key !== 'n' || e.metaKey || e.ctrlKey || e.altKey) {
                return;
            }

            const tag = (e.target as HTMLElement)?.tagName;

            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
                return;
            }

            e.preventDefault();
            setDrawer({ mode: 'create' });
        },
        [],
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const columns = useMemo<ColumnDef<Lead>[]>(
        () => [
            {
                id: 'name',
                accessorFn: (lead) => leadName(lead),
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
                        onClick={() =>
                            setDrawer({ mode: 'view', lead: row.original })
                        }
                        className="font-medium hover:underline"
                    >
                        {leadName(row.original)}
                    </button>
                ),
            },
            {
                accessorKey: 'status',
                header: ({ column, table }) => (
                    <DataTableColumnHeader
                        column={column}
                        table={table}
                        title="Status"
                    />
                ),
                meta: { label: 'Status' },
                cell: ({ row }) => (
                    <Badge variant="outline">{row.original.status}</Badge>
                ),
            },
            {
                accessorKey: 'source',
                header: ({ column, table }) => (
                    <DataTableColumnHeader
                        column={column}
                        table={table}
                        title="Source"
                    />
                ),
                meta: { label: 'Source' },
                cell: ({ row }) => (
                    <span className="text-muted-foreground">
                        {row.original.source ?? '—'}
                    </span>
                ),
            },
            {
                id: 'assigned_to',
                accessorFn: (lead) => lead.assigned_user?.name ?? '',
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
                accessorKey: 'created_at',
                header: ({ column, table }) => (
                    <DataTableColumnHeader
                        column={column}
                        table={table}
                        title="Created"
                    />
                ),
                meta: { label: 'Created' },
                cell: ({ row }) => (
                    <span className="text-muted-foreground">
                        {format(
                            new Date(row.original.created_at),
                            'dd/MM/yyyy',
                        )}
                    </span>
                ),
            },
            {
                id: 'actions',
                header: '',
                enableSorting: false,
                enableHiding: false,
                cell: ({ row }) => {
                    const lead = row.original;

                    return (
                        <div className="flex items-center justify-end gap-1">
                            <button
                                type="button"
                                onClick={() =>
                                    setDrawer({ mode: 'edit', lead })
                                }
                                className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                                title="Edit"
                            >
                                <Pencil className="h-4 w-4" />
                            </button>
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
                                title="Delete lead?"
                                description={`This will permanently delete "${leadName(lead)}". This action cannot be undone.`}
                                onConfirm={() =>
                                    router.delete(
                                        LeadController.destroy.url(lead),
                                    )
                                }
                            />
                        </div>
                    );
                },
            },
        ],
        [],
    );

    return (
        <>
            <Head title="Leads" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title="Leads"
                        description={`${leads.total} total`}
                    />

                    <div className="flex items-center gap-2">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or company…"
                            className="w-64"
                        />

                        {(filters.search || search) && (
                            <Button type="button" variant="ghost" onClick={resetFilters}>
                                Reset
                            </Button>
                        )}

                        <Button onClick={() => setDrawer({ mode: 'create' })}>
                            New lead
                            <kbd className="ml-2 hidden items-center gap-1 rounded-md border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                                <span className="text-xs">N</span>
                            </kbd>
                        </Button>
                    </div>
                </div>

                <DataTable tableId="leads-index-table"
                    columns={columns}
                    data={leads.data}
                    emptyMessage="No leads found."
                    sort={filters.sort}
                    direction={filters.direction}
                    onSortChange={handleSortChange}
                    enableRowSelection
                    onSelectedRowsChange={setSelectedLeads}
                    bulkActions={
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => exportLeads(selectedLeads)}
                            >
                                <Download
                                    data-icon="inline-start"
                                    className="h-4 w-4"
                                />
                                Export
                            </Button>
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
                                title="Delete selected leads?"
                                description={`This will permanently delete ${selectedLeads.length} lead${selectedLeads.length > 1 ? 's' : ''}. This action cannot be undone.`}
                                onConfirm={() => deleteLeads(selectedLeads)}
                            />
                        </>
                    }
                />

                <Pagination links={leads.links} />
            </div>

            <LeadDrawer
                state={drawer}
                onOpenChange={(open) => !open && setDrawer(null)}
                onEdit={(lead) => setDrawer({ mode: 'edit', lead })}
                users={users}
                statuses={statuses}
                sources={sources}
                industries={industries}
                salutations={salutations}
            />
        </>
    );
}

LeadsIndex.layout = { breadcrumbs };
