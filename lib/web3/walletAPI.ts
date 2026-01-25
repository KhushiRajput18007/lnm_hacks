import { BrowserProvider, parseEther } from 'ethers';
import { monadTestnet, ethereum, getContractAddress, isSupportedChain, getNativeCurrencySymbol } from './chains';
import { placeBetOnChain, Side } from './attentionRoulette';
import { safeWalletCall, logError, isApplicationError } from '../utils/errorHandling';

/**
 * Wallet API for multi-chain operations
 */

/**
 * Connect wallet (MetaMask)
 * @returns Connected address or null
 */
export async function connectWallet(): Promise<string | null> {
    return await safeWalletCall(
        async () => {
            if (typeof window === 'undefined') {
                throw new Error('Window is not defined');
            }

            // Check if MetaMask is installed
            if (!window.ethereum) {
                throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
            }

            // Request account access with retry
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (accounts && accounts.length > 0) {
                return accounts[0];
            }

            return null;
        },
        'connectWallet',
        { retry: true, fallback: null }
    ) ?? null;
}

/**
 * Switch network to a specific chain
 * @param chainId - Target chain ID
 */
export async function switchNetwork(chainId: number): Promise<boolean> {
    return await safeWalletCall(
        async () => {
            if (typeof window === 'undefined' || !window.ethereum) {
                throw new Error('MetaMask is not available');
            }

            if (!isSupportedChain(chainId)) {
                throw new Error(`Chain ${chainId} is not supported`);
            }

            // Convert chainId to hex
            const chainIdHex = `0x${chainId.toString(16)}`;

            try {
                // Try to switch to the network
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: chainIdHex }],
                });
                return true;
            } catch (switchError: any) {
                // If the chain hasn't been added to MetaMask, add it
                if (switchError.code === 4902) {
                    await addNetwork(chainId);
                    return true;
                }
                throw switchError;
            }
        },
        'switchNetwork',
        { retry: true, fallback: false }
    ) ?? false;
}

/**
 * Add a network to MetaMask
 * @param chainId - Chain ID to add
 */
async function addNetwork(chainId: number): Promise<void> {
    if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask is not available');
    }

    let networkParams: any;

    if (chainId === monadTestnet.id) {
        networkParams = {
            chainId: `0x${chainId.toString(16)}`,
            chainName: monadTestnet.name,
            nativeCurrency: monadTestnet.nativeCurrency,
            rpcUrls: monadTestnet.rpcUrls.default.http,
            blockExplorerUrls: [monadTestnet.blockExplorers.default.url],
        };
    } else if (chainId === ethereum.id) {
        // Ethereum mainnet is usually already in MetaMask
        networkParams = {
            chainId: `0x${chainId.toString(16)}`,
            chainName: ethereum.name,
            nativeCurrency: ethereum.nativeCurrency,
            rpcUrls: ethereum.rpcUrls.default.http,
            blockExplorerUrls: ethereum.blockExplorers?.default ? [ethereum.blockExplorers.default.url] : [],
        };
    } else {
        throw new Error(`Cannot add unsupported chain ${chainId}`);
    }

    await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkParams],
    });
}

/**
 * Place a bet on a specific chain
 * @param marketId - Market ID
 * @param side - YES (0) or NO (1)
 * @param amount - Amount in native currency (e.g., "0.01")
 * @param chainId - Chain ID to place bet on
 * @returns Transaction hash or mock confirmation
 */
export async function placeBet(
    marketId: number,
    side: 'YES' | 'NO',
    amount: string,
    chainId: number
): Promise<{ success: boolean; txHash?: string; message: string }> {
    try {
        if (typeof window === 'undefined' || !window.ethereum) {
            throw new Error('MetaMask is not available');
        }

        // Check if on correct chain
        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
        const currentChainIdDecimal = parseInt(currentChainId, 16);

        if (currentChainIdDecimal !== chainId) {
            // Auto-switch to correct chain
            await switchNetwork(chainId);
        }

        // If on Monad Testnet, execute real transaction
        if (chainId === monadTestnet.id) {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contractAddress = getContractAddress(chainId);

            if (contractAddress === '0x0000000000000000000000000000000000000000') {
                // Contract not deployed yet, mock the transaction
                console.warn('Contract address not set, mocking transaction');
                return mockTransaction(marketId, side, amount, chainId);
            }

            const betSide = side === 'YES' ? Side.YES : Side.NO;
            const receipt = await placeBetOnChain(contractAddress, signer, marketId, betSide, amount);

            return {
                success: true,
                txHash: receipt.hash,
                message: `Bet placed successfully on ${getNativeCurrencySymbol(chainId)}!`,
            };
        } else {
            // For other chains, mock the transaction
            return mockTransaction(marketId, side, amount, chainId);
        }
    } catch (error: any) {
        logError(error, 'placeBet');

        // Return user-friendly error messages
        if (isApplicationError(error)) {
            return {
                success: false,
                message: error.message || 'Transaction failed',
            };
        }

        // Extension errors get generic message
        return {
            success: false,
            message: 'Failed to place bet. Please try again.',
        };
    }
}

/**
 * Mock transaction for non-Monad chains or when contract is not deployed
 */
function mockTransaction(
    marketId: number,
    side: 'YES' | 'NO',
    amount: string,
    chainId: number
): { success: boolean; txHash: string; message: string } {
    // Generate a fake transaction hash
    const fakeTxHash = `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;

    console.log(`[MOCK] Bet placed on Market ${marketId}, Side: ${side}, Amount: ${amount} ${getNativeCurrencySymbol(chainId)}`);

    return {
        success: true,
        txHash: fakeTxHash,
        message: `Mock bet placed successfully! (Chain: ${chainId})`,
    };
}

/**
 * Get current chain ID from MetaMask
 */
export async function getCurrentChainId(): Promise<number | null> {
    try {
        if (typeof window === 'undefined' || !window.ethereum) {
            return null;
        }

        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        return parseInt(chainId, 16);
    } catch (error) {
        console.error('Error getting current chain ID:', error);
        return null;
    }
}

/**
 * Check if wallet is connected
 */
export async function isWalletConnected(): Promise<boolean> {
    try {
        if (typeof window === 'undefined' || !window.ethereum) {
            return false;
        }

        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        return accounts && accounts.length > 0;
    } catch (error) {
        console.error('Error checking wallet connection:', error);
        return false;
    }
}

// Type declaration for window.ethereum
declare global {
    interface Window {
        ethereum?: any;
    }
}
