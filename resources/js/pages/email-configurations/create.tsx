import { Head, Form } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index as configsIndex, store as configsStore } from '@/routes/email-configurations';
import type { BreadcrumbItem } from '@/types';

type PageProps = {
    mailers: string[];
    encryptionOptions: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Email Configurations', href: configsIndex() },
    { title: 'New', href: '' },
];

export default function EmailConfigurationsCreate({ mailers, encryptionOptions }: PageProps) {
    return (
        <>
            <Head title="New Email Configuration" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Mail className="h-5 w-5" /> New Email Configuration
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">Set up a new SMTP or email delivery configuration.</p>
                </div>

                <Form {...configsStore.form()} resetOnSuccess className="space-y-6">
                    {({ errors, processing }) => (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                    <CardDescription>Name and mail driver for this configuration.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input id="name" name="name" placeholder="Primary SMTP" required />
                                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="mailer">Mailer</Label>
                                            <Select name="mailer" defaultValue="smtp">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select mailer" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {mailers.map((m) => (
                                                        <SelectItem key={m} value={m}>{m}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.mailer && <p className="text-sm text-destructive">{errors.mailer}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>SMTP Settings</CardTitle>
                                    <CardDescription>Server connection details for outgoing mail.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="host">Host</Label>
                                            <Input id="host" name="host" placeholder="smtp.example.com" />
                                            {errors.host && <p className="text-sm text-destructive">{errors.host}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="port">Port</Label>
                                            <Input id="port" name="port" type="number" placeholder="587" />
                                            {errors.port && <p className="text-sm text-destructive">{errors.port}</p>}
                                        </div>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="encryption">Encryption</Label>
                                            <Select name="encryption">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="None" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">None</SelectItem>
                                                    {encryptionOptions.map((e) => (
                                                        <SelectItem key={e} value={e}>{e.toUpperCase()}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.encryption && <p className="text-sm text-destructive">{errors.encryption}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="timeout">Timeout (seconds)</Label>
                                            <Input id="timeout" name="timeout" type="number" placeholder="30" />
                                            {errors.timeout && <p className="text-sm text-destructive">{errors.timeout}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Credentials</CardTitle>
                                    <CardDescription>Authentication for the mail server (if required).</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="username">Username</Label>
                                            <Input id="username" name="username" placeholder="user@example.com" />
                                            {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input id="password" name="password" type="password" />
                                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>From Address</CardTitle>
                                    <CardDescription>The default sender address and name for outgoing emails.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="from_address">From Address</Label>
                                            <Input id="from_address" name="from_address" type="email" placeholder="noreply@example.com" required />
                                            {errors.from_address && <p className="text-sm text-destructive">{errors.from_address}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="from_name">From Name</Label>
                                            <Input id="from_name" name="from_name" placeholder="My App" />
                                            {errors.from_name && <p className="text-sm text-destructive">{errors.from_name}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2">
                                        <Checkbox id="is_active" name="is_active" />
                                        <Label htmlFor="is_active">Set as active configuration</Label>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex items-center gap-3">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Configuration'}
                                </Button>
                                <Button variant="outline" asChild>
                                    <a href={configsIndex.url()}>Cancel</a>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

EmailConfigurationsCreate.layout = { breadcrumbs };
