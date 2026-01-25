"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Market, calculateOdds, getTimeRemaining, getTotalVolume } from '@/lib/data';
import { Clock, TrendingUp, Users, CheckCircle2, XCircle } from 'lucide-react';

interface PredictionMarketCardProps {
    market: Market;
    onBet: (marketId: number, side: 'A' | 'B') => void;
}

export const PredictionMarketCard: React.FC<PredictionMarketCardProps> = ({ market, onBet }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const odds = calculateOdds(market);
    const totalVolume = getTotalVolume(market);

    useEffect(() => {
        const updateTime = () => {
            setTimeLeft(getTimeRemaining(market.endTime));
        };
        updateTime();
        const interval = setInterval(updateTime, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [market.endTime]);

    const isEnded = market.endTime < Date.now();
    const isResolved = market.resolved;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass glass-hover rounded-4xl p-6 relative overflow-hidden"
        >
            {/* Status Badge */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    {!isEnded && !isResolved && (
                        <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-600"></span>
                            </span>
                            ACTIVE
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
                <div className="text-[10px] font-bold text-muted flex items-center gap-1">
                    <TrendingUp size={12} className="text-green-500" />
                    {totalVolume.toFixed(2)} MON
                </div>
            </div>

            {/* Question */}
            <h3 className="text-lg md:text-xl font-bold text-white mb-6 leading-tight tracking-tight">
                {market.question}
            </h3>

            {/* YES/NO Options */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* YES Option */}
                <button
                    onClick={() => !isEnded && !isResolved && onBet(market.id, 'A')}
                    disabled={isEnded || isResolved}
                    className={`relative aspect-[4/3] rounded-3xl overflow-hidden group/card border transition-all duration-500 ${isResolved && market.outcome
                            ? 'border-green-500/50 bg-green-500/10'
                            : isEnded || isResolved
                                ? 'border-white/5 opacity-50 cursor-not-allowed'
                                : 'border-white/10 hover:border-primary/50 cursor-pointer'
                        }`}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent" />
                    <div className="relative z-10 h-full p-4 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-3xl font-black text-white">YES</span>
                            {isResolved && market.outcome && (
                                <CheckCircle2 size={24} className="text-green-500" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl font-black text-primary">{odds.yesOdds}%</div>
                            <div className="text-xs text-muted font-bold">
                                {market.totalYesStake.toFixed(2)} MON
                            </div>
                        </div>
                    </div>
                    {!isEnded && !isResolved && (
                        <div className="absolute inset-0 bg-primary/0 group-hover/card:bg-primary/5 transition-all duration-500" />
                    )}
                </button>

                {/* NO Option */}
                <button
                    onClick={() => !isEnded && !isResolved && onBet(market.id, 'B')}
                    disabled={isEnded || isResolved}
                    className={`relative aspect-[4/3] rounded-3xl overflow-hidden group/card border transition-all duration-500 ${isResolved && !market.outcome
                            ? 'border-red-500/50 bg-red-500/10'
                            : isEnded || isResolved
                                ? 'border-white/5 opacity-50 cursor-not-allowed'
                                : 'border-white/10 hover:border-secondary/50 cursor-pointer'
                        }`}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent" />
                    <div className="relative z-10 h-full p-4 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-3xl font-black text-white">NO</span>
                            {isResolved && !market.outcome && (
                                <CheckCircle2 size={24} className="text-red-500" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl font-black text-secondary">{odds.noOdds}%</div>
                            <div className="text-xs text-muted font-bold">
                                {market.totalNoStake.toFixed(2)} MON
                            </div>
                        </div>
                    </div>
                    {!isEnded && !isResolved && (
                        <div className="absolute inset-0 bg-secondary/0 group-hover/card:bg-secondary/5 transition-all duration-500" />
                    )}
                </button>
            </div>

            {/* Pool Distribution Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-muted px-1">
                    <span>YES Pool</span>
                    <span>NO Pool</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex border border-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${odds.yesOdds}%` }}
                        className="h-full bg-gradient-to-r from-green-500 to-green-400 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                    />
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${odds.noOdds}%` }}
                        className="h-full bg-gradient-to-l from-red-500 to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                    />
                </div>
            </div>

            {/* Market Info */}
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-muted">
                <span className="font-mono">Market #{market.id}</span>
                {isResolved && (
                    <span className="font-bold text-primary">
                        Winner: {market.outcome ? 'YES' : 'NO'}
                    </span>
                )}
            </div>
        </motion.div>
    );
};
