import { Loader2, Check, ChevronDown, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

import { getInitials } from '@/lib/utils';
export type Option = {
    value: string;
    label: string;
    avatar_url?: string | null;
    avatar_color?: string | null;
};

type ResourceSelectProps = {
    value: string;
    onChange: (value: string) => void;
    searchUrl: string;
    placeholder?: string;
    id?: string;
    initialItem?: Option | null;
    responseKey?: string;
    mapItem?: (item: any) => Option;
};

export default function ResourceSelect({
    value,
    onChange,
    searchUrl,
    placeholder = 'Search...',
    id,
    initialItem = null,
    responseKey = 'data',
    mapItem = (item) => ({ value: String(item.id), label: item.name }),
}: ResourceSelectProps) {
    const [items, setItems] = useState<Option[]>([]);
    const [selectedItem, setSelectedItem] = useState<Option | null>(
        initialItem,
    );
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const pageRef = useRef(1);
    const loadingRef = useRef(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchItems = useCallback(
        async (page: number, searchTerm: string, append: boolean) => {
            if (loadingRef.current) {
                return;
            }

            loadingRef.current = true;
            setLoading(true);

            try {
                const params = new URLSearchParams({ page: String(page) });

                if (searchTerm) {
                    params.set('search', searchTerm);
                }

                const response = await fetch(
                    `${searchUrl}?${params.toString()}`,
                );
                const data = await response.json();

                const rawList = responseKey ? data[responseKey] : data;
                const newItems: Option[] = (rawList || []).map(mapItem);

                setItems((prev) =>
                    append ? [...prev, ...newItems] : newItems,
                );
                setHasMore(!!data.hasMore);
            } catch {
                // silently fail
            } finally {
                setLoading(false);
                loadingRef.current = false;
            }
        },
        [searchUrl, responseKey, mapItem],
    );

    useEffect(() => {
        if (isOpen) {
            pageRef.current = 1;
            fetchItems(1, inputValue, false);
            setHighlightedIndex(-1);
        }
    }, [isOpen, fetchItems]);

    // Handle initial item / value sync
    useEffect(() => {
        if (!value) {
            setSelectedItem(null);
            setInputValue('');

            return;
        }

        if (selectedItem && selectedItem.value === value) {
            return;
        }

        if (initialItem && initialItem.value === value) {
            setSelectedItem(initialItem);

            return;
        }

        const found = items.find((item) => item.value === value);

        if (found) {
            setSelectedItem(found);

            return;
        }

        // Fetch single item from backend if not found
        let active = true;
        async function fetchSingle() {
            try {
                const params = new URLSearchParams({ id: value });
                const response = await fetch(
                    `${searchUrl}?${params.toString()}`,
                );
                const data = await response.json();
                const rawList = responseKey ? data[responseKey] : data;

                if (Array.isArray(rawList) && rawList.length > 0 && active) {
                    const mapped = mapItem(rawList[0]);
                    setSelectedItem(mapped);
                }
            } catch {
                // silently fail
            }
        }
        fetchSingle();

        return () => {
            active = false;
        };
    }, [value, initialItem, searchUrl, responseKey, mapItem]);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value;
        setInputValue(val);
        pageRef.current = 1;

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            fetchItems(1, val, false);
        }, 250);
    }

    function handleSelect(item: Option) {
        setSelectedItem(item);
        setInputValue('');
        onChange(item.value);
        setIsOpen(false);
        inputRef.current?.blur();
    }

    function handleClear() {
        setSelectedItem(null);
        setInputValue('');
        onChange('');
        inputRef.current?.focus();
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (!isOpen) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
                e.preventDefault();
                setIsOpen(true);
            }

            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex((prev) =>
                prev < items.length - 1 ? prev + 1 : prev,
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        } else if (e.key === 'Enter' && highlightedIndex >= 0) {
            e.preventDefault();
            handleSelect(items[highlightedIndex]);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            inputRef.current?.blur();
        }
    }

    function handleListScroll() {
        const el = listRef.current;

        if (!el || loading || !hasMore) {
            return;
        }

        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
            pageRef.current += 1;
            fetchItems(pageRef.current, inputValue, true);
        }
    }

    return (
        <div className="relative">
            <div className="relative flex items-center">
                <input
                    ref={inputRef}
                    id={id}
                    type="text"
                    value={isOpen ? inputValue : (selectedItem?.label ?? '')}
                    placeholder={selectedItem ? '' : placeholder}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-8 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => {
                        setTimeout(() => setIsOpen(false), 150);
                    }}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                />
                {selectedItem && !isOpen && (
                    <button
                        type="button"
                        className="absolute right-7 flex items-center justify-center text-muted-foreground hover:text-foreground"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            handleClear();
                        }}
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
                <button
                    type="button"
                    className="absolute right-0 flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground"
                    onMouseDown={(e) => {
                        e.preventDefault();

                        if (isOpen) {
                            setIsOpen(false);
                        } else {
                            setIsOpen(true);
                            inputRef.current?.focus();
                        }
                    }}
                >
                    <ChevronDown className="h-4 w-4" />
                </button>
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                    <div
                        ref={listRef}
                        className="max-h-60 overflow-y-auto p-1"
                        onScroll={handleListScroll}
                    >
                        {items.length === 0 && !loading && (
                            <div className="px-3 py-2 text-center text-sm text-muted-foreground">
                                No options found.
                            </div>
                        )}
                        {items.map((item, index) => (
                            <button
                                key={item.value}
                                type="button"
                                className={cn(
                                    'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-none select-none',
                                    highlightedIndex === index
                                        ? 'bg-accent text-accent-foreground'
                                        : 'hover:bg-accent hover:text-accent-foreground',
                                )}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelect(item);
                                }}
                                onMouseEnter={() => setHighlightedIndex(index)}
                            >
                                <Check
                                    className={cn(
                                        'h-4 w-4 shrink-0',
                                        selectedItem?.value === item.value
                                            ? 'opacity-100'
                                            : 'opacity-0',
                                    )}
                                />
                                {item.avatar_color && (
                                    <div
                                        className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full text-[10px] font-medium text-white"
                                        style={{
                                            backgroundColor: item.avatar_color,
                                        }}
                                    >
                                        {item.avatar_url ? (
                                            <img
                                                src={item.avatar_url}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            getInitials(item.label)
                                        )}
                                    </div>
                                )}
                                {item.label}
                            </button>
                        ))}
                    </div>
                    {loading && (
                        <div className="flex items-center justify-center border-t px-3 py-2 text-xs text-muted-foreground">
                            <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                            Loading…
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
