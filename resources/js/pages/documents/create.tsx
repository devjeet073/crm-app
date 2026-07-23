import { Head, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import UserCombobox from '@/components/user-combobox';
import type { BreadcrumbItem, DocumentFolder, User } from '@/types';

type PageProps = {
    users: User[];
    folders: DocumentFolder[];
    statuses: string[];
    types: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Documents', href: '/documents' },
    { title: 'New document', href: '/documents/create' },
];

export default function DocumentCreate({ users, folders, statuses, types }: PageProps) {
    const { data, setData, post, processing, errors, progress } = useForm({
        name: '',
        status: 'Active',
        type: '',
        publish_date: '',
        expiration_date: '',
        description: '',
        folder_id: '',
        assigned_user_id: '',
        file: null as File | null,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/documents');
    }

    return (
        <>
            <Head title="New Document" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <Heading title="New Document" description="Create a new document record." />

                <form onSubmit={handleSubmit} className="max-w-2xl space-y-6" encType="multipart/form-data">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="doc-name">Name <span className="text-destructive">*</span></Label>
                        <Input
                            id="doc-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Document title"
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    {/* Status + Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="doc-status">Status</Label>
                            <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                <SelectTrigger id="doc-status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="doc-type">Type</Label>
                            <Select value={data.type || 'none'} onValueChange={(v) => setData('type', v === 'none' ? '' : v)}>
                                <SelectTrigger id="doc-type">
                                    <SelectValue placeholder="Select type…" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">— None —</SelectItem>
                                    {types.map((t) => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                        </div>
                    </div>

                    {/* Publish + Expiration dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="doc-publish">Publish Date</Label>
                            <DatePicker
                                id="doc-publish"
                                value={data.publish_date}
                                onChange={(date) => setData('publish_date', date)}
                            />
                            {errors.publish_date && <p className="text-sm text-destructive">{errors.publish_date}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="doc-expiry">Expiration Date</Label>
                            <DatePicker
                                id="doc-expiry"
                                value={data.expiration_date}
                                onChange={(date) => setData('expiration_date', date)}
                            />
                            {errors.expiration_date && <p className="text-sm text-destructive">{errors.expiration_date}</p>}
                        </div>
                    </div>

                    {/* File upload */}
                    <div className="space-y-1.5">
                        <Label htmlFor="doc-file">File</Label>
                        <div className="flex items-center gap-3">
                            <Input
                                id="doc-file"
                                type="file"
                                className="cursor-pointer"
                                onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                            />
                        </div>
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
                            <SelectTrigger id="doc-folder">
                                <SelectValue placeholder="No folder" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">— No folder —</SelectItem>
                                {folders.map((f) => (
                                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                                ))}
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
                            placeholder="Optional notes…"
                        />
                        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating…' : 'Create document'}
                        </Button>
                        <Button type="button" variant="ghost" asChild>
                            <a href="/documents">Cancel</a>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

DocumentCreate.layout = { breadcrumbs };
