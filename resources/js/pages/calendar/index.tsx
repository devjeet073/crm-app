import { Head, router } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CalendarController from '@/actions/App/Http/Controllers/CalendarController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const scopeBadgeVariant: Record<
    CalendarScope,
    'default' | 'secondary' | 'outline'
> = {
    Meeting: 'default',
    Call: 'secondary',
    Task: 'outline',
};

function formatTime(iso: string | null): string | null {
    if (!iso) {
        return null;
    }

    return format(parseISO(iso), 'h:mm a');
}

function eventDayKey(event: CalendarEvent): string | null {
    const raw = event.dateStart ?? event.dateStartDate;

    return raw ? raw.slice(0, 10) : null;
}

function groupEventsByDay(events: CalendarEvent[]) {
    const groups = new Map<string, CalendarEvent[]>();

    for (const event of events) {
        const key = eventDayKey(event);

        if (!key) {
            continue;
        }

        groups.set(key, [...(groups.get(key) ?? []), event]);
    }

    return Array.from(groups.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([dateKey, dayEvents]) => ({
            dateKey,
            label: format(parseISO(dateKey), 'EEEE, d MMMM'),
            events: dayEvents,
        }));
}

function navigate(from: string, to: string, offsetDays: number) {
    const shift = (iso: string) => {
        const date = new Date(iso);
        date.setDate(date.getDate() + offsetDays);

        return date.toISOString();
    };

    router.get(
        CalendarController.index.url(),
        offsetDays === 0 ? {} : { from: shift(from), to: shift(to) },
        { preserveScroll: true },
    );
}

export default function CalendarIndex({ events, from, to }: PageProps) {
    const days = groupEventsByDay(events);
    const rangeLabel = `${format(parseISO(from), 'MMMM d')} – ${format(parseISO(to), 'MMMM d, yyyy')}`;

    return (
        <>
            <Head title="Calendar" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading title="Calendar" description={rangeLabel} />

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(from, to, -7)}
                            aria-label="Previous week"
                        >
                            <ChevronLeft />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate(from, to, 0)}
                        >
                            Today
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(from, to, 7)}
                            aria-label="Next week"
                        >
                            <ChevronRight />
                        </Button>
                    </div>
                </div>

                {days.length === 0 && (
                    <Card>
                        <CardContent className="text-sm text-muted-foreground">
                            No meetings, calls, or tasks in this range.
                        </CardContent>
                    </Card>
                )}

                <div className="flex flex-col gap-4">
                    {days.map((day) => (
                        <Card key={day.dateKey}>
                            <CardHeader>
                                <CardTitle>{day.label}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                {day.events.map((event) => (
                                    <div
                                        key={`${event.scope}-${event.id}`}
                                        className="flex items-center justify-between gap-4 rounded-lg border p-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Badge
                                                variant={
                                                    scopeBadgeVariant[
                                                        event.scope
                                                    ]
                                                }
                                            >
                                                {event.scope}
                                            </Badge>
                                            <div>
                                                <p className="font-medium">
                                                    {event.name ?? 'Untitled'}
                                                </p>
                                                {(formatTime(event.dateStart) ||
                                                    formatTime(
                                                        event.dateEnd,
                                                    )) && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatTime(
                                                            event.dateStart,
                                                        )}
                                                        {formatTime(
                                                            event.dateEnd,
                                                        )
                                                            ? ` – ${formatTime(event.dateEnd)}`
                                                            : ''}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {event.status && (
                                            <Badge variant="outline">
                                                {event.status}
                                            </Badge>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}

CalendarIndex.layout = { breadcrumbs };
