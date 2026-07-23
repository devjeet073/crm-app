import { Head, router, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { index as teamsIndex, show as teamsShow, update as teamsUpdate } from '@/routes/teams';
import type { BreadcrumbItem, Team } from '@/types';

type PageProps = { team: Team };

export default function TeamEdit({ team }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Teams', href: teamsIndex() },
        { title: team.name, href: teamsShow.url(team) },
        { title: 'Edit', href: '' },
    ];

    const { data, setData, patch, errors, processing, transform } = useForm({
        name: team.name,
        description: team.description ?? '',
        position_list: (team.position_list ?? []).join(', '),
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
                position_list: positions.length > 0 ? positions : [],
            } as any;
        });

        patch(teamsUpdate.url(team));
    }

    return (
        <>
            <Head title={`Edit: ${team.name}`} />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <Heading title={`Edit "${team.name}"`} description="Update team details and available positions" />

                <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Team Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="position_list">Positions (comma-separated)</Label>
                                <Input
                                    id="position_list"
                                    value={data.position_list}
                                    onChange={(e) => setData('position_list', e.target.value)}
                                    placeholder="Sales Rep, Manager, …"
                                />
                                <p className="text-xs text-muted-foreground">
                                    These labels are available when assigning users to this team.
                                </p>
                                {errors.position_list && <p className="text-sm text-destructive">{errors.position_list}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving…' : 'Save Changes'}
                        </Button>
                        <Button variant="outline" type="button" onClick={() => router.visit(teamsShow.url(team))}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

TeamEdit.layout = { breadcrumbs: [] };
