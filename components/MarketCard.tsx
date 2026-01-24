"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tweet } from 'react-tweet';
import { Market } from '@/lib/data';
import { Heart, Eye, Clock, Flame, Bot } from 'lucide-react';
import { AIAnalysis } from '@/components/AIAnalysis';

interface MarketCardProps {
    market: Market;
    onBet: (marketId: number, side: 'A' | 'B') => void;
}

export const MarketCard: React.FC<MarketCardProps> = ({ market, onBet }) => {
    const [timeLeft, setTimeLeft] = useState(60); // Mock countdown in minutes
    const [showAI, setShowAI] = useState(false);

    // Mock Progress Bar calculation
    const totalPool = market.totalPoolA + market.totalPoolB;
    const percentA = Math.round((market.totalPoolA / totalPool) * 100);
    const percentB = 100 - percentA;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            className="bg-surface rounded-3xl p-5 mb-6 shadow-2xl overflow-hidden relative border border-gray-800/50"
        >
            {/* Header Badge */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 bg-red-500/10 text-red-500 text-[10px] font-black tracking-wider px-2 py-1 rounded-md animate-pulse">
                        <Flame size={10} fill="currentColor" /> LIVE
                    </span>
                    <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                        <Clock size={12} /> {timeLeft}m
                    </span>
                </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-6 leading-tight">
                {market.question}
            </h3>

            {/* Side-by-Side Cards */}
            <div className="flex gap-3 min-h-[12rem] mb-6">
                {/* Option A */}
                <div
                    onClick={() => onBet(market.id, 'A')}
                    className="flex-1 relative cursor-pointer group rounded-2xl overflow-hidden border border-gray-800 hover:border-primary transition-all active:scale-95"
                >
                    {market.optionA.tweetId ? (
                        <div className="w-full h-full overflow-y-auto no-scrollbar pointer-events-none scale-90 origin-top -mt-2">
                            <Tweet id={market.optionA.tweetId} />
                        </div>
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors z-10" />
                            {market.optionA.imageUrl && (
                                <img src={market.optionA.imageUrl} className="absolute inset-0 w-full h-full object-cover" />
                            )}

                            <div className="relative z-20 h-full flex flex-col justify-between p-3">
                                <div className="flex items-center gap-2">
                                    <img src={market.optionA.avatar} className="w-6 h-6 rounded-full ring-2 ring-black" />
                                    <span className="text-[10px] text-white/80 truncate font-medium">{market.optionA.handle}</span>
                                </div>

                                <div className="text-center">
                                    <div className="text-3xl font-black text-primary drop-shadow-lg">A</div>
                                </div>

                                <div className="bg-black/50 backdrop-blur-md rounded-lg p-2 text-center">
                                    <div className="flex items-center justify-center gap-1 text-xs text-white/90 font-bold">
                                        {market.optionA.type === 'tweet' ? <Heart size={12} fill="currentColor" className="text-red-500" /> : <Eye size={12} className="text-blue-400" />}
                                        {market.optionA.currentStats.toLocaleString('en-US')}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* VS Divider */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
                    <div className="bg-black rounded-full w-8 h-8 flex items-center justify-center border border-gray-800 shadow-xl">
                        <span className="text-[10px] font-black text-gray-400 italic">VS</span>
                    </div>
                </div>

                {/* Option B */}
                <div
                    onClick={() => onBet(market.id, 'B')}
                    className="flex-1 relative cursor-pointer group rounded-2xl overflow-hidden border border-gray-800 hover:border-secondary transition-all active:scale-95"
                >
                    {market.optionB.tweetId ? (
                        <div className="w-full h-full overflow-y-auto no-scrollbar pointer-events-none scale-90 origin-top -mt-2">
                            <Tweet id={market.optionB.tweetId} />
                        </div>
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors z-10" />
                            {market.optionB.imageUrl && (
                                <img src={market.optionB.imageUrl} className="absolute inset-0 w-full h-full object-cover" />
                            )}

                            <div className="relative z-20 h-full flex flex-col justify-between p-3">
                                <div className="flex items-center gap-2">
                                    <img src={market.optionB.avatar} className="w-6 h-6 rounded-full ring-2 ring-black" />
                                    <span className="text-[10px] text-white/80 truncate font-medium">{market.optionB.handle}</span>
                                </div>

                                <div className="text-center">
                                    <div className="text-3xl font-black text-secondary drop-shadow-lg">B</div>
                                </div>

                                <div className="bg-black/50 backdrop-blur-md rounded-lg p-2 text-center">
                                    <div className="flex items-center justify-center gap-1 text-xs text-white/90 font-bold">
                                        {market.optionB.type === 'tweet' ? <Heart size={12} fill="currentColor" className="text-red-500" /> : <Eye size={12} className="text-blue-400" />}
                                        {market.optionB.currentStats.toLocaleString('en-US')}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Live Pool Bar */}
            <div className="w-full bg-gray-800/50 rounded-full h-2 mb-2 overflow-hidden flex relative">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentA}%` }}
                    className="bg-primary h-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                />
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentB}%` }}
                    className="bg-secondary h-full"
                />
            </div>
            <div className="flex justify-between items-center mb-3">
                <div className="flex justify-between text-[10px] text-gray-400 font-medium px-1 gap-4">
                    <span className="text-primary">{percentA}% Pool</span>
                    <span className="text-secondary">{percentB}% Pool</span>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); setShowAI(!showAI); }}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold transition-all border ${showAI ? 'bg-accent/10 border-accent text-accent' : 'bg-transparent border-gray-800 text-gray-500 hover:border-gray-600'}`}
                >
                    <Bot size={12} /> {showAI ? 'Hide Noah' : 'Ask Noah AI'}
                </button>
            </div>

            {/* AI Analysis Section */}
            <AnimatePresence>
                {showAI && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
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
