"use client";

import React, { useEffect, useState } from 'react';
import { User, Wallet, History, Settings, TrendingUp, ExternalLink } from 'lucide-react';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@/components/ConnectButton';
import { SettingsModal } from '@/components/SettingsModal';
import { TransactionHistory } from '@/components/TransactionHistory';
import { useTransactionStore } from '@/lib/stores/transactionStore';
import { fetchWalletBalance } from '@/lib/utils/balanceUtils';
import { getNativeCurrencySymbol } from '@/lib/web3/chains';

export default function ProfilePage() {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
    const [realBalance, setRealBalance] = useState<string | null>(null);
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);

    const {
        transactions,
        selectedChain,
        optimisticBalance,
        setOptimisticBalance,
        getActiveBetsCount,
        getTotalBetsCount
    } = useTransactionStore();

    // Fetch wallet balance on mount and when address changes
    useEffect(() => {
        if (address && isConnected) {
            setIsLoadingBalance(true);
            fetchWalletBalance(address, selectedChain)
                .then((balance) => {
                    setRealBalance(balance);
                    // Initialize optimistic balance if not set
                    if (!optimisticBalance && balance) {
                        setOptimisticBalance(balance);
                    }
                })
                .finally(() => {
                    setIsLoadingBalance(false);
                });
        }
    }, [address, isConnected, selectedChain]);

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
        );
    }

    const activeBets = getActiveBetsCount();
    const totalBets = getTotalBetsCount();

    // Use optimistic balance if available, otherwise real balance
    const displayBalance = optimisticBalance || realBalance || '—';
    const currencySymbol = getNativeCurrencySymbol(selectedChain);

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
                            <div className="text-2xl font-black text-white">
                                {isLoadingBalance ? (
                                    <span className="text-muted animate-pulse">Loading...</span>
                                ) : (
                                    <>
                                        {displayBalance} <span className="text-sm font-bold text-muted">{currencySymbol}</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="glass bg-white/[0.02] rounded-3xl p-6 border border-white/5 hover:border-secondary/30 transition-all">
                            <div className="text-[10px] text-muted font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                <History size={14} className="text-secondary" /> Total Bets
                            </div>
                            <div className="text-2xl font-black text-white">{totalBets}</div>
                        </div>
                        <div className="glass bg-white/[0.02] rounded-3xl p-6 border border-white/5 hover:border-green-500/30 transition-all">
                            <div className="text-[10px] text-muted font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                <TrendingUp size={14} className="text-green-500" /> Active Bets
                            </div>
                            <div className="text-2xl font-black text-green-500">{activeBets}</div>
                        </div>
                    </div>
                </div>
            </div>

            <TransactionHistory />

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
