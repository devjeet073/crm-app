import { Head, router, useForm } from '@inertiajs/react';
import { Upload, X } from 'lucide-react';
import { useRef } from 'react';
import Heading from '@/components/heading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getInitials } from '@/lib/utils';
import { show as usersShow, update as usersUpdate } from '@/routes/users';
import type { CrmUser, Team } from '@/types';

type PageProps = {
    user: CrmUser;
    teams: Pick<Team, 'id' | 'name'>[];
    types: string[];
};

export default function UserEdit({ user, teams, types }: PageProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, patch, errors, processing } = useForm({
        name:             user.name,
        email:            user.email,
        title:            user.title            ?? '',
        salutation_name:  user.salutation_name  ?? '',
        middle_name:      user.middle_name      ?? '',
        gender:           user.gender           ?? '',
        avatar:           null as File | null,
        remove_avatar:    false,
        avatar_color:     user.avatar_color     ?? '#6366f1',
        type:             user.type,
        is_active:        user.is_active,
        default_team_id:  user.default_team_id?.toString() ?? '',
    });

    const avatarPreview = data.avatar
        ? URL.createObjectURL(data.avatar)
        : data.remove_avatar
            ? null
            : user.avatar_url;

    function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (file) {
            setData('avatar', file);
            setData('remove_avatar', false);
        }
    }

    function handleRemoveAvatar() {
        setData('avatar', null);
        setData('remove_avatar', true);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        patch(usersUpdate.url(user));
    }

    return (
        <>
            <Head title={`Edit: ${user.name}`} />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <Heading title={`Edit "${user.name}"`} description="Update user profile and access settings" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Profile */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>Basic identity fields for this user</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="salutation_name">Salutation</Label>
                                        <Select value={data.salutation_name} onValueChange={(v) => setData('salutation_name', v)}>
                                            <SelectTrigger id="salutation_name"><SelectValue placeholder="—" /></SelectTrigger>
                                            <SelectContent>
                                                {['', 'Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.'].map((s) => (
                                                    <SelectItem key={s} value={s}>{s || '—'}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="gender">Gender</Label>
                                        <Select value={data.gender} onValueChange={(v) => setData('gender', v)}>
                                            <SelectTrigger id="gender"><SelectValue placeholder="—" /></SelectTrigger>
                                            <SelectContent>
                                                {['', 'Male', 'Female', 'Other'].map((g) => (
                                                    <SelectItem key={g} value={g}>{g || '—'}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="middle_name">Middle Name</Label>
                                    <Input id="middle_name" value={data.middle_name} onChange={(e) => setData('middle_name', e.target.value)} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                                    <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="title">Job Title</Label>
                                    <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="e.g. Sales Manager" />
                                </div>

                                <div className="space-y-3">
                                    <Label>Avatar</Label>
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-16 w-16 text-xl font-semibold">
                                            <AvatarImage src={avatarPreview ?? undefined} alt={user.name} />
                                            <AvatarFallback style={{ backgroundColor: data.avatar_color ?? '#6366f1' }} className="text-white">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <Upload className="mr-1.5 h-4 w-4" />
                                                Upload image
                                            </Button>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp,image/gif"
                                                className="hidden"
                                                onChange={handleAvatarChange}
                                            />
                                            {(user.avatar_url || data.avatar) && !data.remove_avatar && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive"
                                                    onClick={handleRemoveAvatar}
                                                >
                                                    <X className="mr-1.5 h-4 w-4" />
                                                    Remove
                                                </Button>
                                            )}
                                            {errors.avatar && <p className="text-sm text-destructive">{errors.avatar}</p>}
                                            <p className="text-xs text-muted-foreground">JPG, PNG, WebP, GIF. Max 2MB.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="avatar_color">Avatar Colour</Label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            id="avatar_color"
                                            type="color"
                                            value={data.avatar_color}
                                            onChange={(e) => setData('avatar_color', e.target.value)}
                                            className="h-9 w-16 cursor-pointer rounded-md border p-0.5"
                                        />
                                        <span className="text-sm text-muted-foreground">{data.avatar_color}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Access Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Access Settings</CardTitle>
                                <CardDescription>Account type, status, and team assignment (admin only)</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="type">User Type</Label>
                                    <Select value={data.type} onValueChange={(v) => setData('type', v as typeof data.type)}>
                                        <SelectTrigger id="type"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {types.map((t) => (
                                                <SelectItem key={t} value={t}>{t}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="default_team_id">Default Team</Label>
                                    <Select
                                        value={data.default_team_id}
                                        onValueChange={(v) => setData('default_team_id', v)}
                                    >
                                        <SelectTrigger id="default_team_id"><SelectValue placeholder="None" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">None</SelectItem>
                                            {teams.map((team) => (
                                                <SelectItem key={team.id} value={String(team.id)}>{team.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center gap-3 rounded-lg border p-3">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', !!checked)}
                                    />
                                    <div>
                                        <Label htmlFor="is_active" className="cursor-pointer font-medium">Active Account</Label>
                                        <p className="text-xs text-muted-foreground">Inactive users cannot log in</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving…' : 'Save Changes'}
                        </Button>
                        <Button variant="outline" type="button" onClick={() => router.visit(usersShow.url(user))}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

UserEdit.layout = { breadcrumbs: [] };
