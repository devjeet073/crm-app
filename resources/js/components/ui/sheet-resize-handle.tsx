import * as React from 'react';
import { cn } from '@/lib/utils';

export type SheetResizeHandleProps = React.HTMLAttributes<HTMLDivElement> & {
    onPointerDown: (e: React.PointerEvent) => void;
};

export function SheetResizeHandle({
    onPointerDown,
    className,
    ...props
}: SheetResizeHandleProps) {
    return (
        <div
            className={cn(
                'absolute -left-3 top-0 z-10 flex h-full w-6 cursor-col-resize items-center justify-center',
                'bg-transparent transition-colors hover:bg-border/50 active:bg-border/50',
                className,
            )}
            onPointerDown={onPointerDown}
        >
            <div className="h-8 w-0.5 rounded-full bg-muted-foreground/40" />
        </div>
    );
}
