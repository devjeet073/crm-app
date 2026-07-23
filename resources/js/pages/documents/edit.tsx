import { Head, useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import UserCombobox from '@/components/user-combobox';
import type { BreadcrumbItem, Document, DocumentFolder, User } from '@/types';

type PageProps = {
    document: Document;
    users: User[];
    folders: DocumentFolder[];
    statuses: string[];
    types: string[];
};

export default function DocumentEdit({ document, users, folders, statuses, types }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Documents', href: '/documents' },
        { title: document.name ?? `Document #${document.id}`, href: `/documents/${document.id}` },
        { title: 'Edit', href: `/documents/${document.id}/edit` },
    ];

    const { data, setData, put, processing, errors, progress } = useForm({
        name:             document.name ?? '',
        status:           document.status,
        type:             document.type ?? '',
        publish_date:     document.publish_date ?? '',
        expiration_date:  document.expiration_date ?? '',
        description:      document.description ?? '',
        folder_id:        document.folder_id ?? '',
        assigned_user_id: document.assigned_user_id ?? '',
        file:             null as File | null,
        remove_file:      false,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/documents/${document.id}`);
    }

    function handleRemoveFile() {
        setData('file', null);
        setData('remove_file', true);
    }

    return (
        <>
            <Head title={`Edit – ${document.name ?? 'Document'}`} />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <Heading
                    title={`Edit: ${document.name ?? `Document #${document.id}`}`}
                    description="Update this document's details."
                />

                <form onSubmit={handleSubmit} className="max-w-2xl space-y-6" encType="multipart/form-data">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="doc-name">Name <span className="text-destructive">*</span></Label>
                        <Input
                            id="doc-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    {/* Status + Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="doc-status">Status</Label>
                            <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                <SelectTrigger id="doc-status"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="doc-type">Type</Label>
                            <Select value={data.type || 'none'} onValueChange={(v) => setData('type', v === 'none' ? '' : v)}>
                                <SelectTrigger id="doc-type"><SelectValue placeholder="Select type…" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">— None —</SelectItem>
                                    {types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="doc-publish">Publish Date</Label>
                            <DatePicker id="doc-publish" value={data.publish_date} onChange={(date) => setData('publish_date', date)} />
                            {errors.publish_date && <p className="text-sm text-destructive">{errors.publish_date}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="doc-expiry">Expiration Date</Label>
                            <DatePicker id="doc-expiry" value={data.expiration_date} onChange={(date) => setData('expiration_date', date)} />
                            {errors.expiration_date && <p className="text-sm text-destructive">{errors.expiration_date}</p>}
                        </div>
                    </div>

                    {/* File upload */}
                    <div className="space-y-1.5">
                        <Label htmlFor="doc-file">File</Label>

                        {document.file && !data.remove_file && !data.file ? (
                            <div className="flex items-center gap-3 rounded-lg border p-3">
                                <div className="flex-1 truncate text-sm">
                                    <span className="font-medium">{document.file.original_name}</span>
                                    <span className="ml-2 text-muted-foreground">({document.file.size_for_humans})</span>
                                </div>
                                <Button type="button" variant="ghost" size="sm" onClick={handleRemoveFile}>
                                    <X className="h-4 w-4" />
                                    <span className="ml-1">Remove</span>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Input
                                    id="doc-file"
                                    type="file"
                                    className="cursor-pointer"
                                    onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                                />
                            </div>
                        )}

                        {progress && (
                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>Uploading…</span>
                                    <span>{progress.percentage}%</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-primary transition-all"
                                        style={{ width: `${progress.percentage}%` }}
                                    />
                                </div>
                            </div>
                        )}
                        {errors.file && <p className="text-sm text-destructive">{errors.file}</p>}
                    </div>

                    {/* Folder */}
                    <div className="space-y-1.5">
                        <Label htmlFor="doc-folder">Folder</Label>
                        <Select value={data.folder_id || 'none'} onValueChange={(v) => setData('folder_id', v === 'none' ? '' : v)}>
                            <SelectTrigger id="doc-folder"><SelectValue placeholder="No folder" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">— No folder —</SelectItem>
                                {folders.map((f) => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        {errors.folder_id && <p className="text-sm text-destructive">{errors.folder_id}</p>}
                    </div>

                    {/* Assigned user */}
                    <div className="space-y-1.5">
                        <Label htmlFor="doc-assigned">Assigned To</Label>
                        <UserCombobox
                            id="doc-assigned"
                            value={data.assigned_user_id}
                            initialUser={document.assigned_user}
                            onChange={(v) => setData('assigned_user_id', v)}
                        />
                        {errors.assigned_user_id && <p className="text-sm text-destructive">{errors.assigned_user_id}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <Label htmlFor="doc-description">Description</Label>
                        <Textarea
                            id="doc-description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={4}
                        />
                        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving…' : 'Save changes'}
                        </Button>
                        <Button type="button" variant="ghost" asChild>
                            <a href={`/documents/${document.id}`}>Cancel</a>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

DocumentEdit.layout = ({ children }: { children: React.ReactNode }) => children;
