"use client";

import React from 'react';
import { User, ArrowLeft, Wallet, History, Settings } from 'lucide-react';
import Link from 'next/link';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { ConnectButton } from '@/components/ConnectButton';
import { SettingsModal } from '@/components/SettingsModal';

export default function ProfilePage() {
    const { address, isConnected } = useAccount();
    const { data: balance } = useBalance({ address });
    const { disconnect } = useDisconnect();
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

    // Mock History
    const history = [
        { id: 1, action: 'Bet on Option A', amount: '0.05 ETH', result: 'Pending', time: '10 mins ago' },
        { id: 2, action: 'Bet on Option B', amount: '0.1 ETH', result: 'Won (+0.18 ETH)', time: '2 hours ago', status: 'win' },
        { id: 3, action: 'Bet on Option A', amount: '0.02 ETH', result: 'Lost', time: '1 day ago', status: 'loss' },
    ];

    if (!isConnected) {
        return (
            <div className="max-w-md mx-auto min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Profile</h1>
                <p className="text-gray-400 text-center mb-8">Connect your wallet to view your profile and betting history.</p>
                <ConnectButton />
                <Link href="/" className="mt-8 text-sm text-primary hover:underline">
                    Back to Markets
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-md mx-auto min-h-screen bg-background pb-20 relative px-4 pt-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <button className="bg-surface p-2 rounded-full border border-gray-800 hover:border-white transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                    </Link>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <User className="text-primary" /> Profile
                    </h1>
                </div>
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-2 text-gray-500 hover:text-white transition-colors bg-surface rounded-full border border-transparent hover:border-gray-700"
                >
                    <Settings size={20} />
                </button>
            </div>

            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-6 border border-primary/20 mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent p-1">
                        <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                            <span className="text-2xl">👤</span>
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Connected Wallet</div>
                        <div className="font-mono font-bold text-lg truncate w-40">{address}</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/40 rounded-xl p-3 border border-gray-800">
                        <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                            <Wallet size={12} /> Balance
                        </div>
                        <div className="text-xl font-bold">{balance?.formatted.slice(0, 6)} {balance?.symbol}</div>
                    </div>
                    <div className="bg-black/40 rounded-xl p-3 border border-gray-800">
                        <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                            <History size={12} /> Total Bets
                        </div>
                        <div className="text-xl font-bold">12</div>
                    </div>
                </div>
            </div>

            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <History size={18} /> Recent Activity
            </h2>

            <div className="space-y-3">
                {history.map((item) => (
                    <div key={item.id} className="bg-surface rounded-xl p-4 border border-gray-800">
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-sm">{item.action}</span>
                            <span className="text-xs text-gray-500">{item.time}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-mono text-sm text-gray-300">{item.amount}</span>
                            <span className={`text-xs font-bold px-2 py-1 rounded bg-black/50 
                        ${item.status === 'win' ? 'text-green-500 border border-green-500/30' :
                                    item.status === 'loss' ? 'text-red-500 border border-red-500/30' : 'text-blue-500 border border-blue-500/30'}
                    `}>
                                {item.result}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <button
                    onClick={() => disconnect()}
                    className="w-full py-4 rounded-xl border border-red-900/50 text-red-500 hover:bg-red-950/30 transition-colors font-bold"
                >
                    Disconnect Wallet
                </button>
            </div>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    );
}
