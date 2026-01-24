/**
 * Global error handling for browser extension and service worker errors
 * This prevents app crashes from MetaMask/extension messaging failures
 */

// Extension-related error patterns to catch
const EXTENSION_ERROR_PATTERNS = [
    'Could not establish connection',
    'Receiving end does not exist',
    'No tab with id',
    'Extension context invalidated',
    'message port closed',
    'The message port closed before a response was received',
];

/**
 * Check if an error is from browser extension/service worker
 */
export function isExtensionError(error: any): boolean {
    const errorMessage = error?.message || error?.toString() || '';
    return EXTENSION_ERROR_PATTERNS.some(pattern =>
        errorMessage.toLowerCase().includes(pattern.toLowerCase())
    );
}

/**
 * Check if an error is a real application error that should be shown
 */
export function isApplicationError(error: any): boolean {
    const errorMessage = error?.message || error?.toString() || '';

    // Real errors we want to show
    const realErrorPatterns = [
        'user rejected',
        'user denied',
        'insufficient funds',
        'insufficient balance',
        'execution reverted',
        'transaction failed',
        'nonce too low',
        'gas required exceeds',
    ];

    return realErrorPatterns.some(pattern =>
        errorMessage.toLowerCase().includes(pattern)
    );
}

/**
 * Log error appropriately based on type
 */
export function logError(error: any, context: string) {
    if (isExtensionError(error)) {
        // Extension errors are warnings, not critical
        console.warn(`[${context}] Extension messaging error (non-critical):`, error.message);
    } else if (isApplicationError(error)) {
        // Real application errors
        console.error(`[${context}] Application error:`, error);
    } else {
        // Unknown errors - log as info for debugging
        console.info(`[${context}] Error:`, error);
    }
}

/**
 * Setup global unhandled promise rejection handler
 */
export function setupGlobalErrorHandling() {
    if (typeof window === 'undefined') return;

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        const error = event.reason;

        // Don't crash on extension errors
        if (isExtensionError(error)) {
            event.preventDefault(); // Prevent default error logging
            console.warn('Caught extension error (non-critical):', error.message);
            return;
        }

        // Let real errors through
        if (isApplicationError(error)) {
            console.error('Unhandled application error:', error);
            // Don't prevent default - let it show in console
            return;
        }

        // Log unknown errors but don't crash
        console.info('Unhandled promise rejection:', error);
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
        const error = event.error;

        if (isExtensionError(error)) {
            event.preventDefault();
            console.warn('Caught extension error (non-critical):', error?.message);
            return;
        }
    });
}

/**
 * Retry wrapper for wallet operations
 */
export async function retryWalletOperation<T>(
    operation: () => Promise<T>,
    context: string,
    maxRetries = 1
): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error: any) {
            lastError = error;

            // If it's an extension error and we have retries left, try again
            if (isExtensionError(error) && attempt < maxRetries) {
                console.warn(`[${context}] Extension error, retrying... (attempt ${attempt + 1}/${maxRetries + 1})`);
                await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms before retry
                continue;
            }

            // If it's a real error or we're out of retries, throw it
            throw error;
        }
    }

    throw lastError;
}

/**
 * Safe wrapper for wallet operations with proper error handling
 */
export async function safeWalletCall<T>(
    operation: () => Promise<T>,
    context: string,
    options: {
        retry?: boolean;
        fallback?: T;
        onError?: (error: any) => void;
    } = {}
): Promise<T | undefined> {
    try {
        if (options.retry) {
            return await retryWalletOperation(operation, context);
        } else {
            return await operation();
        }
    } catch (error: any) {
        logError(error, context);

        if (options.onError) {
            options.onError(error);
        }

        // Return fallback if provided
        if (options.fallback !== undefined) {
            return options.fallback;
        }

        // Re-throw application errors
        if (isApplicationError(error)) {
            throw error;
        }

        // Extension errors don't crash the app
        return undefined;
    }
}
