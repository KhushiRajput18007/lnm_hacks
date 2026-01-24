"use client";

import { useEffect } from 'react';
import { setupGlobalErrorHandling } from '@/lib/utils/errorHandling';

/**
 * Error boundary component that sets up global error handling
 */
export function ErrorBoundary({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Setup global error handlers on mount
        setupGlobalErrorHandling();
    }, []);

    return <>{children}</>;
}
