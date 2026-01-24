"use client";

import React from 'react';
import { User, ArrowLeft, Wallet, History, Settings, TrendingUp, TrendingDown } from 'lucide-react';
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
            <div className="max-w-md mx-auto min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/5 shadow-2xl backdrop-blur-md">
                    <User size={32} className="text-gray-400" />
                </div>
                <h1 className="text-3xl font-bold mb-2">My Profile</h1>
                <p className="text-gray-400 mb-8 max-w-xs leading-relaxed">Connect your wallet to track your bets, view your history, and manage your earnings.</p>
                <div className="scale-110">
                    <ConnectButton />
                </div>
                <Link href="/" className="mt-12 text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2 font-medium">
                    <ArrowLeft size={14} /> Back to Markets
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-xl mx-auto min-h-screen pb-20 relative px-4 pt-8">
            {/* Nav Header */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <button className="bg-white/5 p-3 rounded-full border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
                            <ArrowLeft size={20} className="text-gray-400 group-hover:text-white" />
                        </button>
                    </Link>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        Profile
                    </h1>
                </div>
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-3 text-gray-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-full border border-white/10 hover:border-white/20"
                >
                    <Settings size={20} />
                </button>
            </div>

            {/* Profile Card */}
            <div className="bg-[#151519]/80 backdrop-blur-md border border-white/5 shadow-xl transition-all duration-300 hover:border-white/10 hover:bg-[#1A1A1F]/90 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 rounded-[2rem] p-8 mb-8 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-30 transition-opacity">
                    <div className="w-32 h-32 bg-indigo-500 rounded-full blur-[60px]"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-5 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 p-[2px] shadow-lg shadow-indigo-500/20">
                            <div className="w-full h-full bg-[#151519] rounded-2xl flex items-center justify-center">
                                <span className="text-2xl">😎</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-indigo-300 font-bold uppercase tracking-wider mb-1">Connected As</div>
                            <div className="font-mono font-bold text-lg text-white truncate w-48 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                                {address}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/30 rounded-2xl p-4 border border-white/5 hover:border-indigo-500/30 transition-colors">
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Wallet size={12} className="text-indigo-400" /> Balance
                            </div>
                            <div className="text-2xl font-black text-white">{balance?.formatted.slice(0, 6)} <span className="text-sm font-medium text-gray-500">{balance?.symbol}</span></div>
                        </div>
                        <div className="bg-black/30 rounded-2xl p-4 border border-white/5 hover:border-purple-500/30 transition-colors">
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <History size={12} className="text-purple-400" /> Total Bets
                            </div>
                            <div className="text-2xl font-black text-white">12</div>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 px-2 flex items-center gap-2">
                <History size={14} /> Recent Activity
            </h2>

            <div className="space-y-4">
                {history.map((item) => (
                    <div key={item.id} className="bg-[#151519]/80 backdrop-blur-md border border-white/5 shadow-xl transition-all duration-300 hover:border-white/10 hover:bg-[#1A1A1F]/90 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 rounded-2xl p-5 hover:bg-white/10 cursor-default">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <span className={`text-sm font-bold block mb-1 ${item.action.includes('Option A') ? 'text-indigo-300' : 'text-purple-300'
                                    }`}>{item.action}</span>
                                <span className="text-[10px] text-gray-500 font-mono bg-white/5 px-2 py-0.5 rounded-full">{item.time}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${item.status === 'win' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                item.status === 'loss' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                }`}>
                                {item.result}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                {item.status === 'win' ? <TrendingUp size={14} className="text-green-500" /> : <TrendingDown size={14} className="text-red-500" />}
                                <span className="text-xs font-medium text-gray-300">Wager</span>
                            </div>
                            <span className="font-mono text-sm font-bold text-white">{item.amount}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12">
                <button
                    onClick={() => disconnect()}
                    className="w-full py-4 rounded-2xl border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all font-bold text-sm tracking-wide"
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
