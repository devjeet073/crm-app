import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { index as teamsIndex, store as teamsStore } from '@/routes/teams';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Teams', href: teamsIndex() },
    { title: 'New Team', href: '' },
];

export default function TeamCreate() {
    const { data, setData, post, errors, processing, transform } = useForm({
        name: '',
        description: '',
        position_list: '', // comma-separated, converted on submit
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        transform((data) => {
            const positions = data.position_list
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);

            return {
                ...data,
                position_list: positions.length > 0 ? positions : undefined,
            } as any;
        });

        post(teamsStore.url());
    }

    return (
        <>
            <Head title="New Team" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <Heading
                    title="New Team"
                    description="Create a team to group users for record visibility and role assignment"
                />

                <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Team Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name">
                                    Name{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="e.g. Sales Team"
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="What is this team responsible for?"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="position_list">
                                    Positions (comma-separated)
                                </Label>
                                <Input
                                    id="position_list"
                                    value={data.position_list}
                                    onChange={(e) =>
                                        setData('position_list', e.target.value)
                                    }
                                    placeholder="e.g. Sales Rep, Sales Manager, Account Executive"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Position labels members can be assigned
                                    within this team.
                                </p>
                                {errors.position_list && (
                                    <p className="text-sm text-destructive">
                                        {errors.position_list}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-3">
                        <Button variant="outline" type="button" onClick={() => router.visit(teamsIndex.url())}>
                            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating…' : 'Create Team'}
                        </Button>
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => router.visit(teamsIndex.url())}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

TeamCreate.layout = { breadcrumbs };
