import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function AppSecretsEdit({ appSecret }: { appSecret: any }) {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        router.put(`/app-secrets/${appSecret.id}`, Object.fromEntries(formData.entries()));
    };

    return (
        <>
            <Head title="Edit app secret" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Edit app secret</h1>
                    <p className="text-sm text-muted-foreground">Update an existing secret.</p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-xl space-y-4 rounded-lg border bg-background p-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" defaultValue={appSecret.name} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="value">Value</Label>
                        <Textarea id="value" name="value" defaultValue={appSecret.value ?? ''} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" defaultValue={appSecret.description ?? ''} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit">Save</Button>
                        <Link href="/app-secrets" className="text-sm text-muted-foreground hover:underline">Cancel</Link>
                    </div>
                </form>
            </div>
        </>
    );
}
