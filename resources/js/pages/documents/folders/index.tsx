import { Head, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { FolderOpen, Pencil, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { DataTable, DataTableColumnHeader } from '@/components/data-table';
import { DeleteAlertDialog } from '@/components/delete-alert-dialog';
import Heading from '@/components/heading';
import Pagination from '@/components/pagination';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem, DocumentFolder, Paginated } from '@/types';

type PageProps = {
    folders: Paginated<DocumentFolder>;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Documents', href: '/documents' },
    { title: 'Folders', href: '/document-folders' },
];

export default function DocumentFoldersIndex({ folders }: PageProps) {
    const columns = useMemo<ColumnDef<DocumentFolder>[]>(
        () => [
            {
                id: 'name',
                accessorFn: (f) => f.name ?? `Folder #${f.id}`,
                header: ({ column, table }) => (
                    <DataTableColumnHeader column={column} table={table} title="Name" />
                ),
                meta: { label: 'Name' },
                cell: ({ row }) => (
                    <span className="flex items-center gap-2 font-medium">
                        <FolderOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                        {row.original.name}
                    </span>
                ),
            },
            {
                id: 'parent',
                accessorFn: (f) => f.parent?.name ?? '',
                header: ({ column, table }) => (
                    <DataTableColumnHeader column={column} table={table} title="Parent" />
                ),
                meta: { label: 'Parent' },
                cell: ({ row }) => (
                    <span className="text-muted-foreground">
                        {row.original.parent?.name ?? '— Root —'}
                    </span>
                ),
            },
            {
                id: 'documents_count',
                accessorFn: (f) => f.documents_count ?? 0,
                header: ({ column, table }) => (
                    <DataTableColumnHeader column={column} table={table} title="Documents" />
                ),
                meta: { label: 'Documents' },
                cell: ({ row }) => (
                    <span className="text-muted-foreground">{row.original.documents_count ?? 0}</span>
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
                    const folder = row.original;
                    return (
                        <div className="flex items-center justify-end gap-1">
                            <a
                                href={`/document-folders/${folder.id}/edit`}
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
                                title="Delete folder?"
                                description={`Delete "${folder.name}"? Documents inside will be unlinked from this folder.`}
                                onConfirm={() => router.delete(`/document-folders/${folder.id}`)}
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
            <Head title="Document Folders" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading title="Document Folders" description={`${folders.total} total`} />
                    <Button asChild>
                        <a href="/document-folders/create">New folder</a>
                    </Button>
                </div>

                <DataTable tableId="folders-index-table"
                    columns={columns}
                    data={folders.data}
                    emptyMessage="No folders found."
                />

                <Pagination links={folders.links} />
            </div>
        </>
    );
}

DocumentFoldersIndex.layout = { breadcrumbs };
