"use client";

import React, { useEffect, useState } from 'react';
import { Trophy, TrendingUp, Medal, Crown } from 'lucide-react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@/components/ConnectButton';
import { getLeaderboardData, UserStats } from '@/lib/web3/userStats';
import { ethers } from 'ethers';
import { useTransactionStore } from '@/lib/stores/transactionStore';
import { getNativeCurrencySymbol } from '@/lib/web3/chains';

export default function LeaderboardPage() {
    const { address, isConnected } = useAccount();
    const { selectedChain } = useTransactionStore();
    const [leaderboard, setLeaderboard] = useState<UserStats[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const currencySymbol = getNativeCurrencySymbol(selectedChain);

    useEffect(() => {
        if (isConnected && window.ethereum) {
            setIsLoading(true);
            const fetchLeaderboard = async () => {
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum);

                    // Get unique addresses from recent transactions
                    // In production, you'd track this off-chain in a database
                    const knownAddresses = new Set<string>();

                    // Add current user
                    if (address) {
                        knownAddresses.add(address);
                    }

                    // For demo, we'll just show the current user's stats
                    // In production, you'd query all users from your backend
                    const stats = await getLeaderboardData(provider, Array.from(knownAddresses));
                    setLeaderboard(stats);
                } catch (error) {
                    console.error('Error fetching leaderboard:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchLeaderboard();
        }
    }, [isConnected, address, selectedChain]);

    if (!isConnected) {
        return (
            <div className="max-w-4xl mx-auto min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 glass rounded-3xl flex items-center justify-center mb-8">
                    <Trophy size={40} className="text-primary" />
                </div>
                <h1 className="text-4xl font-black text-white tracking-tighter mb-4">LEADERBOARD</h1>
                <p className="text-muted mb-10 max-w-xs">Connect your wallet to see the top predictors.</p>
                <ConnectButton />
            </div>
        );
    }

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0:
                return <Crown size={24} className="text-yellow-500" />;
            case 1:
                return <Medal size={24} className="text-gray-400" />;
            case 2:
                return <Medal size={24} className="text-orange-600" />;
            default:
                return <span className="text-muted font-bold">#{index + 1}</span>;
        }
    };

    return (
        <div className="max-w-4xl mx-auto min-h-screen pb-20 px-4 pt-10">
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
                    LEADERBOARD
                </h1>
                <p className="text-muted font-medium uppercase text-[10px] tracking-[0.2em]">
                    Top Predictors on {selectedChain === 10143 ? 'Monad Testnet' : 'Network'}
                </p>
            </div>

            {isLoading ? (
                <div className="glass rounded-4xl p-8">
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-20 bg-white/5 animate-pulse rounded-2xl"></div>
                        ))}
                    </div>
                </div>
            ) : leaderboard.length === 0 ? (
                <div className="glass rounded-4xl p-12 text-center">
                    <Trophy size={48} className="text-muted mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Data Yet</h3>
                    <p className="text-muted">
                        Start placing bets to appear on the leaderboard!
                    </p>
                </div>
            ) : (
                <div className="glass rounded-4xl p-6 md:p-8">
                    <div className="space-y-3">
                        {leaderboard.map((user, index) => {
                            const isCurrentUser = user.address.toLowerCase() === address?.toLowerCase();
                            const netProfitFormatted = ethers.formatEther(user.netProfit);
                            const isProfit = user.netProfit >= 0n;

                            return (
                                <div
                                    key={user.address}
                                    className={`glass rounded-2xl p-6 relative overflow-hidden group/card ${isCurrentUser ? 'border-2 border-primary' : ''
                                        }`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>

                                    <div className="relative z-10 flex items-center justify-between gap-4">
                                        {/* Rank & Address */}
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="w-12 h-12 glass rounded-xl flex items-center justify-center shrink-0">
                                                {getRankIcon(index)}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-mono font-bold text-white truncate">
                                                    {user.address.slice(0, 6)}...{user.address.slice(-4)}
                                                </div>
                                                {isCurrentUser && (
                                                    <div className="text-xs text-primary font-bold">YOU</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center gap-6">
                                            {/* Total Bets */}
                                            <div className="text-center hidden sm:block">
                                                <div className="text-xs text-muted font-bold uppercase tracking-wider mb-1">
                                                    Bets
                                                </div>
                                                <div className="text-lg font-black text-white">
                                                    {user.totalBets}
                                                </div>
                                            </div>

                                            {/* Win Rate */}
                                            <div className="text-center hidden md:block">
                                                <div className="text-xs text-muted font-bold uppercase tracking-wider mb-1">
                                                    Win Rate
                                                </div>
                                                <div className="text-lg font-black text-white">
                                                    {user.winRate.toFixed(0)}%
                                                </div>
                                            </div>

                                            {/* Net Profit */}
                                            <div className="text-right">
                                                <div className="text-xs text-muted font-bold uppercase tracking-wider mb-1">
                                                    Profit
                                                </div>
                                                <div className={`text-lg font-black ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                                                    {isProfit ? '+' : ''}{parseFloat(netProfitFormatted).toFixed(3)} {currencySymbol}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Info Box */}
            <div className="mt-8 glass rounded-2xl p-6">
                <div className="flex items-start gap-3">
                    <TrendingUp size={20} className="text-primary shrink-0 mt-1" />
                    <div>
                        <h3 className="text-sm font-bold text-white mb-1">How Rankings Work</h3>
                        <p className="text-xs text-muted leading-relaxed">
                            Rankings are based on net profit across all resolved markets. Win rate and total bets are also displayed.
                            Data is fetched directly from the blockchain for the selected network.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
