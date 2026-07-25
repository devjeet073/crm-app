import { Head, router, useForm, setLayoutProps } from '@inertiajs/react';
import {
    ArrowLeft,
    Mail,
    Pencil,
    Trash2,
    Send,
    CheckCircle2,
    XCircle,
    Loader2,
} from 'lucide-react';
import { useState } from 'react';
import { DeleteAlertDialog } from '@/components/delete-alert-dialog';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    index as configsIndex,
    edit as configsEdit,
    destroy as configsDestroy,
} from '@/routes/email-configurations';
import type { BreadcrumbItem } from '@/types';
import type { EmailConfiguration } from './index';

type PageProps = {
    config: EmailConfiguration;
};

export default function EmailConfigurationsShow({ config }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Email Configurations', href: configsIndex() },
        { title: config.name, href: '' },
    ];

    setLayoutProps({ breadcrumbs });

    const [dialogOpen, setDialogOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        to: '',
        subject: 'Test Email from ' + config.name,
        message:
            'This is a test email sent from the email configuration "' +
            config.name +
            '".',
    });

    function handleSendTest(e: React.FormEvent) {
        e.preventDefault();
        post(`/email-configurations/${config.id}/send-test`, {
            preserveScroll: true,
            onSuccess: () => {
                setDialogOpen(false);
                reset();
            },
        });
    }

    return (
        <>
            <Head title={`Email: ${config.name}`} />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title={config.name}
                        description={`${config.mailer.toUpperCase()} — ${config.from_address}`}
                    />
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => router.visit(configsIndex.url())}
                        >
                            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                        </Button>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Send className="mr-1.5 h-4 w-4" /> Send
                                    Test Email
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Send Test Email</DialogTitle>
                                    <DialogDescription>
                                        Send a test email using the &ldquo;
                                        {config.name}&rdquo; configuration to
                                        verify your SMTP settings.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSendTest}>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="to">
                                                Recipient Email
                                            </Label>
                                            <Input
                                                id="to"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={data.to}
                                                onChange={(e) =>
                                                    setData(
                                                        'to',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                            {errors.to && (
                                                <p className="text-sm text-destructive">
                                                    {errors.to}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subject">
                                                Subject
                                            </Label>
                                            <Input
                                                id="subject"
                                                value={data.subject}
                                                onChange={(e) =>
                                                    setData(
                                                        'subject',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                            {errors.subject && (
                                                <p className="text-sm text-destructive">
                                                    {errors.subject}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="message">
                                                Message
                                            </Label>
                                            <Textarea
                                                id="message"
                                                rows={5}
                                                value={data.message}
                                                onChange={(e) =>
                                                    setData(
                                                        'message',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                            {errors.message && (
                                                <p className="text-sm text-destructive">
                                                    {errors.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setDialogOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing && (
                                                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                                            )}
                                            {processing
                                                ? 'Sending...'
                                                : 'Send Email'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <Button variant="outline" asChild>
                            <a href={configsEdit.url(config)}>
                                <Pencil className="mr-1.5 h-4 w-4" /> Edit
                            </a>
                        </Button>
                        <DeleteAlertDialog
                            trigger={
                                <Button variant="destructive">
                                    <Trash2 className="mr-1.5 h-4 w-4" /> Delete
                                </Button>
                            }
                            title={`Delete "${config.name}"?`}
                            description="This will remove the email configuration permanently."
                            onConfirm={() =>
                                router.delete(configsDestroy.url(config), {
                                    onSuccess: () =>
                                        router.visit(configsIndex.url()),
                                })
                            }
                        />
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                            <CardDescription>
                                Whether this configuration is active.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {config.is_active ? (
                                <Badge
                                    variant="default"
                                    className="gap-1 px-3 py-1.5 text-sm"
                                >
                                    <CheckCircle2 className="h-4 w-4" /> Active
                                </Badge>
                            ) : (
                                <Badge
                                    variant="secondary"
                                    className="gap-1 px-3 py-1.5 text-sm"
                                >
                                    <XCircle className="h-4 w-4" /> Inactive
                                </Badge>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-4 w-4" /> Mailer
                            </CardTitle>
                            <CardDescription>
                                Mail driver and transport.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant="outline"
                                    className="text-xs uppercase"
                                >
                                    {config.mailer}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Server Details</CardTitle>
                        <CardDescription>
                            SMTP connection settings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                            <div>
                                <dt className="text-muted-foreground">Host</dt>
                                <dd className="font-medium">
                                    {config.host ?? '—'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Port</dt>
                                <dd className="font-medium">
                                    {config.port ?? '—'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Encryption
                                </dt>
                                <dd className="font-medium uppercase">
                                    {config.encryption ?? 'None'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Timeout
                                </dt>
                                <dd className="font-medium">
                                    {config.timeout ?? '—'}s
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Username
                                </dt>
                                <dd className="font-medium">
                                    {config.username ?? '—'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Password
                                </dt>
                                <dd className="font-medium text-muted-foreground italic">
                                    ••••••••
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Sender Information</CardTitle>
                        <CardDescription>
                            Default from address and name.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                            <div>
                                <dt className="text-muted-foreground">
                                    From Address
                                </dt>
                                <dd className="font-medium">
                                    {config.from_address}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    From Name
                                </dt>
                                <dd className="font-medium">
                                    {config.from_name ?? '—'}
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
