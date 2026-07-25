import React from 'react';

export default function ErrorLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
            {children}
        </div>
    );
}
