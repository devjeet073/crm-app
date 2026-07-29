import { Head, useForm, router } from '@inertiajs/react';
import {
    AlertTriangle,
    BellRing,
    Calendar,
    CheckCircle2,
    Clock,
    DollarSign,
    Edit3,
    Gift,
    FileCheck,
    History,
    Plus,
    Play,
    Send,
    ShieldAlert,
    Sparkles,
    Trash2,
    User,
    XCircle,
} from 'lucide-react';
import * as React from 'react';

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
} from '@/components/ui/dialog';
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

interface AutomatedGreeting {
    id: number;
    title: string;
    type: 'birthday' | 'festival';
    event_date: string | null;
    template_subject: string;
    template_body: string;
    target_type: 'all' | 'leads' | 'users';
    status: 'active' | 'paused';
    recurring: boolean;
    last_run_at: string | null;
    creator?: { id: number; name: string };
}

interface ComplianceReminder {
    id: number;
    title: string;
    category: 'gst' | 'itr' | 'emi' | 'other';
    due_date: string;
    amount: number | null;
    risk_level: 'low' | 'medium' | 'high' | 'critical';
    remind_days_before: number;
    recurring_frequency: 'none' | 'monthly' | 'quarterly' | 'yearly';
    status: 'pending' | 'reminded' | 'completed' | 'overdue';
    notes: string | null;
    assigned_user_id: number | null;
    assigned_user?: { id: number; name: string; email: string };
    creator?: { id: number; name: string };
}

interface SentLog {
    id: number;
    type: 'greeting' | 'compliance';
    reference_title: string;
    recipient_email: string;
    recipient_name: string | null;
    subject: string;
    message: string;
    status: 'sent' | 'failed';
    error_message: string | null;
    sent_at: string;
}

interface UserOption {
    id: number;
    name: string;
    email: string;
}

interface PageProps {
    greetings: AutomatedGreeting[];
    complianceReminders: ComplianceReminder[];
    logs: SentLog[];
    users: UserOption[];
    stats: {
        active_greetings: number;
        total_greetings_sent: number;
        pending_compliance: number;
        overdue_compliance: number;
        critical_risk_count: number;
        total_gst_due: number;
        total_emi_due: number;
    };
}

