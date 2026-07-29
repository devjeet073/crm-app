import { useForm } from '@inertiajs/react';
import { Mail, Send, AlertCircle } from 'lucide-react';
import React, { useEffect } from 'react';
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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { sendEmail as sendUserEmail } from '@/routes/users';

export type EmailConfig = {
    id: number;
    name: string;
    from_address: string;
    from_name: string | null;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    recipient: { name: string; email: string } | null;
    emailConfigurations: EmailConfig[];
};

export function SendEmailDrawer({
    open,
    onOpenChange,
    recipient,
    emailConfigurations = [],
}: Props) {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            email_configuration_id:
                emailConfigurations[0]?.id?.toString() ?? '',
            to: recipient?.email ?? '',
            subject: '',
            body: '',
        });

    useEffect(() => {
        if (open && recipient) {
            setData({
                email_configuration_id:
                    emailConfigurations[0]?.id?.toString() ?? '',
                to: recipient.email,
                subject: '',
                body: '',
            });
            clearErrors();
        }
    }, [open, recipient, emailConfigurations]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(sendUserEmail.url(), {
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
        });
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-lg">
                <SheetHeader className="border-b p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Mail className="h-5 w-5" />
                        </div>
                        <div>
                            <SheetTitle>Send Email</SheetTitle>
                            <SheetDescription>
                                Compose and send an email to{' '}
                                <span className="font-semibold text-foreground">
                                    {recipient?.name ?? 'User'}
                                </span>
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="flex flex-1 flex-col justify-between overflow-y-auto">
                    <div className="flex flex-col gap-5 p-6">
                        {emailConfigurations.length === 0 ? (
                            <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-600 dark:text-amber-400">
                                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                                <div>
                                    <p className="font-semibold">No Active Email Configurations</p>
                                    <p className="mt-1 text-xs">
                                        Please create an active email configuration in Email Configurations settings to send emails.
                                    </p>
                                </div>
                            </div>
                        ) : null}

                        {/* From Configuration */}
                        <div className="space-y-2">
                            <Label htmlFor="email_configuration_id">From (Email Configuration)</Label>
                            <Select
                                value={data.email_configuration_id}
                                onValueChange={(val) => setData('email_configuration_id', val)}
                                disabled={emailConfigurations.length === 0 || processing}
                            >
                                <SelectTrigger id="email_configuration_id">
                                    <SelectValue placeholder="Select email configuration..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {emailConfigurations.map((config) => (
                                        <SelectItem key={config.id} value={config.id.toString()}>
                                            {config.name} ({config.from_address})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.email_configuration_id && (
                                <p className="text-xs text-destructive">{errors.email_configuration_id}</p>
                            )}
                        </div>

                        {/* To */}
                        <div className="space-y-2">
                            <Label htmlFor="to">To</Label>
                            <Input
                                id="to"
                                type="email"
                                value={data.to}
                                onChange={(e) => setData('to', e.target.value)}
                                placeholder="recipient@example.com"
                                required
                                disabled={processing}
                            />
                            {errors.to && <p className="text-xs text-destructive">{errors.to}</p>}
                        </div>

                        {/* Subject */}
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                value={data.subject}
                                onChange={(e) => setData('subject', e.target.value)}
                                placeholder="Enter email subject..."
                                required
                                disabled={processing}
                            />
                            {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
                        </div>

                        {/* Body */}
                        <div className="space-y-2">
                            <Label htmlFor="body">Message Content</Label>
                            <Textarea
                                id="body"
                                rows={8}
                                value={data.body}
                                onChange={(e) => setData('body', e.target.value)}
                                placeholder="Write your email content here..."
                                required
                                disabled={processing}
                                className="resize-none"
                            />
                            {errors.body && <p className="text-xs text-destructive">{errors.body}</p>}
                        </div>
                    </div>

                    <SheetFooter className="border-t p-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || emailConfigurations.length === 0}
                            className="gap-2"
                        >
                            <Send className="h-4 w-4" />
                            {processing ? 'Sending...' : 'Send Email'}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
