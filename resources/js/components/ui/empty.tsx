import { cn } from '@/lib/utils';

function Empty({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="empty"
            className={cn('flex flex-col items-center justify-center gap-4 py-16 text-center', className)}
            {...props}
        />
    );
}

function EmptyHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="empty-header" className={cn('space-y-1', className)} {...props} />;
}

function EmptyTitle({ className, ...props }: React.ComponentProps<'h3'>) {
    return (
        <h3
            data-slot="empty-title"
            className={cn('text-xl font-semibold tracking-tight', className)}
            {...props}
        />
    );
}

function EmptyDescription({ className, ...props }: React.ComponentProps<'p'>) {
    return (
        <p
            data-slot="empty-description"
            className={cn('text-sm text-muted-foreground', className)}
            {...props}
        />
    );
}

function EmptyContent({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="empty-content"
            className={cn('flex flex-col items-center gap-4', className)}
            {...props}
        />
    );
}

export { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle };
