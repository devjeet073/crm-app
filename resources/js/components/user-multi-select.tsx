import { Search, X, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface User {
    id: number;
    name: string;
    email: string;
    avatar_url?: string | null;
    avatar_color?: string | null;
}
import { getInitials } from '@/lib/utils';

interface UserMultiSelectProps {
    selectedUsers: User[];
    onChange: (users: User[]) => void;
}

export function UserMultiSelect({
    selectedUsers,
    onChange,
}: UserMultiSelectProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!searchTerm) {
            setResults([]);

            return;
        }

        const timer = setTimeout(() => {
            setIsSearching(true);
            // Fetch users based on search term
            fetch(`/users/search?search=${encodeURIComponent(searchTerm)}`)
                .then((res) => res.json())
                .then((data) => {
                    setResults(data.users || []);
                })
                .finally(() => setIsSearching(false));
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleSelect = (user: User) => {
        if (!selectedUsers.find((u) => u.id === user.id)) {
            onChange([...selectedUsers, user]);
        }

        setSearchTerm('');
        setIsOpen(false);
    };

    const handleRemove = (userId: number) => {
        onChange(selectedUsers.filter((u) => u.id !== userId));
    };

    return (
        <div className="flex w-full flex-col gap-2" ref={wrapperRef}>
            <div className="relative">
                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className="pl-9"
                />
                {isSearching && (
                    <Loader2 className="absolute top-2.5 right-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                )}
                {isOpen && searchTerm && results.length > 0 && (
                    <div className="absolute top-full left-0 z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md">
                        {results.map((user) => (
                            <button
                                key={user.id}
                                type="button"
                                className="flex w-full flex-col items-start px-4 py-2 text-left hover:bg-muted/50"
                                onClick={() => handleSelect(user)}
                            >
                                <div className="flex items-center gap-3 w-full">
                                    {user.avatar_color && (
                                        <div
                                            className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-[12px] font-medium text-white"
                                            style={{ backgroundColor: user.avatar_color }}
                                        >
                                            {user.avatar_url ? (
                                                <img
                                                    src={user.avatar_url}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                getInitials(user.name)
                                            )}
                                        </div>
                                    )}
                                    <div className="flex flex-col items-start">
                                        <span className="text-sm font-medium">
                                            {user.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {user.email}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
                {isOpen &&
                    searchTerm &&
                    !isSearching &&
                    results.length === 0 && (
                        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border bg-popover px-4 py-3 text-sm text-muted-foreground shadow-md">
                            No users found.
                        </div>
                    )}
            </div>

            {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((user) => (
                        <Badge
                            key={user.id}
                            variant="secondary"
                            className="flex items-center gap-1 px-2 py-1"
                        >
                            {user.avatar_color && (
                                <div
                                    className="flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-full text-[8px] font-medium text-white"
                                    style={{ backgroundColor: user.avatar_color }}
                                >
                                    {user.avatar_url ? (
                                        <img
                                            src={user.avatar_url}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        getInitials(user.name)
                                    )}
                                </div>
                            )}
                            <span>{user.name}</span>
                            <button
                                type="button"
                                onClick={() => handleRemove(user.id)}
                                className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                                <X className="h-3 w-3" />
                                <span className="sr-only">
                                    Remove {user.name}
                                </span>
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}
