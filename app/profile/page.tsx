"use client";

import React from 'react';
import { User, Wallet, History, Settings, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { ConnectButton } from '@/components/ConnectButton';
import { SettingsModal } from '@/components/SettingsModal';

export default function ProfilePage() {
    const { address, isConnected } = useAccount();
    const { data: balance } = useBalance({ address });
    const { disconnect } = useDisconnect();
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

    const history = [
        { id: 1, action: 'Bet on Option A', amount: '0.05 ETH', result: 'Pending', time: '10 mins ago' },
        { id: 2, action: 'Bet on Option B', amount: '0.1 ETH', result: 'Won (+0.18 ETH)', time: '2 hours ago', status: 'win' },
        { id: 3, action: 'Bet on Option A', amount: '0.02 ETH', result: 'Lost', time: '1 day ago', status: 'loss' },
    ];

    if (!isConnected) {
        return (
            <div className="max-w-4xl mx-auto min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 glass rounded-3xl flex items-center justify-center mb-8 relative group">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <User size={40} className="text-muted group-hover:text-primary transition-colors relative z-10" />
                </div>
                <h1 className="text-4xl font-black text-white tracking-tighter mb-4">YOUR PROFILE</h1>
                <p className="text-muted mb-10 max-w-xs leading-relaxed font-medium">Connect your wallet to track your predictions and earnings.</p>
                <ConnectButton />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto min-h-screen pb-20 relative px-4 pt-10">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
                        DASHBOARD
                    </h1>
                    <p className="text-muted font-medium uppercase text-[10px] tracking-[0.2em]">Manage your attention assets</p>
                </div>
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-4 glass rounded-2xl text-muted hover:text-white transition-all group"
                >
                    <Settings size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                </button>
            </div>

            <div className="glass rounded-4xl p-8 mb-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-50"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[80px] rounded-full"></div>
                
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
                        <div className="w-20 h-20 rounded-3xl glass p-1">
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[1.25rem] flex items-center justify-center text-3xl">
                                👨‍🚀
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Wallet Address</div>
                            <div className="flex items-center gap-3">
                                <div className="font-mono font-black text-xl text-white truncate max-w-[200px] md:max-w-md">
                                    {address}
                                </div>
                                <ExternalLink size={16} className="text-muted hover:text-white cursor-pointer transition-colors" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="glass bg-white/[0.02] rounded-3xl p-6 border border-white/5 hover:border-primary/30 transition-all">
                            <div className="text-[10px] text-muted font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Wallet size={14} className="text-primary" /> Net Worth
                            </div>
                            <div className="text-2xl font-black text-white">{balance?.formatted.slice(0, 6)} <span className="text-sm font-bold text-muted">{balance?.symbol}</span></div>
                        </div>
                        <div className="glass bg-white/[0.02] rounded-3xl p-6 border border-white/5 hover:border-secondary/30 transition-all">
                            <div className="text-[10px] text-muted font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                <History size={14} className="text-secondary" /> Active Bets
                            </div>
                            <div className="text-2xl font-black text-white">4</div>
                        </div>
                        <div className="glass bg-white/[0.02] rounded-3xl p-6 border border-white/5 hover:border-green-500/30 transition-all">
                            <div className="text-[10px] text-muted font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                <TrendingUp size={14} className="text-green-500" /> PnL 24h
                            </div>
                            <div className="text-2xl font-black text-green-500">+0.42 <span className="text-sm font-bold opacity-50">ETH</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-6 px-2 flex items-center gap-2">
                <History size={14} className="text-primary" /> Recent Predictions
            </h2>

            <div className="space-y-4">
                {history.map((item) => (
                    <div key={item.id} className="glass glass-hover rounded-3xl p-6 group">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border
                                    ${item.status === 'win' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                      item.status === 'loss' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                      'bg-primary/10 border-primary/20 text-primary'}
                                `}>
                                    {item.status === 'win' ? <TrendingUp size={20} /> : 
                                     item.status === 'loss' ? <TrendingDown size={20} /> : 
                                     <History size={20} />}
                                </div>
                                <div>
                                    <div className="text-sm font-black text-white group-hover:text-primary transition-colors">{item.action}</div>
                                    <div className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">{item.time}</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-8">
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Wager</div>
                                    <div className="text-sm font-black text-white">{item.amount}</div>
                                </div>
                                <div className="text-right min-w-[100px]">
                                    <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Result</div>
                                    <div className={`text-sm font-black ${
                                        item.status === 'win' ? 'text-green-500' :
                                        item.status === 'loss' ? 'text-red-500' :
                                        'text-primary'
                                    }`}>
                                        {item.result}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 flex justify-center">
                <button
                    onClick={() => disconnect()}
                    className="px-8 py-4 rounded-2xl bg-white/[0.03] border border-red-500/20 text-red-500 hover:bg-red-500/10 hover:border-red-500/50 transition-all font-black text-[10px] uppercase tracking-[0.2em]"
                >
                    Log Out of Terminal
                </button>
            </div>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    );
}
