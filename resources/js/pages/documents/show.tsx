import { Head, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { ArrowLeft, Download, FileText, FolderOpen, Pencil, Trash2, User2 } from 'lucide-react';
import { DeleteAlertDialog } from '@/components/delete-alert-dialog';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem, Document } from '@/types';

type PageProps = {
    document: Document;
};

const STATUS_COLORS: Record<string, string> = {
    Active:   'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Draft:    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    Expired:  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    Archived: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
};

const MIME_ICONS: Record<string, string> = {
    'application/pdf': 'PDF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/vnd.ms-excel': 'XLS',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    'application/vnd.ms-powerpoint': 'PPT',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
    'image/': 'IMG',
    'text/': 'TXT',
};

function getFileTypeLabel(mimeType: string): string {
    for (const [key, label] of Object.entries(MIME_ICONS)) {
        if (mimeType.startsWith(key)) {
return label;
}
    }

    return 'FILE';
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="grid grid-cols-3 gap-2 py-3 border-b last:border-b-0">
            <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
            <dd className="col-span-2 text-sm">{value ?? <span className="text-muted-foreground">—</span>}</dd>
        </div>
    );
}

export default function DocumentShow({ document }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Documents', href: '/documents' },
        { title: document.name ?? `Document #${document.id}`, href: `/documents/${document.id}` },
    ];

    return (
        <>
            <Head title={document.name ?? 'Document'} />

            <div className="flex flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <Heading
                            title={document.name ?? `Document #${document.id}`}
                            description={document.type ?? 'Document'}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => router.visit('/documents')}>
                            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <a href={`/documents/${document.id}/edit`}>
                                <Pencil className="mr-1.5 h-4 w-4" /> Edit
                            </a>
                        </Button>
                        <DeleteAlertDialog
                            trigger={
                                <Button variant="destructive" size="sm">
                                    <Trash2 className="mr-1.5 h-4 w-4" /> Delete
                                </Button>
                            }
                            title="Delete document?"
                            description={`This will permanently delete "${document.name ?? `Document #${document.id}`}". This action cannot be undone.`}
                            onConfirm={() => router.delete(`/documents/${document.id}`, { onSuccess: () => router.visit('/documents') })}
                        />
                    </div>
                </div>

                {/* Status badge */}
                <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-medium ${STATUS_COLORS[document.status] ?? 'bg-muted text-muted-foreground'}`}>
                    {document.status}
                </span>

                {/* Detail card */}
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <dl>
                        <DetailRow label="Type" value={document.type} />
                        <DetailRow
                            label="Folder"
                            value={
                                document.folder ? (
                                    <span className="flex items-center gap-1">
                                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                                        {document.folder.name}
                                    </span>
                                ) : null
                            }
                        />
                        <DetailRow
                            label="Publish date"
                            value={document.publish_date ? format(new Date(document.publish_date), 'dd MMM yyyy') : null}
                        />
                        <DetailRow
                            label="Expiration date"
                            value={document.expiration_date ? format(new Date(document.expiration_date), 'dd MMM yyyy') : null}
                        />
                        <DetailRow
                            label="Assigned to"
                            value={
                                document.assigned_user ? (
                                    <span className="flex items-center gap-1">
                                        <User2 className="h-4 w-4 text-muted-foreground" />
                                        {document.assigned_user.name}
                                    </span>
                                ) : null
                            }
                        />
                        <DetailRow
                            label="Created by"
                            value={document.created_by?.name}
                        />
                        <DetailRow
                            label="Created"
                            value={format(new Date(document.created_at), 'dd MMM HH:mm')}
                        />
                        <DetailRow
                            label="Last modified"
                            value={format(new Date(document.updated_at), 'dd MMM HH:mm')}
                        />
                        <DetailRow
                            label="Description"
                            value={
                                document.description ? (
                                    <p className="whitespace-pre-wrap text-muted-foreground">
                                        {document.description}
                                    </p>
                                ) : null
                            }
                        />
                    </dl>
                </div>

                {/* File attachment */}
                {document.file && (
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold">Attached File</h3>
                        <div className="flex items-center gap-4 rounded-lg border bg-muted/30 p-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary uppercase">
                                {getFileTypeLabel(document.file.mime_type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="truncate text-sm font-medium">{document.file.original_name}</p>
                                <p className="text-xs text-muted-foreground">{document.file.size_for_humans}</p>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <a href={document.file.download_url} target="_blank" rel="noopener noreferrer">
                                    <Download className="mr-1.5 h-4 w-4" /> Download
                                </a>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

DocumentShow.layout = ({ children }: { children: React.ReactNode }) => children;
