import { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import type { EventClickArg, DatesSetArg } from '@fullcalendar/core';
import { format, parseISO } from 'date-fns';
import { Phone, Users, CheckSquare, Calendar as CalendarIcon, Clock, Tag } from 'lucide-react';
import CalendarController from '@/actions/App/Http/Controllers/CalendarController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { BreadcrumbItem } from '@/types';

type CalendarScope = 'Meeting' | 'Call' | 'Task';

type CalendarEvent = {
    scope: CalendarScope;
    id: number;
    name: string | null;
    dateStart: string | null;
    dateEnd: string | null;
    status: string | null;
    dateStartDate: string | null;
    dateEndDate: string | null;
    parentType: string | null;
    parentId: number | null;
};

type PageProps = {
    events: CalendarEvent[];
    from: string;
    to: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Calendar', href: CalendarController.index() },
];

const SCOPE_CONFIG: Record<
    CalendarScope,
    { label: string; bg: string; border: string; text: string; icon: typeof Users }
> = {
    Meeting: {
        label: 'Meeting',
        bg: '#2563eb',
        border: '#1d4ed8',
        text: '#ffffff',
        icon: Users,
    },
    Call: {
        label: 'Call',
        bg: '#7c3aed',
        border: '#6d28d9',
        text: '#ffffff',
        icon: Phone,
    },
    Task: {
        label: 'Task',
        bg: '#d97706',
        border: '#b45309',
        text: '#ffffff',
        icon: CheckSquare,
    },
};

function formatEventTime(iso: string | null): string | null {
    if (!iso) return null;
    try {
        return format(parseISO(iso), 'PPP h:mm a');
    } catch {
        return iso;
    }
}

export default function CalendarIndex({ events, from, to }: PageProps) {
    const [selectedScopes, setSelectedScopes] = useState<CalendarScope[]>(['Meeting', 'Call', 'Task']);
    const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);

    const toggleScope = (scope: CalendarScope) => {
        setSelectedScopes((prev) =>
            prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
        );
    };

    const formattedFullCalendarEvents = useMemo(() => {
        return events
            .filter((evt) => selectedScopes.includes(evt.scope))
            .map((evt) => {
                const config = SCOPE_CONFIG[evt.scope];
                const start = evt.dateStart ?? evt.dateStartDate ?? undefined;
                const end = evt.dateEnd ?? evt.dateEndDate ?? undefined;
                const isAllDay = Boolean(!evt.dateStart && evt.dateStartDate);

                return {
                    id: `${evt.scope}-${evt.id}`,
                    title: evt.name ?? 'Untitled',
                    start,
                    end,
                    allDay: isAllDay,
                    backgroundColor: config.bg,
                    borderColor: config.border,
                    textColor: config.text,
                    extendedProps: {
                        rawEvent: evt,
                    },
                };
            });
    }, [events, selectedScopes]);

    const handleEventClick = (info: EventClickArg) => {
        const raw = info.event.extendedProps.rawEvent as CalendarEvent;
        if (raw) {
            setActiveEvent(raw);
        }
    };

    const handleDatesSet = (arg: DatesSetArg) => {
        const newFrom = arg.start.toISOString();
        const newTo = arg.end.toISOString();

        // Avoid infinite loop if dates match current props
        if (newFrom.slice(0, 10) === from.slice(0, 10) && newTo.slice(0, 10) === to.slice(0, 10)) {
            return;
        }

        router.get(
            CalendarController.index.url(),
            { from: newFrom, to: newTo },
            { preserveScroll: true, preserveState: true },
        );
    };

    return (
        <>
            <Head title="Calendar & Meetings" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title="Calendar & Meetings"
                        description="Schedule and track meetings, calls, and tasks with interactive calendar view."
                    />

                    {/* Scope Filters */}
                    <div className="flex items-center gap-2">
                        {(['Meeting', 'Call', 'Task'] as CalendarScope[]).map((scope) => {
                            const config = SCOPE_CONFIG[scope];
                            const Icon = config.icon;
                            const isActive = selectedScopes.includes(scope);

                            return (
                                <Button
                                    key={scope}
                                    type="button"
                                    variant={isActive ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => toggleScope(scope)}
                                    className="flex items-center gap-1.5 transition-all"
                                    style={
                                        isActive
                                            ? { backgroundColor: config.bg, borderColor: config.border }
                                            : {}
                                    }
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{config.label}s</span>
                                </Button>
                            );
                        })}
                    </div>
                </div>

                <Card className="p-4 shadow-sm border rounded-xl overflow-hidden">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
                        }}
                        events={formattedFullCalendarEvents}
                        eventClick={handleEventClick}
                        datesSet={handleDatesSet}
                        editable={false}
                        selectable={true}
                        height="auto"
                        dayMaxEvents={4}
                        aspectRatio={1.8}
                    />
                </Card>
            </div>

            {/* Event Details Dialog */}
            <Dialog open={Boolean(activeEvent)} onOpenChange={(open) => !open && setActiveEvent(null)}>
                {activeEvent && (
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <div className="flex items-center gap-2 mb-1">
                                <Badge
                                    style={{
                                        backgroundColor: SCOPE_CONFIG[activeEvent.scope].bg,
                                        color: '#fff',
                                    }}
                                >
                                    {activeEvent.scope}
                                </Badge>
                                {activeEvent.status && (
                                    <Badge variant="outline">{activeEvent.status}</Badge>
                                )}
                            </div>
                            <DialogTitle className="text-xl font-bold">
                                {activeEvent.name ?? 'Untitled Event'}
                            </DialogTitle>
                            <DialogDescription>
                                Detailed schedule information for this CRM entry.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-3 text-sm">
                            <div className="flex items-start gap-3 text-muted-foreground">
                                <Clock className="h-4 w-4 mt-0.5 text-primary" />
                                <div>
                                    <p className="font-medium text-foreground">Start Time</p>
                                    <p>{formatEventTime(activeEvent.dateStart ?? activeEvent.dateStartDate)}</p>
                                </div>
                            </div>

                            {(activeEvent.dateEnd || activeEvent.dateEndDate) && (
                                <div className="flex items-start gap-3 text-muted-foreground">
                                    <CalendarIcon className="h-4 w-4 mt-0.5 text-primary" />
                                    <div>
                                        <p className="font-medium text-foreground">End Time</p>
                                        <p>{formatEventTime(activeEvent.dateEnd ?? activeEvent.dateEndDate)}</p>
                                    </div>
                                </div>
                            )}

                            {activeEvent.parentType && (
                                <div className="flex items-start gap-3 text-muted-foreground">
                                    <Tag className="h-4 w-4 mt-0.5 text-primary" />
                                    <div>
                                        <p className="font-medium text-foreground">Related Model</p>
                                        <p>
                                            {activeEvent.parentType}{' '}
                                            {activeEvent.parentId ? `#${activeEvent.parentId}` : ''}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </>
    );
}

CalendarIndex.layout = { breadcrumbs };
