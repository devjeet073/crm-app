import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function AppSecretsCreate() {
    return (
        <>
            <Head title="Create app secret" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Create app secret</h1>
                    <p className="text-sm text-muted-foreground">Add a new secret for integrations.</p>
                </div>

                <form method="post" action="/app-secrets" className="max-w-xl space-y-4 rounded-lg border bg-background p-4">
                    <input type="hidden" name="_token" value="" />

                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" placeholder="WEBHOOK_SECRET" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="value">Value</Label>
                        <Textarea id="value" name="value" placeholder="Paste your secret value" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" placeholder="Optional details" />
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
