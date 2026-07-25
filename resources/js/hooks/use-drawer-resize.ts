import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'drawer-width-v2';
const MIN_WIDTH = 320;
function getDefaultWidth(): number {
    return typeof window !== 'undefined'
        ? Math.floor(window.innerWidth * 0.45)
        : 600;
}

function getMaxWidth(): number {
    return typeof window !== 'undefined'
        ? Math.floor(window.innerWidth * 0.9)
        : 1200;
}

function getStoredWidth(): number {
    if (typeof window === 'undefined') {
        return getDefaultWidth();
    }

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);

        if (stored) {
            const parsed = parseInt(stored, 10);
            const max = getMaxWidth();

            if (!isNaN(parsed) && parsed >= MIN_WIDTH && parsed <= max) {
                return parsed;
            }
        }
    } catch {
        // ignore
    }

    return getDefaultWidth();
}

export function useDrawerResize() {
    const [width, setWidth] = useState(getStoredWidth);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const startWidth = useRef(0);
    const widthRef = useRef(width);

    useEffect(() => {
        widthRef.current = width;
    });

    const SNAP_POINTS = [400, 560, 720, 960, 1200];

    const handlePointerMove = useCallback((e: PointerEvent) => {
        if (!isDragging.current) {
            return;
        }

        const delta = startX.current - e.clientX;
        const targetWidth = Math.min(
            getMaxWidth(),
            Math.max(MIN_WIDTH, startWidth.current + delta),
        );

        // Snap to closest snap point within a threshold
        const snapDistance = 30; // 30px threshold for snapping
        let newWidth = targetWidth;
        
        for (const point of SNAP_POINTS) {
            if (Math.abs(targetWidth - point) < snapDistance) {
                newWidth = point;
                break;
            }
        }

        setWidth(newWidth);
    }, []);

    const handlePointerUpRef = useRef<() => void>(() => {
        isDragging.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        localStorage.setItem(STORAGE_KEY, String(widthRef.current));
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUpRef.current);
    });

    const handlePointerDown = useCallback(
        (e: React.PointerEvent) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Critical: capture the pointer so events don't get lost when mouse moves outside
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            
            isDragging.current = true;
            startX.current = e.clientX;
            startWidth.current = widthRef.current;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
            document.addEventListener('pointermove', handlePointerMove);
            document.addEventListener('pointerup', handlePointerUpRef.current);
        },
        [handlePointerMove],
    );

    const setDrawerWidth = useCallback((newWidth: number) => {
        const clamped = Math.min(getMaxWidth(), Math.max(MIN_WIDTH, newWidth));
        setWidth(clamped);
        localStorage.setItem(STORAGE_KEY, String(clamped));
    }, []);

    return { width, setWidth: setDrawerWidth, handlePointerDown };
}
