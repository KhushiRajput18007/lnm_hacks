"use client";

import React, { useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useChainId } from 'wagmi';
import { Loader2, Wallet, LogOut, ChevronDown } from 'lucide-react';
import { getNativeCurrencySymbol, getChainName } from '@/lib/web3/chains';
import { useNotificationStore } from '@/lib/stores/notificationStore';

export const ConnectButton = () => {
    const { address, isConnected } = useAccount();
    const { connect, connectors, isPending } = useConnect();
    const { disconnect } = useDisconnect();
    const chainId = useChainId();
    const { data: balance } = useBalance({ address });
    const [showConnectors, setShowConnectors] = React.useState(false);
    const { addNotification } = useNotificationStore();
    const [hasNotified, setHasNotified] = React.useState(false);

    // Trigger notification on wallet connect
    useEffect(() => {
        if (isConnected && address && !hasNotified) {
            const chainName = getChainName(chainId);
            addNotification({
                type: 'success',
                message: `Connected to ${chainName}`,
                duration: 4000,
            });
            setHasNotified(true);
        } else if (!isConnected) {
            setHasNotified(false);
        }
    }, [isConnected, address, chainId, hasNotified, addNotification]);

    const handleConnectTrigger = () => {
        // If there's only one connector or specifically just injected, connect directly
        const availableConnectors = connectors.filter(c => c.id !== 'injected'); // Filter out generic injected if specific ones differ

        // Prioritize MetaMask if available
        const metaMaskConnector = connectors.find(c => c.id === 'metaMask' || c.id === 'io.metamask');
        if (metaMaskConnector) {
            connect({ connector: metaMaskConnector });
            return;
        }

        // Fallback to Farcaster if available
        const farcasterConnector = connectors.find(c => c.id === 'farcaster-miniapp');
        if (farcasterConnector) {
            connect({ connector: farcasterConnector });
            return;
        }

        if (connectors.length === 1) {
            connect({ connector: connectors[0] });
        } else {
            setShowConnectors(!showConnectors);
        }
    };

    const handleDisconnect = () => {
        disconnect();
    };

    if (isConnected && address) {
        return (
            <button
                onClick={handleDisconnect}
                className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-medium hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 transition-all group"
            >
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <span className="font-mono">{address.slice(0, 4)}...{address.slice(-4)}</span>
                <LogOut size={14} className="opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
            </button>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={handleConnectTrigger}
                disabled={isPending}
                className="relative group overflow-hidden bg-primary text-white rounded-xl px-4 md:px-6 py-2.5 text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-primary/20"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] shadow-inner"></div>
                {isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <Wallet size={16} />
                )}
                <span className="hidden xs:inline">{isPending ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>

            {showConnectors && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-black/90 border border-white/10 rounded-xl shadow-xl backdrop-blur-md overflow-hidden z-50 p-1">
                    {connectors.map((connector) => (
                        <button
                            key={connector.uid}
                            onClick={() => {
                                connect({ connector });
                                setShowConnectors(false);
                            }}
                            className="w-full text-left px-4 py-3 text-xs font-bold text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <div className="w-2 h-2 rounded-full bg-white/20"></div>
                            {connector.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
