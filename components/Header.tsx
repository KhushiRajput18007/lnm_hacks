"use client";

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Wallet, LogOut } from 'lucide-react';
import { theme } from '@/styles/theme';

export function Header() {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    // Using standard wagmi connect - usually handled by miniapp wrapper but here's a fallback UI

    const shortAddress = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : '';

    return (
        <header className={`sticky top-0 z-40 w-full backdrop-blur-md bg-black/50 border-b border-zinc-800`}>
            <div className={`${theme.spacing.container} flex items-center justify-between h-14 px-4`}>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold">
                        AR
                    </div>
                    <span className="font-bold text-white text-sm">Attention Roulette</span>
                </div>

                <div className="flex items-center gap-2">
                    {isConnected ? (
                        <button
                            onClick={() => disconnect()}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition"
                        >
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            {shortAddress}
                            <LogOut size={12} className="ml-1 opacity-50" />
                        </button>
                    ) : (
                        <div className="text-xs text-zinc-500">
                            <span className="hidden sm:inline">Connect Wallet</span>
                            <Wallet className="inline sm:hidden" size={16} />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