export default function AutomationsIndex({
    greetings = [],
    complianceReminders = [],
    logs = [],
    users = [],
    stats,
}: PageProps) {
    const [activeTab, setActiveTab] = React.useState<'compliance' | 'greetings' | 'logs'>('compliance');
    const [categoryFilter, setCategoryFilter] = React.useState<string>('all');

    // Greeting Modal state
    const [greetingModalOpen, setGreetingModalOpen] = React.useState(false);
    const [editingGreeting, setEditingGreeting] = React.useState<AutomatedGreeting | null>(null);

    const greetingForm = useForm({
        title: '',
        type: 'festival' as 'birthday' | 'festival',
        event_date: '',
        template_subject: '',
        template_body: '',
        target_type: 'all' as 'all' | 'leads' | 'users',
        status: 'active' as 'active' | 'paused',
        recurring: true,
    });

    // Compliance Modal state
    const [complianceModalOpen, setComplianceModalOpen] = React.useState(false);
    const [editingCompliance, setEditingCompliance] = React.useState<ComplianceReminder | null>(null);

    const complianceForm = useForm({
        title: '',
        category: 'gst' as 'gst' | 'itr' | 'emi' | 'other',
        due_date: '',
        amount: '',
        risk_level: 'high' as 'low' | 'medium' | 'high' | 'critical',
        remind_days_before: 7,
        recurring_frequency: 'monthly' as 'none' | 'monthly' | 'quarterly' | 'yearly',
        notes: '',
        assigned_user_id: '' as string | number,
        status: 'pending' as 'pending' | 'reminded' | 'completed' | 'overdue',
    });

    // Open greeting dialog for creation or editing
    const openGreetingModal = (greeting?: AutomatedGreeting) => {
        if (greeting) {
            setEditingGreeting(greeting);
            greetingForm.setData({
                title: greeting.title,
                type: greeting.type,
                event_date: greeting.event_date ? greeting.event_date.split('T')[0] : '',
                template_subject: greeting.template_subject,
                template_body: greeting.template_body,
                target_type: greeting.target_type,
                status: greeting.status,
                recurring: greeting.recurring,
            });
        } else {
            setEditingGreeting(null);
            greetingForm.reset();
        }
        setGreetingModalOpen(true);
    };

    const handleGreetingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingGreeting) {
            greetingForm.put(`/automated-greetings/${editingGreeting.id}`, {
                onSuccess: () => setGreetingModalOpen(false),
            });
        } else {
            greetingForm.post('/automated-greetings', {
                onSuccess: () => setGreetingModalOpen(false),
            });
        }
    };

    const handleDeleteGreeting = (id: number) => {
        if (confirm('Are you sure you want to delete this greeting template?')) {
            router.delete(`/automated-greetings/${id}`);
        }
    };

    const handleTestGreeting = (id: number) => {
        router.post(`/automated-greetings/${id}/test`);
    };

    // Open compliance dialog for creation or editing
    const openComplianceModal = (item?: ComplianceReminder) => {
        if (item) {
            setEditingCompliance(item);
            complianceForm.setData({
                title: item.title,
                category: item.category,
                due_date: item.due_date ? item.due_date.split('T')[0] : '',
                amount: item.amount ? String(item.amount) : '',
                risk_level: item.risk_level,
                remind_days_before: item.remind_days_before,
                recurring_frequency: item.recurring_frequency,
                notes: item.notes || '',
                assigned_user_id: item.assigned_user_id || '',
                status: item.status,
            });
        } else {
            setEditingCompliance(null);
            complianceForm.reset();
        }
        setComplianceModalOpen(true);
    };

    const handleComplianceSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCompliance) {
            complianceForm.put(`/compliance-reminders/${editingCompliance.id}`, {
                onSuccess: () => setComplianceModalOpen(false),
            });
        } else {
            complianceForm.post('/compliance-reminders', {
                onSuccess: () => setComplianceModalOpen(false),
            });
        }
    };

    const handleMarkCompleted = (id: number) => {
        router.post(`/compliance-reminders/${id}/complete`);
    };

    const handleDeleteCompliance = (id: number) => {
        if (confirm('Are you sure you want to delete this compliance reminder?')) {
            router.delete(`/compliance-reminders/${id}`);
        }
    };

    const filteredReminders = React.useMemo(() => {
        if (categoryFilter === 'all') return complianceReminders;
        return complianceReminders.filter((r) => r.category === categoryFilter);
    }, [complianceReminders, categoryFilter]);

    return (
        <>
            <Head title="Automations & Compliance Management" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Top Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <Sparkles className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                            Automations & Risk Mitigation
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Automate birthday & festival greetings and eliminate financial risks with GST, ITR, and EMI payment alerts.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-950/50"
                            onClick={() => router.post('/automated-greetings/trigger')}
                        >
                            <Play className="h-4 w-4" />
                            Run Greetings Dispatcher
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-950/50"
                            onClick={() => router.post('/compliance-reminders/trigger')}
                        >
                            <BellRing className="h-4 w-4" />
                            Scan Compliance Risks
                        </Button>
                        <Button
                            size="sm"
                            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                            onClick={() => openComplianceModal()}
                        >
                            <Plus className="h-4 w-4" />
                            Add Risk Reminder
                        </Button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-l-4 border-l-rose-500 shadow-xs">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Critical / Overdue Risks
                            </CardTitle>
                            <ShieldAlert className="h-5 w-5 text-rose-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                                {stats?.overdue_compliance || 0}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats?.critical_risk_count || 0} critical priority items
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-amber-500 shadow-xs">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Pending Compliance
                            </CardTitle>
                            <Clock className="h-5 w-5 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {stats?.pending_compliance || 0}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                GST, ITR & EMI payments queued
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-emerald-500 shadow-xs">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Outstanding GST Due
                            </CardTitle>
                            <DollarSign className="h-5 w-5 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                ₹{Number(stats?.total_gst_due || 0).toLocaleString('en-IN')}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Monthly GSTR-1 & 3B obligations
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-indigo-500 shadow-xs">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Active Greetings & Sent
                            </CardTitle>
                            <Gift className="h-5 w-5 text-indigo-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                {stats?.active_greetings || 0}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats?.total_greetings_sent || 0} automated emails sent
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Tabs Navigation */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4">
                    <button
                        onClick={() => setActiveTab('compliance')}
                        className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
                            activeTab === 'compliance'
                                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        <ShieldAlert className="h-4 w-4" />
                        Risk & Compliance Reminders ({complianceReminders.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('greetings')}
                        className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
                            activeTab === 'greetings'
                                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        <Gift className="h-4 w-4" />
                        Automated Greetings ({greetings.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
                            activeTab === 'logs'
                                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        <History className="h-4 w-4" />
                        Execution History & Audit ({logs.length})
                    </button>
                </div>

                {/* TAB 1: COMPLIANCE REMINDERS */}
                {activeTab === 'compliance' && (
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold uppercase text-slate-500">Filter Category:</span>
                                <div className="flex flex-wrap gap-1">
                                    {['all', 'gst', 'itr', 'emi', 'other'].map((cat) => (
                                        <Button
                                            key={cat}
                                            variant={categoryFilter === cat ? 'default' : 'ghost'}
                                            size="sm"
                                            onClick={() => setCategoryFilter(cat)}
                                            className="h-7 text-xs uppercase"
                                        >
                                            {cat}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openComplianceModal()}
                                className="h-8 gap-1"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                Add Compliance Reminder
                            </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredReminders.length === 0 ? (
                                <div className="col-span-full p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-slate-500">
                                    No compliance reminders found for this category.
                                </div>
                            ) : (
                                filteredReminders.map((reminder) => {
                                    const isOverdue = reminder.status === 'overdue';
                                    const isCompleted = reminder.status === 'completed';

                                    return (
                                        <Card
                                            key={reminder.id}
                                            className={`relative overflow-hidden transition-all shadow-xs ${
                                                isOverdue
                                                    ? 'border-rose-300 dark:border-rose-800 bg-rose-50/20 dark:bg-rose-950/10'
                                                    : isCompleted
                                                    ? 'border-slate-200 dark:border-slate-800 opacity-75'
                                                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                                            }`}
                                        >
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <Badge
                                                        className={`uppercase text-[10px] ${
                                                            reminder.category === 'gst'
                                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                                                                : reminder.category === 'itr'
                                                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
                                                                : reminder.category === 'emi'
                                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                                                                : 'bg-slate-100 text-slate-800'
                                                        }`}
                                                    >
                                                        {reminder.category}
                                                    </Badge>

                                                    <Badge
                                                        variant={
                                                            reminder.risk_level === 'critical'
                                                                ? 'destructive'
                                                                : reminder.risk_level === 'high'
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                        className="uppercase text-[10px]"
                                                    >
                                                        {reminder.risk_level} Risk
                                                    </Badge>
                                                </div>

                                                <CardTitle className="text-base font-semibold mt-2 line-clamp-1">
                                                    {reminder.title}
                                                </CardTitle>
                                            </CardHeader>

                                            <CardContent className="space-y-3 text-xs text-slate-600 dark:text-slate-300 pb-4">
                                                <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
                                                    <span className="flex items-center gap-1 text-slate-500">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        Due Date:
                                                    </span>
                                                    <span className={`font-semibold ${isOverdue ? 'text-rose-600 dark:text-rose-400 font-bold' : ''}`}>
                                                        {new Date(reminder.due_date).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </span>
                                                </div>

                                                {reminder.amount && (
                                                    <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
                                                        <span className="text-slate-500">Amount Payable:</span>
                                                        <span className="font-bold text-slate-900 dark:text-slate-100">
                                                            ₹{Number(reminder.amount).toLocaleString('en-IN')}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
                                                    <span className="text-slate-500">Assigned To:</span>
                                                    <span className="font-medium text-slate-700 dark:text-slate-300">
                                                        {reminder.assigned_user?.name || 'Unassigned (Admins)'}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-500">Frequency / Status:</span>
                                                    <Badge
                                                        variant="outline"
                                                        className={`capitalize text-[10px] ${
                                                            isCompleted
                                                                ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                                                                : isOverdue
                                                                ? 'border-rose-500 text-rose-600 bg-rose-50'
                                                                : 'border-amber-500 text-amber-600 bg-amber-50'
                                                        }`}
                                                    >
                                                        {reminder.status} ({reminder.recurring_frequency})
                                                    </Badge>
                                                </div>

                                                {reminder.notes && (
                                                    <p className="mt-2 text-[11px] text-slate-500 line-clamp-2 bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800">
                                                        {reminder.notes}
                                                    </p>
                                                )}

                                                <div className="pt-2 flex items-center justify-end gap-2 border-t dark:border-slate-800">
                                                    {!isCompleted && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-7 text-xs gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                                            onClick={() => handleMarkCompleted(reminder.id)}
                                                        >
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                            Mark Resolved
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 w-7 p-0"
                                                        onClick={() => openComplianceModal(reminder)}
                                                    >
                                                        <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 w-7 p-0 text-rose-500 hover:text-rose-700"
                                                        onClick={() => handleDeleteCompliance(reminder.id)}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 2: AUTOMATED GREETINGS */}
                {activeTab === 'greetings' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    Automated Greeting Campaigns
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Placeholders available: <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-[11px] text-indigo-600">{'{name}'}</code>, <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-[11px] text-indigo-600">{'{first_name}'}</code>
                                </p>
                            </div>
                            <Button size="sm" onClick={() => openGreetingModal()} className="gap-1 bg-indigo-600 hover:bg-indigo-700">
                                <Plus className="h-3.5 w-3.5" />
                                Add Greeting Campaign
                            </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {greetings.length === 0 ? (
                                <div className="col-span-full p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-slate-500">
                                    No automated greeting templates created yet.
                                </div>
                            ) : (
                                greetings.map((greeting) => (
                                    <Card key={greeting.id} className="border-slate-200 dark:border-slate-800 shadow-xs">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <Badge
                                                    className={`capitalize text-[10px] ${
                                                        greeting.type === 'birthday'
                                                            ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300'
                                                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300'
                                                    }`}
                                                >
                                                    {greeting.type} Greeting
                                                </Badge>
                                                <Badge variant={greeting.status === 'active' ? 'default' : 'secondary'} className="text-[10px]">
                                                    {greeting.status}
                                                </Badge>
                                            </div>

                                            <CardTitle className="text-base font-bold mt-2">
                                                {greeting.title}
                                            </CardTitle>
                                            <CardDescription className="text-xs">
                                                Target: <span className="font-semibold capitalize text-slate-700 dark:text-slate-300">{greeting.target_type}</span> | Event Date: {greeting.event_date ? new Date(greeting.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Annual Birth Date'}
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className="space-y-3 text-xs">
                                            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded border border-slate-100 dark:border-slate-800">
                                                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                                                    Subject: {greeting.template_subject}
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap line-clamp-3">
                                                    {greeting.template_body}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                                                <span className="text-[11px] text-slate-400">
                                                    Last Run: {greeting.last_run_at ? new Date(greeting.last_run_at).toLocaleString() : 'Never'}
                                                </span>

                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 text-xs gap-1 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                                        onClick={() => handleTestGreeting(greeting.id)}
                                                    >
                                                        <Send className="h-3 w-3" />
                                                        Send Test Email
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 w-7 p-0"
                                                        onClick={() => openGreetingModal(greeting)}
                                                    >
                                                        <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 w-7 p-0 text-rose-500 hover:text-rose-700"
                                                        onClick={() => handleDeleteGreeting(greeting.id)}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 3: EXECUTION HISTORY & AUDIT LOGS */}
                {activeTab === 'logs' && (
                    <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
                        <CardHeader>
                            <CardTitle className="text-base font-bold">Automation Execution Logs</CardTitle>
                            <CardDescription className="text-xs">
                                Real-time dispatch audit trail of automated greetings and risk notifications.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Type</TableHead>
                                        <TableHead>Campaign / Reminder</TableHead>
                                        <TableHead>Recipient</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead className="w-[100px]">Status</TableHead>
                                        <TableHead className="w-[160px]">Sent At</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-6 text-slate-500">
                                                No automation dispatch logs recorded yet.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        logs.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell>
                                                    <Badge
                                                        className={`uppercase text-[9px] ${
                                                            log.type === 'greeting'
                                                                ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300'
                                                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                                                        }`}
                                                    >
                                                        {log.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                                                    {log.reference_title}
                                                </TableCell>
                                                <TableCell className="text-xs">
                                                    <div className="font-medium text-slate-800 dark:text-slate-200">{log.recipient_name || 'N/A'}</div>
                                                    <div className="text-slate-400 text-[11px]">{log.recipient_email}</div>
                                                </TableCell>
                                                <TableCell className="text-xs text-slate-600 dark:text-slate-400 max-w-[250px] truncate">
                                                    {log.subject}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={log.status === 'sent' ? 'default' : 'destructive'}
                                                        className="text-[9px] uppercase"
                                                    >
                                                        {log.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-xs text-slate-500">
                                                    {new Date(log.sent_at).toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {/* MODAL 1: GREETING MODAL */}
                <Dialog open={greetingModalOpen} onOpenChange={setGreetingModalOpen}>
                    <DialogContent className="sm:max-w-[550px]">
                        <form onSubmit={handleGreetingSubmit}>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingGreeting ? 'Edit Greeting Template' : 'Create Automated Greeting'}
                                </DialogTitle>
                                <DialogDescription>
                                    Set up birthday or festival greeting email campaigns with dynamic placeholder substitution.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4 text-sm">
                                <div className="grid gap-2">
                                    <Label htmlFor="g-title">Campaign Title</Label>
                                    <Input
                                        id="g-title"
                                        value={greetingForm.data.title}
                                        onChange={(e) => greetingForm.setData('title', e.target.value)}
                                        placeholder="e.g. Diwali Festival Wish"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="g-type">Greeting Type</Label>
                                        <Select
                                            value={greetingForm.data.type}
                                            onValueChange={(val: 'birthday' | 'festival') => greetingForm.setData('type', val)}
                                        >
                                            <SelectTrigger id="g-type">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="birthday">Birthday Greeting</SelectItem>
                                                <SelectItem value="festival">Festival Greeting</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="g-date">Event Date (for Festival)</Label>
                                        <Input
                                            id="g-date"
                                            type="date"
                                            value={greetingForm.data.event_date}
                                            onChange={(e) => greetingForm.setData('event_date', e.target.value)}
                                            disabled={greetingForm.data.type === 'birthday'}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="g-target">Target Recipients</Label>
                                        <Select
                                            value={greetingForm.data.target_type}
                                            onValueChange={(val: 'all' | 'leads' | 'users') => greetingForm.setData('target_type', val)}
                                        >
                                            <SelectTrigger id="g-target">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All (Users & Leads)</SelectItem>
                                                <SelectItem value="leads">Leads Only</SelectItem>
                                                <SelectItem value="users">CRM Users Only</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="g-status">Status</Label>
                                        <Select
                                            value={greetingForm.data.status}
                                            onValueChange={(val: 'active' | 'paused') => greetingForm.setData('status', val)}
                                        >
                                            <SelectTrigger id="g-status">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active (Automated)</SelectItem>
                                                <SelectItem value="paused">Paused</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="g-subject">Email Subject</Label>
                                    <Input
                                        id="g-subject"
                                        value={greetingForm.data.template_subject}
                                        onChange={(e) => greetingForm.setData('template_subject', e.target.value)}
                                        placeholder="e.g. 🎉 Happy Birthday {first_name}!"
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="g-body">Email Body Content</Label>
                                    <Textarea
                                        id="g-body"
                                        rows={5}
                                        value={greetingForm.data.template_body}
                                        onChange={(e) => greetingForm.setData('template_body', e.target.value)}
                                        placeholder="Dear {name}, Wishing you..."
                                        required
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setGreetingModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={greetingForm.processing} className="bg-indigo-600 hover:bg-indigo-700">
                                    Save Greeting
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* MODAL 2: COMPLIANCE REMINDER MODAL */}
                <Dialog open={complianceModalOpen} onOpenChange={setComplianceModalOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <form onSubmit={handleComplianceSubmit}>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingCompliance ? 'Edit Risk Compliance Reminder' : 'Create Risk & Compliance Reminder'}
                                </DialogTitle>
                                <DialogDescription>
                                    Set critical alert deadlines for GST returns, Income Tax (ITR), and loan EMI payments to prevent financial penalties.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4 text-sm">
                                <div className="grid gap-2">
                                    <Label htmlFor="c-title">Reminder Title</Label>
                                    <Input
                                        id="c-title"
                                        value={complianceForm.data.title}
                                        onChange={(e) => complianceForm.setData('title', e.target.value)}
                                        placeholder="e.g. GSTR-3B Tax Filing or Lease EMI"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="c-category">Category</Label>
                                        <Select
                                            value={complianceForm.data.category}
                                            onValueChange={(val: 'gst' | 'itr' | 'emi' | 'other') => complianceForm.setData('category', val)}
                                        >
                                            <SelectTrigger id="c-category">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="gst">GST Tax Return</SelectItem>
                                                <SelectItem value="itr">Income Tax (ITR)</SelectItem>
                                                <SelectItem value="emi">Loan / Asset EMI</SelectItem>
                                                <SelectItem value="other">Other Compliance</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="c-risk">Risk Level</Label>
                                        <Select
                                            value={complianceForm.data.risk_level}
                                            onValueChange={(val: 'low' | 'medium' | 'high' | 'critical') => complianceForm.setData('risk_level', val)}
                                        >
                                            <SelectTrigger id="c-risk">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="critical">🚨 Critical Risk</SelectItem>
                                                <SelectItem value="high">⚠️ High Risk</SelectItem>
                                                <SelectItem value="medium">Medium Priority</SelectItem>
                                                <SelectItem value="low">Low Risk</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="c-date">Due Date</Label>
                                        <Input
                                            id="c-date"
                                            type="date"
                                            value={complianceForm.data.due_date}
                                            onChange={(e) => complianceForm.setData('due_date', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="c-amount">Amount Payable (₹)</Label>
                                        <Input
                                            id="c-amount"
                                            type="number"
                                            step="0.01"
                                            value={complianceForm.data.amount}
                                            onChange={(e) => complianceForm.setData('amount', e.target.value)}
                                            placeholder="Optional amount"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="c-days">Alert Days In Advance</Label>
                                        <Input
                                            id="c-days"
                                            type="number"
                                            min={1}
                                            max={90}
                                            value={complianceForm.data.remind_days_before}
                                            onChange={(e) => complianceForm.setData('remind_days_before', Number(e.target.value))}
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="c-freq">Recurrence Frequency</Label>
                                        <Select
                                            value={complianceForm.data.recurring_frequency}
                                            onValueChange={(val: 'none' | 'monthly' | 'quarterly' | 'yearly') => complianceForm.setData('recurring_frequency', val)}
                                        >
                                            <SelectTrigger id="c-freq">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="monthly">Monthly</SelectItem>
                                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                                <SelectItem value="yearly">Yearly</SelectItem>
                                                <SelectItem value="none">One-time Only</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="c-user">Assign Responsible User</Label>
                                    <Select
                                        value={String(complianceForm.data.assigned_user_id)}
                                        onValueChange={(val) => complianceForm.setData('assigned_user_id', val)}
                                    >
                                        <SelectTrigger id="c-user">
                                            <SelectValue placeholder="Select user (Defaults to Admins)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Admins (All System Admins)</SelectItem>
                                            {users.map((u) => (
                                                <SelectItem key={u.id} value={String(u.id)}>
                                                    {u.name} ({u.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="c-notes">Notes / Instructions</Label>
                                    <Textarea
                                        id="c-notes"
                                        rows={3}
                                        value={complianceForm.data.notes}
                                        onChange={(e) => complianceForm.setData('notes', e.target.value)}
                                        placeholder="Add payment portal links, bank account details, or filing instructions..."
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setComplianceModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={complianceForm.processing} className="bg-indigo-600 hover:bg-indigo-700">
                                    Save Compliance Reminder
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
