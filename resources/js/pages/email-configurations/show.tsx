import { Head, router } from '@inertiajs/react';
import { Mail, Pencil, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { DeleteAlertDialog } from '@/components/delete-alert-dialog';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { index as configsIndex, edit as configsEdit, destroy as configsDestroy } from '@/routes/email-configurations';
import type { BreadcrumbItem } from '@/types';
import type { EmailConfiguration } from './index';

type PageProps = {
    config: EmailConfiguration;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Email Configurations', href: configsIndex() },
    { title: '...', href: '' },
];

export default function EmailConfigurationsShow({ config }: PageProps) {
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
                            onConfirm={() => router.delete(configsDestroy.url(config), { onSuccess: () => router.visit(configsIndex.url()) })}
                        />
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                            <CardDescription>Whether this configuration is active.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {config.is_active ? (
                                <Badge variant="default" className="gap-1 text-sm px-3 py-1.5">
                                    <CheckCircle2 className="h-4 w-4" /> Active
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="gap-1 text-sm px-3 py-1.5">
                                    <XCircle className="h-4 w-4" /> Inactive
                                </Badge>
                            )}
                        </CardContent>
                    </Card>

                    {/* Mailer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-4 w-4" /> Mailer
                            </CardTitle>
                            <CardDescription>Mail driver and transport.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="uppercase text-xs">{config.mailer}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Server Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Server Details</CardTitle>
                        <CardDescription>SMTP connection settings.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                            <div>
                                <dt className="text-muted-foreground">Host</dt>
                                <dd className="font-medium">{config.host ?? '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Port</dt>
                                <dd className="font-medium">{config.port ?? '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Encryption</dt>
                                <dd className="font-medium uppercase">{config.encryption ?? 'None'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Timeout</dt>
                                <dd className="font-medium">{config.timeout ?? '—'}s</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Username</dt>
                                <dd className="font-medium">{config.username ?? '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Password</dt>
                                <dd className="font-medium text-muted-foreground italic">••••••••</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                {/* From Address */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sender Information</CardTitle>
                        <CardDescription>Default from address and name.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                            <div>
                                <dt className="text-muted-foreground">From Address</dt>
                                <dd className="font-medium">{config.from_address}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">From Name</dt>
                                <dd className="font-medium">{config.from_name ?? '—'}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EmailConfigurationsShow.layout = { breadcrumbs };
