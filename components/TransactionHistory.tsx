"use client";

import React, { useState } from 'react';
import { useBettingStore, UserBet } from '@/lib/stores/transactionStore';
import { getNativeCurrencySymbol } from '@/lib/web3/chains';
import { Clock, ExternalLink, Trophy, TrendingDown, Gift, Loader2, Twitter, Copy, Check } from 'lucide-react';
import { claimWinnings } from '@/lib/web3/predictionMarket';
import { ethers } from 'ethers';
import { useNotificationStore } from '@/lib/stores/notificationStore';

export const TransactionHistory: React.FC = () => {
    const { bets, updateBetStatus, addToBalance } = useBettingStore();
    const { addNotification } = useNotificationStore();
    const [claimingBetId, setClaimingBetId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    if (bets.length === 0) {
        return (
            <div className="glass rounded-3xl p-8 text-center">
                <div className="w-16 h-16 bg-white/[0.03] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock size={32} className="text-muted" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Predictions Yet</h3>
                <p className="text-sm text-muted">
                    Your prediction history will appear here once you place your first bet.
                </p>
            </div>
        );
    }

    // Handle claiming winnings
    const handleClaimWinnings = async (bet: UserBet) => {
        if (!bet.betId || !window.ethereum) return;

        setClaimingBetId(bet.id);

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            await claimWinnings(signer, parseInt(bet.betId));

            updateBetStatus(bet.id, 'claimed');

            if (bet.potentialWinnings) {
                addToBalance(bet.potentialWinnings);
            }

            addNotification({
                type: 'success',
                message: `Winnings claimed! +${bet.potentialWinnings || bet.amount} added to balance.`,
                duration: 5000,
            });

        } catch (error: any) {
            console.error('Claim error:', error);
            addNotification({
                type: 'error',
                message: error.message || 'Failed to claim winnings',
                duration: 5000,
            });
        } finally {
            setClaimingBetId(null);
        }
    };

    // Share to Twitter
    const shareToTwitter = (bet: UserBet) => {
        let text = '';
        if (bet.status === 'won' || bet.status === 'claimed') {
            text = `🎉 I just WON on @AttentionRoulette!\n\n"${bet.marketQuestion}"\n\nBet ${bet.side} with ${bet.amount} ${getNativeCurrencySymbol(bet.chain)} and won! 🚀\n\n#AttentionRoulette #Crypto`;
        } else if (bet.status === 'lost') {
            text = `😅 Lost on @AttentionRoulette betting "${bet.marketQuestion}"\n\nBetter luck next time! 🎰\n\n#AttentionRoulette`;
        } else {
            text = `🎯 I'm betting ${bet.side} on @AttentionRoulette!\n\n"${bet.marketQuestion}"\n\n${bet.amount} ${getNativeCurrencySymbol(bet.chain)} on the line! 🔥\n\n#AttentionRoulette #Crypto`;
        }
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'width=550,height=420');
    };

    // Copy to clipboard
    const copyToClipboard = async (bet: UserBet) => {
        const text = `I bet ${bet.side} on "${bet.marketQuestion}" with ${bet.amount} ${getNativeCurrencySymbol(bet.chain)} on AttentionRoulette!`;
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(bet.id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    // Get status badge
    const getStatusBadge = (status: UserBet['status']) => {
        switch (status) {
            case 'won':
                return (
                    <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                        <Trophy size={10} /> WON
                    </span>
                );
            case 'claimed':
                return (
                    <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        <Gift size={10} /> CLAIMED
                    </span>
                );
            case 'lost':
                return (
                    <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                        <TrendingDown size={10} /> LOST
                    </span>
                );
            case 'active':
                return (
                    <span className="flex items-center gap-1 text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                        <Clock size={10} /> ACTIVE
                    </span>
                );
            case 'pending':
                return (
                    <span className="flex items-center gap-1 text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full animate-pulse">
                        <Loader2 size={10} className="animate-spin" /> PENDING
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-4">
            {bets.map((bet) => {
                const currencySymbol = getNativeCurrencySymbol(bet.chain);
                const isWon = bet.status === 'won';
                const isClaiming = claimingBetId === bet.id;
                const isCopied = copiedId === bet.id;

                return (
                    <div
                        key={bet.id}
                        className={`glass rounded-2xl p-6 hover:bg-white/[0.05] transition-all relative overflow-hidden ${bet.status === 'won' ? 'border-l-4 border-green-500' :
                                bet.status === 'claimed' ? 'border-l-4 border-primary' :
                                    bet.status === 'lost' ? 'border-l-4 border-red-500' :
                                        bet.status === 'active' ? 'border-l-4 border-yellow-500' : ''
                            }`}
                    >
                        {/* Glow effect */}
                        {(bet.status === 'won' || bet.status === 'claimed') && (
                            <div className="absolute top-0 left-0 w-32 h-32 bg-green-500/10 blur-[50px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                        )}

                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <span className="text-lg">
                                        {bet.status === 'won' || bet.status === 'claimed' ? '🏆' :
                                            bet.status === 'lost' ? '😢' :
                                                bet.status === 'active' ? '⏳' : '⚡'}
                                    </span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${bet.side === 'YES' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {bet.side}
                                    </span>
                                    {getStatusBadge(bet.status)}
                                </div>

                                <h3 className="text-white font-bold mb-1 leading-tight text-sm">
                                    {bet.marketQuestion}
                                </h3>

                                <div className="flex items-center gap-2 text-xs text-muted flex-wrap mt-2">
                                    <span>{bet.chainName}</span>
                                    <span>•</span>
                                    <span>{new Date(bet.timestamp).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>{new Date(bet.timestamp).toLocaleTimeString()}</span>
                                </div>
                            </div>

                            <div className="text-right ml-4">
                                <div className={`text-lg font-black ${bet.status === 'won' || bet.status === 'claimed' ? 'text-green-500' :
                                        bet.status === 'lost' ? 'text-red-500' : 'text-white'
                                    }`}>
                                    {bet.status === 'lost' ? '-' : ''}{bet.amount} {currencySymbol}
                                </div>
                                {bet.potentialWinnings && bet.status !== 'lost' && (
                                    <div className="text-xs text-green-500/70">
                                        Win: +{bet.potentialWinnings}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 border-t border-white/5 relative z-10">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                {/* TX Hash Link */}
                                <div className="flex items-center gap-3">
                                    {bet.txHash && (
                                        <a
                                            href={`https://explorer.testnet.monad.xyz/tx/${bet.txHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 text-xs font-mono text-white/60 hover:text-primary transition-colors"
                                        >
                                            <ExternalLink size={12} />
                                            {bet.txHash.slice(0, 8)}...{bet.txHash.slice(-6)}
                                        </a>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    {/* Claim button */}
                                    {isWon && bet.betId && (
                                        <button
                                            onClick={() => handleClaimWinnings(bet)}
                                            disabled={isClaiming}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50"
                                        >
                                            {isClaiming ? (
                                                <Loader2 size={12} className="animate-spin" />
                                            ) : (
                                                <Gift size={12} />
                                            )}
                                            {isClaiming ? 'Claiming...' : 'Claim'}
                                        </button>
                                    )}

                                    {/* Share buttons */}
                                    <button
                                        onClick={() => shareToTwitter(bet)}
                                        className="flex items-center gap-1.5 px-2 py-1.5 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border border-[#1DA1F2]/30 rounded-lg text-[#1DA1F2] text-xs font-bold transition-all"
                                    >
                                        <Twitter size={12} />
                                    </button>
                                    <button
                                        onClick={() => copyToClipboard(bet)}
                                        className="flex items-center gap-1.5 px-2 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/70 text-xs font-bold transition-all"
                                    >
                                        {isCopied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
