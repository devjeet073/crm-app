<?php

namespace App\Http\Controllers;

use App\Http\Requests\CalendarEventsRequest;
use App\Models\Call;
use App\Models\Meeting;
use App\Models\Task;
use App\Models\User;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class CalendarController extends Controller
{
    /**
     * Show the current user's Meetings, Calls, and Tasks within a date range.
     *
     * Ported from EspoCRM's Crm\Tools\Calendar\Service::fetch() /
     * getCalendarMeetingQuery() / getCalendarCallQuery() / getCalendarTaskQuery(),
     * scoped down to the current user (no ACL, Teams, or working-time ranges).
     */
    public function index(CalendarEventsRequest $request): Response
    {
        $user = $request->user();
        $from = $request->fromDate();
        $to = $request->toDate();
        $scopes = $request->scopes();

        $events = collect()
            ->when(in_array('Meeting', $scopes), fn (Collection $events) => $events->merge($this->meetingEvents($user, $from, $to)))
            ->when(in_array('Call', $scopes), fn (Collection $events) => $events->merge($this->callEvents($user, $from, $to)))
            ->when(in_array('Task', $scopes), fn (Collection $events) => $events->merge($this->taskEvents($user, $from, $to)))
            ->sortBy(fn (array $event) => $event['dateStart'] ?? $event['dateStartDate'])
            ->values();

        return Inertia::render('calendar/index', [
            'events' => $events,
            'from' => $from->toISOString(),
            'to' => $to->toISOString(),
        ]);
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    private function meetingEvents(User $user, CarbonImmutable $from, CarbonImmutable $to): Collection
    {
        return $user->meetings()
            ->wherePivot('status', '!=', 'Declined')
            ->where($this->overlapsRange($from, $to))
            ->get()
            ->map(fn (Meeting $meeting) => $this->toEvent('Meeting', $meeting));
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    private function callEvents(User $user, CarbonImmutable $from, CarbonImmutable $to): Collection
    {
        return $user->calls()
            ->wherePivot('status', '!=', 'Declined')
            ->where($this->overlapsRange($from, $to))
            ->get()
            ->map(fn (Call $call) => $this->toEvent('Call', $call));
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    private function taskEvents(User $user, CarbonImmutable $from, CarbonImmutable $to): Collection
    {
        return Task::query()
            ->where('assigned_user_id', $user->id)
            ->where(function (Builder $query) use ($from, $to) {
                $query
                    ->where(fn (Builder $q) => $q->whereNull('date_end')
                        ->where('date_start', '>=', $from)
                        ->where('date_start', '<', $to))
                    ->orWhere(fn (Builder $q) => $q->where('date_end', '>=', $from)->where('date_end', '<', $to))
                    ->orWhere(fn (Builder $q) => $q->whereNotNull('date_end_date')
                        ->where('date_end_date', '>=', $from)
                        ->where('date_end_date', '<', $to));
            })
            ->get()
            ->map(fn (Task $task) => $this->toEvent('Task', $task));
    }

    /**
     * The overlap test shared by Meeting and Call: starts in range, ends in
     * range, or spans across the whole range.
     */
    private function overlapsRange(CarbonImmutable $from, CarbonImmutable $to): Closure
    {
        return function (Builder $query) use ($from, $to) {
            $query
                ->where(fn (Builder $q) => $q->where('date_start', '>=', $from)->where('date_start', '<', $to))
                ->orWhere(fn (Builder $q) => $q->where('date_end', '>=', $from)->where('date_end', '<', $to))
                ->orWhere(fn (Builder $q) => $q->where('date_start', '<=', $from)->where('date_end', '>=', $to));
        };
    }

    /**
     * Normalize a Meeting, Call, or Task into a common calendar event shape.
     *
     * @return array<string, mixed>
     */
    private function toEvent(string $scope, Meeting|Call|Task $model): array
    {
        return [
            'scope' => $scope,
            'id' => $model->id,
            'name' => $model->name,
            'dateStart' => $model->date_start?->toISOString(),
            'dateEnd' => $model->date_end?->toISOString(),
            'status' => $model->status,
            'dateStartDate' => $model->date_start_date?->toDateString(),
            'dateEndDate' => $model->date_end_date?->toDateString(),
            'parentType' => $model->parent_type,
            'parentId' => $model->parent_id,
        ];
    }
}
