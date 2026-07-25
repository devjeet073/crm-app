import { Head, router, useForm, setLayoutProps } from '@inertiajs/react';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    index as configsIndex,
    show as configsShow,
    update as configsUpdate,
} from '@/routes/email-configurations';
import type { BreadcrumbItem } from '@/types';
import type { EmailConfiguration } from './index';

type PageProps = {
    config: EmailConfiguration;
    mailers: string[];
    encryptionOptions: string[];
};


export default function EmailConfigurationsEdit({
    config,
    mailers,
    encryptionOptions,
}: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Email Configurations', href: configsIndex() },
        { title: config.name, href: configsShow.url(config) },
        { title: 'Edit', href: '' },
    ];

    setLayoutProps({ breadcrumbs });

    const { data, setData, patch, errors, processing } = useForm({
        name: config.name,
        mailer: config.mailer,
        host: config.host ?? '',
        port: config.port ?? 587,
        encryption: config.encryption ?? '',
        username: config.username ?? '',
        password: '',
        from_address: config.from_address,
        from_name: config.from_name ?? '',
        timeout: config.timeout ?? 30,
        is_active: config.is_active,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        patch(configsUpdate.url(config), { preserveScroll: true });
    }

    return (
        <>
            <Head title={`Edit: ${config.name}`} />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                        <Mail className="h-5 w-5" /> Edit: {config.name}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Update the email configuration settings.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>
                                    Name and mail driver for this configuration.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-destructive">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="mailer">Mailer</Label>
                                        <Select
                                            name="mailer"
                                            value={data.mailer}
                                            onValueChange={(val) =>
                                                setData('mailer', val)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select mailer" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {mailers.map((m) => (
                                                    <SelectItem
                                                        key={m}
                                                        value={m}
                                                    >
                                                        {m}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.mailer && (
                                            <p className="text-sm text-destructive">
                                                {errors.mailer}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>SMTP Settings</CardTitle>
                                <CardDescription>
                                    Server connection details for outgoing mail.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="host">Host</Label>
                                        <Input
                                            id="host"
                                            name="host"
                                            placeholder="smtp.example.com"
                                            value={data.host}
                                            onChange={(e) =>
                                                setData('host', e.target.value)
                                            }
                                        />
                                        {errors.host && (
                                            <p className="text-sm text-destructive">
                                                {errors.host}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="port">Port</Label>
                                        <Input
                                            id="port"
                                            name="port"
                                            type="number"
                                            value={data.port}
                                            onChange={(e) =>
                                                setData(
                                                    'port',
                                                    parseInt(e.target.value),
                                                )
                                            }
                                        />
                                        {errors.port && (
                                            <p className="text-sm text-destructive">
                                                {errors.port}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="encryption">
                                            Encryption
                                        </Label>
                                        <Select
                                            name="encryption"
                                            value={data.encryption}
                                            onValueChange={(val) =>
                                                setData('encryption', val)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="None" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">
                                                    None
                                                </SelectItem>
                                                {encryptionOptions.map((e) => (
                                                    <SelectItem
                                                        key={e}
                                                        value={e}
                                                    >
                                                        {e.toUpperCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.encryption && (
                                            <p className="text-sm text-destructive">
                                                {errors.encryption}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="timeout">
                                            Timeout (seconds)
                                        </Label>
                                        <Input
                                            id="timeout"
                                            name="timeout"
                                            type="number"
                                            value={data.timeout}
                                            onChange={(e) =>
                                                setData(
                                                    'timeout',
                                                    parseInt(e.target.value),
                                                )
                                            }
                                        />
                                        {errors.timeout && (
                                            <p className="text-sm text-destructive">
                                                {errors.timeout}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Credentials</CardTitle>
                                <CardDescription>
                                    Leave blank to keep the existing password.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="username">
                                            Username
                                        </Label>
                                        <Input
                                            id="username"
                                            name="username"
                                            value={data.username}
                                            onChange={(e) =>
                                                setData(
                                                    'username',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {errors.username && (
                                            <p className="text-sm text-destructive">
                                                {errors.username}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">
                                            New Password
                                        </Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="Leave blank to keep current"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    'password',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {errors.password && (
                                            <p className="text-sm text-destructive">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>From Address</CardTitle>
                                <CardDescription>
                                    The default sender address and name for
                                    outgoing emails.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="from_address">
                                            From Address
                                        </Label>
                                        <Input
                                            id="from_address"
                                            name="from_address"
                                            type="email"
                                            value={data.from_address}
                                            onChange={(e) =>
                                                setData(
                                                    'from_address',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        {errors.from_address && (
                                            <p className="text-sm text-destructive">
                                                {errors.from_address}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="from_name">
                                            From Name
                                        </Label>
                                        <Input
                                            id="from_name"
                                            name="from_name"
                                            value={data.from_name}
                                            onChange={(e) =>
                                                setData(
                                                    'from_name',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {errors.from_name && (
                                            <p className="text-sm text-destructive">
                                                {errors.from_name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="is_active"
                                        name="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) =>
                                            setData('is_active', !!checked)
                                        }
                                    />
                                    <Label htmlFor="is_active">
                                        Set as active configuration
                                    </Label>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-center gap-3">
                            <Button variant="outline" type="button" onClick={() => router.visit(configsIndex.url())}>
                                <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Updating...'
                                    : 'Update Configuration'}
                            </Button>
                            <Button variant="outline" asChild>
                                <a href={configsShow.url(config)}>Cancel</a>
                            </Button>
                        </div>
                    </>
                </form>
            </div>
        </>
    );
}

