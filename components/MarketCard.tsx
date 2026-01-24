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
            whileTap={{ scale: 0.995 }}
            className="bg-[#151519]/80 backdrop-blur-md border border-white/5 shadow-xl transition-all duration-300 hover:border-white/10 hover:bg-[#1A1A1F]/90 hover:shadow-2xl hover:shadow-indigo-500/10 transform hover:-translate-y-1 rounded-[2rem] p-5 mb-6 relative overflow-hidden group"
        >
            {/* Header Badge */}
            <div className="flex justify-between items-start mb-5 relative z-10">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                        </span>
                        LIVE
                    </span>
                    <span className="text-xs text-gray-500 font-mono flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-full">
                        <Clock size={12} /> {timeLeft}m left
                    </span>
                </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-6 leading-tight tracking-tight pr-4">
                {market.question}
            </h3>

            {/* Side-by-Side Cards */}
            <div className="flex gap-3 min-h-[14rem] mb-6 relative z-10">
                {/* Option A */}
                <div
                    onClick={() => onBet(market.id, 'A')}
                    className="flex-1 relative cursor-pointer group/card rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/50 transition-all duration-300 active:scale-[0.98]"
                >
                    {market.optionA.tweetId ? (
                        <div className="w-full h-full overflow-y-auto no-scrollbar -mt-2 opacity-90 group-hover/card:opacity-100 transition-opacity">
                            <Tweet id={market.optionA.tweetId} />
                        </div>
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 z-10" />
                            {market.optionA.imageUrl && (
                                <img src={market.optionA.imageUrl} className="absolute inset-0 w-full h-full object-cover grayscale-[30%] group-hover/card:grayscale-0 group-hover/card:scale-105 transition-all duration-700 ease-out" />
                            )}

                            <div className="relative z-20 h-full flex flex-col justify-between p-4">
                                <div className="flex items-center gap-2">
                                    <img src={market.optionA.avatar} className="w-8 h-8 rounded-full ring-2 ring-indigo-500/50 shadow-lg" />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-white leading-none">{market.optionA.author}</span>
                                        <span className="text-[10px] text-gray-300 font-medium leading-none mt-1">{market.optionA.handle}</span>
                                    </div>
                                </div>

                                <div className="text-center transform translate-y-2 group-hover/card:translate-y-0 transition-transform">
                                    <div className="text-4xl font-black text-white/5 drop-shadow-xl absolute inset-0 flex items-center justify-center -z-10 select-none">A</div>
                                </div>

                                <div className="bg-black/40 backdrop-blur-md rounded-xl p-2.5 text-center border border-white/10 group-hover/card:bg-indigo-500/20 group-hover/card:border-indigo-500/30 transition-colors">
                                    <div className="flex items-center justify-center gap-2 text-xs text-white font-bold">
                                        {market.optionA.type === 'tweet' ? <Heart size={12} className="text-pink-500 fill-pink-500" /> : <Eye size={12} className="text-blue-400" />}
                                        {market.optionA.currentStats.toLocaleString('en-US')}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* VS Divider */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
                    <div className="bg-[#0D0D0F] rounded-full w-10 h-10 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                        <span className="text-[10px] font-black text-gray-600 italic">VS</span>
                    </div>
                </div>

                {/* Option B */}
                <div
                    onClick={() => onBet(market.id, 'B')}
                    className="flex-1 relative cursor-pointer group/card rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/50 transition-all duration-300 active:scale-[0.98]"
                >
                    {market.optionB.tweetId ? (
                        <div className="w-full h-full overflow-y-auto no-scrollbar -mt-2 opacity-90 group-hover/card:opacity-100 transition-opacity">
                            <Tweet id={market.optionB.tweetId} />
                        </div>
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 z-10" />
                            {market.optionB.imageUrl && (
                                <img src={market.optionB.imageUrl} className="absolute inset-0 w-full h-full object-cover grayscale-[30%] group-hover/card:grayscale-0 group-hover/card:scale-105 transition-all duration-700 ease-out" />
                            )}

                            <div className="relative z-20 h-full flex flex-col justify-between p-4">
                                <div className="flex items-center gap-2">
                                    <img src={market.optionB.avatar} className="w-8 h-8 rounded-full ring-2 ring-purple-500/50 shadow-lg" />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-white leading-none">{market.optionB.author}</span>
                                        <span className="text-[10px] text-gray-300 font-medium leading-none mt-1">{market.optionB.handle}</span>
                                    </div>
                                </div>

                                <div className="text-center transform translate-y-2 group-hover/card:translate-y-0 transition-transform">
                                    <div className="text-4xl font-black text-white/5 drop-shadow-xl absolute inset-0 flex items-center justify-center -z-10 select-none">B</div>
                                </div>

                                <div className="bg-black/40 backdrop-blur-md rounded-xl p-2.5 text-center border border-white/10 group-hover/card:bg-purple-500/20 group-hover/card:border-purple-500/30 transition-colors">
                                    <div className="flex items-center justify-center gap-2 text-xs text-white font-bold">
                                        {market.optionB.type === 'tweet' ? <Heart size={12} className="text-pink-500 fill-pink-500" /> : <Eye size={12} className="text-blue-400" />}
                                        {market.optionB.currentStats.toLocaleString('en-US')}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Live Pool Bar */}
            <div className="w-full bg-white/5 rounded-full h-3 mb-3 overflow-hidden flex relative border border-white/5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentA}%` }}
                    className="bg-gradient-to-r from-indigo-600 to-indigo-400 h-full shadow-[0_0_15px_rgba(99,102,241,0.4)] relative"
                >
                    <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/50" />
                </motion.div>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentB}%` }}
                    className="bg-gradient-to-l from-purple-600 to-purple-400 h-full shadow-[0_0_15px_rgba(168,85,247,0.4)] relative"
                >
                    <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/50" />
                </motion.div>
            </div>

            <div className="flex justify-between items-center mb-1">
                <div className="flex justify-between text-[11px] font-bold px-1 gap-4 w-full">
                    <span className="text-indigo-400 drop-shadow-sm">{percentA}% Pool A</span>
                    <span className="text-purple-400 drop-shadow-sm">{percentB}% Pool B</span>
                </div>
            </div>

            <div className="absolute bottom-4 right-5">
                <button
                    onClick={(e) => { e.stopPropagation(); setShowAI(!showAI); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${showAI ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
                >
                    <Bot size={12} /> {showAI ? 'Hide Noah' : 'Ask Noah AI'}
                </button>
            </div>

            {/* AI Analysis Section */}
            <AnimatePresence>
                {showAI && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-[#111115] border border-white/5 rounded-2xl p-4">
                            <AIAnalysis
                                marketQuestion={market.question}
                                optionA={market.optionA.handle}
                                optionB={market.optionB.handle}
                                statsA={market.optionA.currentStats}
                                statsB={market.optionB.currentStats}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
};
