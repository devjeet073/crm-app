import { Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

interface FilterOption {
    label: string;
    value: string;
}

interface FilterGroupProps {
    title: string;
    options: FilterOption[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
}

export function FilterGroup({
    title,
    options,
    selectedValues,
    onChange,
}: FilterGroupProps) {
    const handleToggle = (value: string) => {
        const next = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value];
        onChange(next);
    };

    return (
        <div className="space-y-3">
            <h4 className="text-sm leading-none font-medium">{title}</h4>
            <div className="space-y-2">
                {options.map((option) => (
                    <div
                        key={option.value}
                        className="flex items-center space-x-2"
                    >
                        <Checkbox
                            id={`${title}-${option.value}`}
                            checked={selectedValues.includes(option.value)}
                            onCheckedChange={() => handleToggle(option.value)}
                        />
                        <Label
                            htmlFor={`${title}-${option.value}`}
                            className="text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {option.label}
                        </Label>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface FilterPanelProps {
    filters: Record<string, any>;
    updateFilter: (key: string, value: any) => void;
    clearAllFilters: () => void;
    filterOptions?: Record<string, FilterOption[]>;
}

export function FilterPanel({
    filters,
    updateFilter,
    clearAllFilters,
    filterOptions,
}: FilterPanelProps) {
    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                {Object.values(filters).some(
                    (v) =>
                        v !== null &&
                        v !== '' &&
                        (Array.isArray(v) ? v.length > 0 : true),
                ) && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                        Clear All
                    </Button>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                    <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="search"
                        type="search"
                        placeholder="Search..."
                        className="pl-8"
                        value={filters.search || ''}
                        onChange={(e) => updateFilter('search', e.target.value)}
                    />
                </div>
            </div>

            {filterOptions?.types && (
                <FilterGroup
                    title="Type"
                    options={filterOptions.types}
                    selectedValues={filters.type || []}
                    onChange={(val) => updateFilter('type', val)}
                />
            )}

            {/* Add more filter groups here dynamically based on filterOptions */}
        </div>
    );
}

export function ActiveFilters({
    filters,
    removeFilter,
}: {
    filters: Record<string, any>;
    removeFilter: (k: string, v?: any) => void;
}) {
    const activeTags: { key: string; value: any; label: string }[] = [];

    Object.entries(filters).forEach(([key, value]) => {
        if (!value) {
            return;
        }

        if (key === 'search' && typeof value === 'string' && value.length > 0) {
            activeTags.push({ key, value, label: `Search: ${value}` });
        } else if (Array.isArray(value)) {
            value.forEach((v) => {
                activeTags.push({ key, value: v, label: `${key}: ${v}` });
            });
        } else if (key !== 'search') {
            activeTags.push({ key, value, label: `${key}: ${value}` });
        }
    });

    if (activeTags.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-2 pb-4">
            <span className="text-sm text-muted-foreground">
                Active filters:
            </span>
            {activeTags.map((tag) => (
                <Badge
                    key={`${tag.key}-${tag.value}`}
                    variant="secondary"
                    className="gap-1"
                >
                    {tag.label}
                    <button
                        type="button"
                        className="ml-1 rounded-full ring-offset-background outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onClick={() => removeFilter(tag.key, tag.value)}
                    >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                    </button>
                </Badge>
            ))}
        </div>
    );
}
