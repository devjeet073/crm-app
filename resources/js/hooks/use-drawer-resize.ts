import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'drawer-width';
const DEFAULT_WIDTH = 384;
const MIN_WIDTH = 320;
const MAX_WIDTH = 800;

function getStoredWidth(): number {
    if (typeof window === 'undefined') {
        return DEFAULT_WIDTH;
    }

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);

        if (stored) {
            const parsed = parseInt(stored, 10);

            if (!isNaN(parsed) && parsed >= MIN_WIDTH && parsed <= MAX_WIDTH) {
                return parsed;
            }
        }
    } catch {
        // ignore
    }

    return DEFAULT_WIDTH;
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

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging.current) {
            return;
        }

        const delta = startX.current - e.clientX;
        const newWidth = Math.min(
            MAX_WIDTH,
            Math.max(MIN_WIDTH, startWidth.current + delta),
        );
        setWidth(newWidth);
    }, []);

    const handleMouseUpRef = useRef<() => void>(() => {
        isDragging.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        localStorage.setItem(STORAGE_KEY, String(widthRef.current));
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUpRef.current);
    });

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            isDragging.current = true;
            startX.current = e.clientX;
            startWidth.current = widthRef.current;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUpRef.current);
        },
        [handleMouseMove],
    );

    const setDrawerWidth = useCallback((newWidth: number) => {
        const clamped = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, newWidth));
        setWidth(clamped);
        localStorage.setItem(STORAGE_KEY, String(clamped));
    }, []);

    return { width, setWidth: setDrawerWidth, handleMouseDown };
}
