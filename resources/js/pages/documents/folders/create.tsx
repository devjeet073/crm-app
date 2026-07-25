import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { BreadcrumbItem, DocumentFolder } from '@/types';

type PageProps = {
    parentFolders: DocumentFolder[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Documents', href: '/documents' },
    { title: 'Folders', href: '/document-folders' },
    { title: 'New folder', href: '/document-folders/create' },
];

export default function DocumentFolderCreate({ parentFolders }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        parent_id: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/document-folders');
    }

    return (
        <>
            <Head title="New Folder" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <Heading
                    title="New Folder"
                    description="Organise documents into a hierarchy."
                />

                <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
                    <div className="space-y-1.5">
                        <Label htmlFor="folder-name">
                            Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="folder-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Folder name"
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="folder-parent">Parent Folder</Label>
                        <Select
                            value={data.parent_id || 'none'}
                            onValueChange={(v) =>
                                setData('parent_id', v === 'none' ? '' : v)
                            }
                        >
                            <SelectTrigger id="folder-parent">
                                <SelectValue placeholder="— Root (no parent) —" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">
                                    — Root (no parent) —
                                </SelectItem>
                                {parentFolders.map((f) => (
                                    <SelectItem key={f.id} value={f.id}>
                                        {f.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.parent_id && (
                            <p className="text-sm text-destructive">
                                {errors.parent_id}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="folder-description">Description</Label>
                        <Textarea
                            id="folder-description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            rows={3}
                            placeholder="Optional notes…"
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" type="button" onClick={() => router.visit('/document-folders')}>
                            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating…' : 'Create folder'}
                        </Button>
                        <Button type="button" variant="ghost" asChild>
                            <a href="/document-folders">Cancel</a>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

DocumentFolderCreate.layout = { breadcrumbs };
