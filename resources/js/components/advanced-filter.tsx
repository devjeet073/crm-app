import { Search, MoreVertical, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export interface FilterField {
    name: string;
    label: string;
    type: 'text' | 'select' | 'date';
    options?: { label: string; value: string }[];
}

interface AdvancedFilterProps {
    availableFields: FilterField[];
    onApply: (filters: any) => void;
}

export function AdvancedFilter({
    availableFields,
    onApply,
}: AdvancedFilterProps) {
    const [search, setSearch] = useState('');
    const [activeFilters, setActiveFilters] = useState<
        { field: string; condition: string; value: any }[]
    >([]);

    const addField = (fieldName: string) => {
        if (!activeFilters.find((f) => f.field === fieldName)) {
            setActiveFilters([
                ...activeFilters,
                { field: fieldName, condition: 'is', value: '' },
            ]);
        }
    };

    const removeField = (fieldName: string) => {
        setActiveFilters(activeFilters.filter((f) => f.field !== fieldName));
    };

    const updateFilter = (
        index: number,
        key: 'condition' | 'value',
        value: any,
    ) => {
        const newFilters = [...activeFilters];
        newFilters[index][key] = value;
        setActiveFilters(newFilters);
    };

    const handleApply = () => {
        const payload: any = { search };
        activeFilters.forEach((f) => {
            if (f.value) {
                payload[f.field] = { condition: f.condition, value: f.value };
            }
        });
        onApply(payload);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="relative flex max-w-2xl flex-1 items-center">
                    <Select defaultValue="all">
                        <SelectTrigger className="w-[100px] rounded-r-none border-r-0 focus:ring-0 focus:ring-offset-0">
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        className="rounded-l-none rounded-r-none border-l-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button
                        variant="outline"
                        className="rounded-l-none border-l-0 px-3"
                        onClick={handleApply}
                    >
                        <Search className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            Add Field
                        </div>
                        {availableFields.map((field) => (
                            <DropdownMenuItem
                                key={field.name}
                                onSelect={() => addField(field.name)}
                            >
                                {field.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {activeFilters.length > 0 && (
                <div className="space-y-4 rounded-md border bg-muted/30 p-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {activeFilters.map((filter, index) => {
                            const fieldDef = availableFields.find(
                                (f) => f.name === filter.field,
                            );

                            if (!fieldDef) {
                                return null;
                            }

                            return (
                                <div key={filter.field} className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            {fieldDef.label}
                                        </label>
                                        <button
                                            onClick={() =>
                                                removeField(filter.field)
                                            }
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <Select
                                            value={filter.condition}
                                            onValueChange={(val) =>
                                                updateFilter(
                                                    index,
                                                    'condition',
                                                    val,
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-8 bg-background text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="is">
                                                    Is
                                                </SelectItem>
                                                <SelectItem value="is_not">
                                                    Is Not
                                                </SelectItem>
                                                {fieldDef.type === 'text' && (
                                                    <>
                                                        <SelectItem value="contains">
                                                            Contains
                                                        </SelectItem>
                                                        <SelectItem value="starts_with">
                                                            Starts With
                                                        </SelectItem>
                                                    </>
                                                )}
                                                {fieldDef.type === 'select' && (
                                                    <SelectItem value="any_of">
                                                        Any Of
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>

                                        {fieldDef.type === 'select' ? (
                                            <Select
                                                value={filter.value}
                                                onValueChange={(val) =>
                                                    updateFilter(
                                                        index,
                                                        'value',
                                                        val,
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="h-8 bg-background text-xs">
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {fieldDef.options?.map(
                                                        (opt) => (
                                                            <SelectItem
                                                                key={opt.value}
                                                                value={
                                                                    opt.value
                                                                }
                                                            >
                                                                {opt.label}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <Input
                                                className="h-8 bg-background text-xs"
                                                placeholder="Value"
                                                value={filter.value}
                                                onChange={(e) =>
                                                    updateFilter(
                                                        index,
                                                        'value',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div>
                        <Button size="sm" onClick={handleApply}>
                            <Search className="mr-1 h-3.5 w-3.5" /> Apply
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
