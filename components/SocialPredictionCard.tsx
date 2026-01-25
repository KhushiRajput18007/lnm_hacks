"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Market, calculateOdds, getTimeRemaining, formatSocialStats } from '@/lib/data';
import { useBettingStore } from '@/lib/stores/transactionStore';
import { Clock, TrendingUp, Heart, Eye, Twitter, Instagram, CheckCircle2, Share2, Users } from 'lucide-react';

interface SocialPredictionCardProps {
    market: Market;
    onBet: (marketId: number, side: 'A' | 'B') => void;
}

export const SocialPredictionCard: React.FC<SocialPredictionCardProps> = ({ market, onBet }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const { socialContent } = market;
    const { getMarketState, getBetsByMarket } = useBettingStore();

    // Prevent hydration mismatch
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Get local market state (bets placed by users) - only after mount
    const marketState = isMounted ? getMarketState(market.id) : undefined;
    const userBetsOnMarket = isMounted ? getBetsByMarket(market.id) : [];
    const hasBets = userBetsOnMarket.length > 0 || (marketState && (marketState.totalYesBets > 0 || marketState.totalNoBets > 0));

    // Calculate odds based on local state or defaults
    const totalYes = marketState?.totalYesBets || 0;
    const totalNo = marketState?.totalNoBets || 0;
    const totalPool = totalYes + totalNo;

    const yesPercent = totalPool > 0 ? Math.round((totalYes / totalPool) * 100) : 50;
    const noPercent = totalPool > 0 ? Math.round((totalNo / totalPool) * 100) : 50;

    useEffect(() => {
        const updateTime = () => {
            setTimeLeft(getTimeRemaining(market.endTime));
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, [market.endTime]);

    const isEnded = market.endTime < Date.now();
    const isResolved = market.resolved;

    const PlatformIcon = socialContent.platform === 'twitter' ? Twitter : Instagram;
    const StatIcon = socialContent.type === 'tweet' ? Heart : Eye;

    // Share to Twitter
    const shareToTwitter = () => {
        const text = encodeURIComponent(
            `🎯 Check out this prediction on @AttentionRoulette!\n\n"${market.question}"\n\n${hasBets ? `Currently: YES ${yesPercent}% | NO ${noPercent}%` : 'Be the first to predict!'}\n\n#AttentionRoulette #Crypto #Web3`
        );
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'width=550,height=420');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass glass-hover rounded-4xl overflow-hidden relative"
        >
            {/* Header with Status */}
            <div className="p-6 pb-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        {!isEnded && !isResolved && (
                            <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-600"></span>
                                </span>
                                LIVE
                            </div>
                        )}
                        {isResolved && (
                            <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full">
                                RESOLVED
                            </div>
                        )}
                        <div className="text-[10px] font-bold text-muted bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                            <Clock size={12} className="text-primary" /> {timeLeft}
                        </div>
                    </div>
                    {hasBets && (
                        <div className="text-[10px] font-bold text-muted flex items-center gap-1">
                            <Users size={12} className="text-primary" />
                            {userBetsOnMarket.length} bets
                        </div>
                    )}
                </div>

                {/* Prediction Question */}
                <h3 className="text-lg md:text-xl font-bold text-white mb-4 leading-tight">
                    {market.question}
                </h3>
            </div>

            {/* Social Content Preview */}
            <div className="border-y border-white/5">
                <div className="relative aspect-[16/9] overflow-hidden">
                    {socialContent.imageUrl && (
                        <img
                            src={socialContent.imageUrl}
                            alt={socialContent.content}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                        {/* Author Info */}
                        <div className="flex items-center gap-3">
                            <img
                                src={socialContent.avatar}
                                alt={socialContent.author}
                                className="w-12 h-12 rounded-full border-2 border-white/20 shadow-lg"
                            />
                            <div>
                                <div className="text-white font-bold text-sm">{socialContent.author}</div>
                                <div className="text-white/60 text-xs flex items-center gap-1">
                                    <PlatformIcon size={12} />
                                    {socialContent.handle}
                                </div>
                            </div>
                        </div>

                        {/* Content Text */}
                        <div className="space-y-2">
                            <p className="text-white text-sm font-medium line-clamp-2">
                                {socialContent.content}
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                                    <StatIcon size={14} className={socialContent.type === 'tweet' ? 'text-pink-500 fill-pink-500' : 'text-primary'} />
                                    <span className="text-white text-xs font-bold">
                                        {formatSocialStats(socialContent)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action bar */}
                <div className="bg-black/30 backdrop-blur-md p-3 flex items-center justify-between border-t border-white/5">
                    <div className="flex items-center gap-2 text-xs text-muted">
                        <PlatformIcon size={14} className="text-[#1DA1F2]" />
                        <span>{socialContent.platform === 'twitter' ? 'Twitter/X' : socialContent.platform}</span>
                    </div>
                    <button
                        onClick={shareToTwitter}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border border-[#1DA1F2]/30 rounded-lg text-[#1DA1F2] text-xs font-bold transition-all"
                    >
                        <Share2 size={12} />
                        Share
                    </button>
                </div>
            </div>

            {/* YES/NO Betting Section */}
            <div className="p-6 pt-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* YES Button */}
                    <button
                        onClick={() => !isEnded && !isResolved && onBet(market.id, 'A')}
                        disabled={isEnded || isResolved}
                        className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${isResolved && market.outcome
                            ? 'border-green-500 bg-green-500/10'
                            : isEnded || isResolved
                                ? 'border-white/5 bg-white/[0.02] opacity-50 cursor-not-allowed'
                                : 'border-green-500/30 bg-green-500/5 hover:bg-green-500/10 hover:border-green-500/50 cursor-pointer hover:scale-[1.02]'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl font-black text-white">YES</span>
                            {isResolved && market.outcome && (
                                <CheckCircle2 size={20} className="text-green-500" />
                            )}
                        </div>

                        {/* Show percentage only if there are bets */}
                        {hasBets ? (
                            <>
                                <div className="text-3xl font-black text-green-500 mb-1">{yesPercent}%</div>
                                <div className="text-xs text-muted font-bold">
                                    {totalYes.toFixed(2)} MON
                                </div>
                            </>
                        ) : (
                            <div className="text-sm text-muted font-bold py-2">
                                Click to predict YES
                            </div>
                        )}
                    </button>

                    {/* NO Button */}
                    <button
                        onClick={() => !isEnded && !isResolved && onBet(market.id, 'B')}
                        disabled={isEnded || isResolved}
                        className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${isResolved && !market.outcome
                            ? 'border-red-500 bg-red-500/10'
                            : isEnded || isResolved
                                ? 'border-white/5 bg-white/[0.02] opacity-50 cursor-not-allowed'
                                : 'border-red-500/30 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/50 cursor-pointer hover:scale-[1.02]'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl font-black text-white">NO</span>
                            {isResolved && !market.outcome && (
                                <CheckCircle2 size={20} className="text-red-500" />
                            )}
                        </div>

                        {/* Show percentage only if there are bets */}
                        {hasBets ? (
                            <>
                                <div className="text-3xl font-black text-red-500 mb-1">{noPercent}%</div>
                                <div className="text-xs text-muted font-bold">
                                    {totalNo.toFixed(2)} MON
                                </div>
                            </>
                        ) : (
                            <div className="text-sm text-muted font-bold py-2">
                                Click to predict NO
                            </div>
                        )}
                    </button>
                </div>

                {/* Pool Distribution Bar - Only show if there are bets */}
                {hasBets && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-muted">
                            <span>YES Pool ({yesPercent}%)</span>
                            <span>NO Pool ({noPercent}%)</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${yesPercent}%` }}
                                transition={{ duration: 0.5 }}
                                className="h-full bg-gradient-to-r from-green-500 to-green-400"
                            />
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${noPercent}%` }}
                                transition={{ duration: 0.5 }}
                                className="h-full bg-gradient-to-l from-red-500 to-red-400"
                            />
                        </div>
                        <div className="text-center text-[10px] text-muted">
                            Total Pool: {totalPool.toFixed(2)} MON
                        </div>
                    </div>
                )}

                {/* No bets message */}
                {!hasBets && (
                    <div className="text-center py-3 bg-white/[0.02] rounded-xl border border-white/5">
                        <p className="text-xs text-muted">
                            🎯 Be the first to make a prediction!
                        </p>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-muted">
                    <span className="font-mono">Market #{market.id}</span>
                    {isResolved && (
                        <span className="font-bold text-primary">
                            Winner: {market.outcome ? 'YES' : 'NO'}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
