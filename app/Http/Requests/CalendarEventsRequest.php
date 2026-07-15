<?php

namespace App\Http\Requests;

use Carbon\CarbonImmutable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class CalendarEventsRequest extends FormRequest
{
    /**
     * Matches EspoCRM's Calendar\Api\GetCalendar::MAX_CALENDAR_RANGE.
     */
    private const MAX_RANGE_DAYS = 123;

    /**
     * Default to the current week when no range is given, so visiting
     * the calendar page directly (with no query string) still works.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'from' => $this->input('from') ?? now()->startOfWeek()->toDateTimeString(),
            'to' => $this->input('to') ?? now()->endOfWeek()->toDateTimeString(),
        ]);
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'from' => ['required', 'date'],
            'to' => ['required', 'date', 'after_or_equal:from'],
            'scopes' => ['sometimes', 'array'],
            'scopes.*' => ['string', 'in:Meeting,Call,Task'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if ($validator->errors()->has('from') || $validator->errors()->has('to')) {
                return;
            }

            $days = CarbonImmutable::parse($this->input('from'))
                ->diffInDays(CarbonImmutable::parse($this->input('to')));

            if ($days > self::MAX_RANGE_DAYS) {
                $validator->errors()->add('to', 'The date range must not exceed '.self::MAX_RANGE_DAYS.' days.');
            }
        });
    }

    public function fromDate(): CarbonImmutable
    {
        return CarbonImmutable::parse($this->validated('from'));
    }

    public function toDate(): CarbonImmutable
    {
        return CarbonImmutable::parse($this->validated('to'));
    }

    /**
     * @return array<int, string>
     */
    public function scopes(): array
    {
        return $this->validated('scopes') ?? ['Meeting', 'Call', 'Task'];
    }
}
