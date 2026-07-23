import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type BreadcrumbItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
};

export type NavItem = {
    title: string;
    href?: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | string | null;
    isActive?: boolean;
    badge?: string | number;
    permission?: string;
    adminOnly?: boolean;
    items?: NavItem[];
};

export type NavGroup = {
    title: string;
    adminOnly?: boolean;
    items: NavItem[];
};
