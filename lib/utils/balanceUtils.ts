import { BrowserProvider } from 'ethers';
import { monadTestnet, getNativeCurrencySymbol } from '../web3/chains';

/**
 * Fetch wallet balance for a specific chain
 * @param address - Wallet address
 * @param chainId - Chain ID (defaults to Monad Testnet)
 * @returns Balance in native currency (e.g., "1.2345")
 */
export async function fetchWalletBalance(
    address: string,
    chainId: number = monadTestnet.id
): Promise<string | null> {
    try {
        if (typeof window === 'undefined' || !window.ethereum) {
            return null;
        }

        const provider = new BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(address);

        // Convert from wei to ether
        const balanceInEther = Number(balance) / 1e18;

        return balanceInEther.toFixed(4);
    } catch (error) {
        console.warn('Failed to fetch wallet balance:', error);
        return null;
    }
}

/**
 * Get formatted balance string with currency symbol
 * @param balance - Balance in ether
 * @param chainId - Chain ID
 * @returns Formatted string (e.g., "1.2345 MON")
 */
export function formatBalance(balance: string | null, chainId: number): string {
    if (balance === null) {
        return '—';
    }

    const symbol = getNativeCurrencySymbol(chainId);
    return `${balance} ${symbol}`;
}
