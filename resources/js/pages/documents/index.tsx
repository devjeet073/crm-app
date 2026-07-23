import { Head, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { FileText, FolderOpen, Paperclip, Pencil, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DataTable, DataTableColumnHeader } from '@/components/data-table';
import { DeleteAlertDialog } from '@/components/delete-alert-dialog';
import Heading from '@/components/heading';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BreadcrumbItem, Document, DocumentFolder, Paginated, User } from '@/types';

type PageProps = {
    documents: Paginated<Document>;
    folders: DocumentFolder[];
    filters: {
        search: string | null;
        folder_id: string | null;
        sort: string;
        direction: 'asc' | 'desc';
    };
    users: User[];
    statuses: string[];
    types: string[];
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Documents', href: '/documents' }];

const STATUS_COLORS: Record<string, string> = {
    Active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    Expired: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    Archived: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
};

export default function DocumentsIndex({
    documents,
    folders,
    filters,
    statuses,
    types,
}: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [selectedFolder, setSelectedFolder] = useState(filters.folder_id ?? 'all');
    const [selectedDocs, setSelectedDocs] = useState<Document[]>([]);

    useEffect(() => {
 setSearch(filters.search ?? ''); 
}, [filters.search]);
    useEffect(() => {
 setSelectedFolder(filters.folder_id ?? 'all'); 
}, [filters.folder_id]);

    function navigate(overrides: Record<string, unknown> = {}) {
        router.get(
            '/documents',
            {
                search: search.trim() || undefined,
                folder_id: selectedFolder !== 'all' ? selectedFolder : undefined,
                sort: filters.sort,
                direction: filters.direction,
                ...overrides,
            },
            { preserveState: true, replace: true, preserveScroll: true },
        );
    }

    useEffect(() => {
        const nextSearch = search.trim();
        const currentSearch = filters.search ?? '';

        if (nextSearch === currentSearch) {
return;
}

        const t = window.setTimeout(() => navigate({ search: nextSearch || undefined }), 350);

        return () => window.clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    function handleSortChange(sort: string, direction: 'asc' | 'desc') {
        navigate({ sort, direction });
    }

    function handleFolderChange(value: string) {
        setSelectedFolder(value);
        navigate({ folder_id: value !== 'all' ? value : undefined });
    }

    function bulkDelete(docs: Document[]) {
        const ids = docs.map((d) => d.id).join(',');
        router.delete(`/documents/bulk?ids=${ids}`, {
            onFinish: () => setSelectedDocs([]),
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
            router.visit('/documents/create');
        },
        [],
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const columns = useMemo<ColumnDef<Document>[]>(
        () => [
            {
                id: 'name',
                accessorFn: (doc) => doc.name ?? `Document #${doc.id}`,
                header: ({ column, table }) => (
                    <DataTableColumnHeader column={column} table={table} title="Name" />
                ),
                meta: { label: 'Name' },
                cell: ({ row }) => (
                    <a
                        href={`/documents/${row.original.id}`}
                        className="flex items-center gap-2 font-medium hover:underline"
                    >
                        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                        {row.original.name ?? `Document #${row.original.id}`}
                    </a>
                ),
            },
            {
                accessorKey: 'status',
                header: ({ column, table }) => (
                    <DataTableColumnHeader column={column} table={table} title="Status" />
                ),
                meta: { label: 'Status' },
                cell: ({ row }) => {
                    const s = row.original.status;

                    return (
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[s] ?? 'bg-muted text-muted-foreground'}`}>
                            {s}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'type',
                header: ({ column, table }) => (
                    <DataTableColumnHeader column={column} table={table} title="Type" />
                ),
                meta: { label: 'Type' },
                cell: ({ row }) => (
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        {row.original.type ?? '—'}
                        {row.original.file && (
                            <span title="File attached">
                                <Paperclip className="h-3.5 w-3.5 shrink-0" />
                            </span>
                        )}
                    </span>
                ),
            },
            {
                id: 'folder',
                accessorFn: (doc) => doc.folder?.name ?? '',
                header: ({ column, table }) => (
                    <DataTableColumnHeader column={column} table={table} title="Folder" />
                ),
                meta: { label: 'Folder' },
                cell: ({ row }) => (
                    <span className="flex items-center gap-1 text-muted-foreground">
                        {row.original.folder ? (
                            <>
                                <FolderOpen className="h-3.5 w-3.5" />
                                {row.original.folder.name}
                            </>
                        ) : '—'}
                    </span>
                ),
            },
            {
                accessorKey: 'expiration_date',
                header: ({ column, table }) => (
                    <DataTableColumnHeader column={column} table={table} title="Expires" />
                ),
                meta: { label: 'Expires' },
                cell: ({ row }) => (
                    <span className="text-muted-foreground">
                        {row.original.expiration_date
                            ? format(new Date(row.original.expiration_date), 'dd/MM/yyyy')
                            : '—'}
                    </span>
                ),
            },
            {
                id: 'assigned_to',
                accessorFn: (doc) => doc.assigned_user?.name ?? '',
                header: ({ column, table }) => (
                    <DataTableColumnHeader column={column} table={table} title="Assigned to" />
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
                    <DataTableColumnHeader column={column} table={table} title="Created" />
                ),
                meta: { label: 'Created' },
                cell: ({ row }) => (
                    <span className="text-muted-foreground">
                        {format(new Date(row.original.created_at), 'dd/MM/yyyy')}
                    </span>
                ),
            },
            {
                id: 'actions',
                header: '',
                enableSorting: false,
                enableHiding: false,
                cell: ({ row }) => {
                    const doc = row.original;

                    return (
                        <div className="flex items-center justify-end gap-1">
                            <a
                                href={`/documents/${doc.id}/edit`}
                                className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                                title="Edit"
                            >
                                <Pencil className="h-4 w-4" />
                            </a>
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
                                title="Delete document?"
                                description={`This will permanently delete "${doc.name ?? `Document #${doc.id}`}". This action cannot be undone.`}
                                onConfirm={() => router.delete(`/documents/${doc.id}`)}
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
            <Head title="Documents" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title="Documents"
                        description={`${documents.total} total`}
                    />

                    <div className="flex flex-wrap items-center gap-2">
                        <Input
                            id="documents-search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or type…"
                            className="w-56"
                        />

                        <Select value={selectedFolder} onValueChange={handleFolderChange}>
                            <SelectTrigger id="documents-folder-filter" className="w-44">
                                <SelectValue placeholder="All folders" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All folders</SelectItem>
                                {folders.map((f) => (
                                    <SelectItem key={f.id} value={f.id}>
                                        {f.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {(filters.search || search || filters.folder_id) && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    setSearch('');
                                    setSelectedFolder('all');
                                    navigate({ search: undefined, folder_id: undefined });
                                }}
                            >
                                Reset
                            </Button>
                        )}

                        <Button asChild>
                            <a href="/documents/create">
                                New document
                                <kbd className="ml-2 hidden items-center gap-1 rounded-md border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                                    <span className="text-xs">N</span>
                                </kbd>
                            </a>
                        </Button>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={documents.data}
                    emptyMessage="No documents found."
                    sort={filters.sort}
                    direction={filters.direction}
                    onSortChange={handleSortChange}
                    enableRowSelection
                    onSelectedRowsChange={setSelectedDocs}
                    bulkActions={
                        <DeleteAlertDialog
                            trigger={
                                <Button variant="destructive" size="sm">
                                    <Trash2 data-icon="inline-start" className="h-4 w-4" />
                                    Delete
                                </Button>
                            }
                            title="Delete selected documents?"
                            description={`This will permanently delete ${selectedDocs.length} document${selectedDocs.length > 1 ? 's' : ''}. This action cannot be undone.`}
                            onConfirm={() => bulkDelete(selectedDocs)}
                        />
                    }
                />

                <Pagination links={documents.links} />
            </div>
        </>
    );
}

DocumentsIndex.layout = { breadcrumbs };
