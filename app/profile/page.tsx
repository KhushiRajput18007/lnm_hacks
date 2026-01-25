"use client";

import React, { useEffect, useState } from 'react';
import { User, Wallet, History, Settings, TrendingUp, ExternalLink, Trophy, TrendingDown } from 'lucide-react';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@/components/ConnectButton';
import { SettingsModal } from '@/components/SettingsModal';
import { TransactionHistory } from '@/components/TransactionHistory';
import { useBettingStore } from '@/lib/stores/transactionStore';
import { getNativeCurrencySymbol } from '@/lib/web3/chains';
import { ethers } from 'ethers';

export default function ProfilePage() {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
    const [realBalance, setRealBalance] = useState<string | null>(null);
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);

    const {
        bets,
        selectedChain,
        optimisticBalance,
        setOptimisticBalance,
        getActiveBetsCount,
        getTotalBetsCount,
        getWinsCount,
        getLossesCount
    } = useBettingStore();

    // Fetch wallet balance directly from blockchain
    useEffect(() => {
        if (address && isConnected && window.ethereum) {
            setIsLoadingBalance(true);
            const fetchBalance = async () => {
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const balance = await provider.getBalance(address);
                    const balanceFormatted = ethers.formatEther(balance);
                    const balanceRounded = parseFloat(balanceFormatted).toFixed(4);
                    setRealBalance(balanceRounded);
                    setOptimisticBalance(balanceRounded);
                } catch (error) {
                    console.error('Error fetching balance:', error);
                    setRealBalance(null);
                } finally {
                    setIsLoadingBalance(false);
                }
            };
            fetchBalance();
        }
    }, [address, isConnected, selectedChain, setOptimisticBalance]);

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
    const wins = getWinsCount();
    const losses = getLossesCount();
    const displayBalance = optimisticBalance || realBalance || '—';
    const currencySymbol = getNativeCurrencySymbol(selectedChain);

    // Calculate win rate
    const completedBets = wins + losses;
    const winRate = completedBets > 0 ? ((wins / completedBets) * 100).toFixed(1) : '—';

    // Calculate total wagered
    const totalWagered = bets.reduce((sum, bet) => sum + parseFloat(bet.amount), 0);

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
                                <a
                                    href={`https://explorer.testnet.monad.xyz/address/${address}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted hover:text-primary transition-colors"
                                >
                                    <ExternalLink size={16} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Balance */}
                        <div className="glass rounded-2xl p-5 relative overflow-hidden group/card">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 text-muted text-xs font-bold uppercase tracking-wider mb-2">
                                    <Wallet size={14} />
                                    Balance
                                </div>
                                <div className="text-2xl font-black text-white">
                                    {isLoadingBalance ? (
                                        <div className="h-8 w-24 bg-white/5 animate-pulse rounded-lg"></div>
                                    ) : (
                                        <>{displayBalance} <span className="text-sm text-muted">{currencySymbol}</span></>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Total Bets */}
                        <div className="glass rounded-2xl p-5 relative overflow-hidden group/card">
                            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 text-muted text-xs font-bold uppercase tracking-wider mb-2">
                                    <History size={14} />
                                    Total Bets
                                </div>
                                <div className="text-2xl font-black text-white">
                                    {totalBets}
                                </div>
                            </div>
                        </div>

                        {/* Wins */}
                        <div className="glass rounded-2xl p-5 relative overflow-hidden group/card">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 text-muted text-xs font-bold uppercase tracking-wider mb-2">
                                    <Trophy size={14} className="text-green-500" />
                                    Wins
                                </div>
                                <div className="text-2xl font-black text-green-500">
                                    {wins}
                                </div>
                            </div>
                        </div>

                        {/* Losses */}
                        <div className="glass rounded-2xl p-5 relative overflow-hidden group/card">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 text-muted text-xs font-bold uppercase tracking-wider mb-2">
                                    <TrendingDown size={14} className="text-red-500" />
                                    Losses
                                </div>
                                <div className="text-2xl font-black text-red-500">
                                    {losses}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {/* Active Bets */}
                        <div className="glass rounded-2xl p-5">
                            <div className="flex items-center gap-2 text-muted text-xs font-bold uppercase tracking-wider mb-2">
                                <TrendingUp size={14} className="text-yellow-500" />
                                Active Bets
                            </div>
                            <div className="text-2xl font-black text-yellow-500">
                                {activeBets}
                            </div>
                        </div>

                        {/* Win Rate */}
                        <div className="glass rounded-2xl p-5">
                            <div className="flex items-center gap-2 text-muted text-xs font-bold uppercase tracking-wider mb-2">
                                <Trophy size={14} />
                                Win Rate
                            </div>
                            <div className="text-2xl font-black text-white">
                                {winRate}%
                            </div>
                        </div>

                        {/* Total Wagered */}
                        <div className="glass rounded-2xl p-5">
                            <div className="flex items-center gap-2 text-muted text-xs font-bold uppercase tracking-wider mb-2">
                                <Wallet size={14} />
                                Total Wagered
                            </div>
                            <div className="text-2xl font-black text-white">
                                {totalWagered.toFixed(4)} <span className="text-sm text-muted">{currencySymbol}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="glass rounded-4xl p-8">
                <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                    <History size={24} className="text-primary" />
                    Recent Predictions
                </h2>
                <TransactionHistory />
            </div>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    );
}
