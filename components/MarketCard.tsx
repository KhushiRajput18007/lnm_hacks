"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tweet } from 'react-tweet';
import { Market } from '@/lib/data';
import { Heart, Eye, Clock, Bot, TrendingUp, Users } from 'lucide-react';
import { AIAnalysis } from '@/components/AIAnalysis';

interface MarketCardProps {
    market: Market;
    onBet: (marketId: number, side: 'A' | 'B') => void;
}

export const MarketCard: React.FC<MarketCardProps> = ({ market, onBet }) => {
    const [timeLeft] = useState(60);
    const [showAI, setShowAI] = useState(false);

    const totalPool = market.totalPoolA + market.totalPoolB;
    const percentA = Math.round((market.totalPoolA / totalPool) * 100);
    const percentB = 100 - percentA;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass glass-hover rounded-4xl p-6 relative overflow-hidden group/main"
        >
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-50"></div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-600"></span>
                        </span>
                        LIVE
                    </div>
                    <div className="text-[10px] font-bold text-muted bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                        <Clock size={12} className="text-primary" /> {timeLeft}m left
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-[10px] font-bold text-muted flex items-center gap-1">
                        <Users size={12} /> {(totalPool * 12).toLocaleString('en-US')} Participants
                    </div>
                </div>
            </div>

            <h3 className="text-lg md:text-xl font-bold text-white mb-6 leading-tight tracking-tight">
                {market.question}
            </h3>

            {/* Options Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 relative">
                {/* VS Badge */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="w-10 h-10 rounded-full bg-background border border-white/10 flex items-center justify-center shadow-2xl">
                        <span className="text-[10px] font-black text-muted italic">VS</span>
                    </div>
                </div>

                {/* Option A */}
                <div
                    onClick={() => onBet(market.id, 'A')}
                    className="relative aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer group/card border border-white/5 hover:border-primary/50 transition-all duration-500"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                    {market.optionA.imageUrl && (
                        <img
                            src={market.optionA.imageUrl}
                            className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover/card:grayscale-0 group-hover/card:scale-110 transition-all duration-700"
                        />
                    )}

                    <div className="relative z-20 h-full p-4 flex flex-col justify-between">
                        <div className="flex items-center gap-2">
                            <img src={market.optionA.avatar} className="w-8 h-8 rounded-full border border-white/20 shadow-lg" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-white leading-tight">{market.optionA.author}</span>
                                <span className="text-[8px] text-white/60 font-medium leading-tight">{market.optionA.handle}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-white/90 font-bold text-xs bg-black/40 backdrop-blur-md rounded-lg px-2 py-1.5 border border-white/10 w-fit">
                                {market.optionA.type === 'tweet' ? <Heart size={12} className="text-pink-500 fill-pink-500" /> : <Eye size={12} className="text-primary" />}
                                {market.optionA.currentStats.toLocaleString('en-US')}
                            </div>
                            <div className="text-2xl font-black text-white group-hover/card:text-primary transition-colors">A</div>
                        </div>
                    </div>
                </div>

                {/* Option B */}
                <div
                    onClick={() => onBet(market.id, 'B')}
                    className="relative aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer group/card border border-white/5 hover:border-secondary/50 transition-all duration-500"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                    {market.optionB.imageUrl && (
                        <img
                            src={market.optionB.imageUrl}
                            className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover/card:grayscale-0 group-hover/card:scale-110 transition-all duration-700"
                        />
                    )}

                    <div className="relative z-20 h-full p-4 flex flex-col justify-between items-end text-right">
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-white leading-tight">{market.optionB.author}</span>
                                <span className="text-[8px] text-white/60 font-medium leading-tight">{market.optionB.handle}</span>
                            </div>
                            <img src={market.optionB.avatar} className="w-8 h-8 rounded-full border border-white/20 shadow-lg" />
                        </div>

                        <div className="space-y-2 flex flex-col items-end">
                            <div className="flex items-center gap-1.5 text-white/90 font-bold text-xs bg-black/40 backdrop-blur-md rounded-lg px-2 py-1.5 border border-white/10 w-fit">
                                {market.optionB.type === 'tweet' ? <Heart size={12} className="text-pink-500 fill-pink-500" /> : <Eye size={12} className="text-primary" />}
                                {market.optionB.currentStats.toLocaleString('en-US')}
                            </div>
                            <div className="text-2xl font-black text-white group-hover/card:text-secondary transition-colors">B</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pool Stats */}
            <div className="space-y-3 mb-6">
                <div className="flex justify-between items-end px-1">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Pool A</span>
                        <span className="text-sm font-black text-white">{percentA}%</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Pool B</span>
                        <span className="text-sm font-black text-white">{percentB}%</span>
                    </div>
                </div>

                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex p-0.5 border border-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentA}%` }}
                        className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                    />
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentB}%` }}
                        className="h-full bg-gradient-to-l from-secondary to-secondary/60 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                    />
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <button
                    onClick={() => setShowAI(!showAI)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold transition-all border ${showAI
                        ? 'bg-primary/10 border-primary/50 text-primary shadow-lg shadow-primary/5'
                        : 'bg-white/[0.03] border-white/10 text-muted hover:text-white hover:bg-white/10'
                        }`}
                >
                    <Bot size={14} /> {showAI ? 'Hide Analysis' : 'Ask Noah AI'}
                </button>

                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted">
                    <TrendingUp size={14} className="text-green-500" />
                    +12.4% Vol 24h
                </div>
            </div>

            {/* AI Section */}
            <AnimatePresence>
                {showAI && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t border-white/5"
                    >
                        <AIAnalysis
                            marketQuestion={market.question}
                            optionA={market.optionA.handle}
                            optionB={market.optionB.handle}
                            statsA={market.optionA.currentStats}
                            statsB={market.optionB.currentStats}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

