"use client";

import React from 'react';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Loader2 } from 'lucide-react';

export const ConnectButton = () => {
    const { address, isConnected } = useAccount();
    const { connect, isPending } = useConnect();
    const { disconnect } = useDisconnect();
    const { data: balance } = useBalance({ address });

    const handleConnect = () => {
        connect({ connector: injected() });
    };

    if (isConnected && address) {
        return (
            <button
                onClick={() => disconnect()}
                className="flex items-center gap-2 bg-surface border border-gray-700 rounded-full px-4 py-1.5 text-xs font-medium hover:border-red-500 hover:text-red-500 transition-all font-mono"
            >
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                {balance?.formatted.slice(0, 4)} {balance?.symbol} | {address.slice(0, 4)}...{address.slice(-4)}
            </button>
        );
    }

    return (
        <button
            onClick={handleConnect}
            disabled={isPending}
            className="bg-primary text-white border border-primary/50 rounded-full px-5 py-2 text-xs font-bold hover:bg-blue-600 transition-all shadow-[0_0_10px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
            {isPending && <Loader2 size={12} className="animate-spin" />}
            {isPending ? 'Connecting...' : 'Connect Wallet'}
        </button>
    );
};
