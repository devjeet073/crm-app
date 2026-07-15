import { cn } from '@/lib/utils';

type DrawerResizeHandleProps = {
    onMouseDown: (e: React.MouseEvent) => void;
    className?: string;
};

export function DrawerResizeHandle({
    onMouseDown,
    className,
}: DrawerResizeHandleProps) {
    return (
        <div
            className={cn(
                'absolute left-0 top-0 z-10 flex h-full w-1 cursor-col-resize items-center justify-center',
                'bg-transparent transition-colors hover:bg-border active:bg-border',
                className,
            )}
            onMouseDown={onMouseDown}
        >
            <div className="h-8 w-0.5 rounded-full bg-muted-foreground/40" />
        </div>
    );
}
