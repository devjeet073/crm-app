import { router } from '@inertiajs/react';
import { useCallback, useState, useEffect } from 'react';

type Filters = Record<string, any>;

interface UseFiltersProps {
    initialFilters: Filters;
    url: string;
}

export function useFilters({ initialFilters, url }: UseFiltersProps) {
    const [filters, setFilters] = useState<Filters>(initialFilters);

    // Sync state with URL changes (when user navigates back/forward or server redirects)
    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    const applyFilters = useCallback(
        (newFilters: Filters) => {
            const nextFilters = { ...filters, ...newFilters };
            setFilters(nextFilters);

            // Clean up empty filters
            const cleanFilters: Record<string, any> = {};

            for (const [key, value] of Object.entries(nextFilters)) {
                if (
                    value !== null &&
                    value !== '' &&
                    (Array.isArray(value) ? value.length > 0 : true)
                ) {
                    cleanFilters[key] = value;
                }
            }

            router.get(url, cleanFilters, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        },
        [filters, url],
    );

    const updateFilter = useCallback(
        (key: string, value: any) => {
            applyFilters({ [key]: value });
        },
        [applyFilters],
    );

    const removeFilter = useCallback(
        (key: string, valueToRemove?: any) => {
            if (valueToRemove !== undefined && Array.isArray(filters[key])) {
                const nextValue = filters[key].filter(
                    (v: any) => v !== valueToRemove,
                );
                applyFilters({ [key]: nextValue.length ? nextValue : null });
            } else {
                applyFilters({ [key]: null });
            }
        },
        [filters, applyFilters],
    );

    const clearAllFilters = useCallback(() => {
        const cleared: Filters = {};

        for (const key of Object.keys(filters)) {
            cleared[key] = null;
        }

        applyFilters(cleared);
    }, [filters, applyFilters]);

    return {
        filters,
        updateFilter,
        removeFilter,
        clearAllFilters,
        applyFilters,
    };
}
