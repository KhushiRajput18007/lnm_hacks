"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Copy } from 'lucide-react';

interface ShareCardProps {
    amount: string;
    side: 'A' | 'B';
    marketQuestion: string;
}

export const ShareCard: React.FC<ShareCardProps> = ({ amount, side, marketQuestion }) => {
    return (
        <div className="w-full">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-gray-800 shadow-2xl relative overflow-hidden mb-6"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                <div className="text-center mb-6">
                    <div className="inline-block bg-accent/10 border border-accent/20 text-accent text-[10px] font-black tracking-widest px-3 py-1 rounded-full mb-3 uppercase">
                        Prediction Locked
                    </div>
                    <h3 className="text-white font-bold text-lg leading-tight mb-1">
                        {marketQuestion}
                    </h3>
                </div>

                <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="text-right">
                        <div className="text-xs text-gray-500 font-bold uppercase">I Bet</div>
                        <div className="text-2xl font-black text-white">{amount} ETH</div>
                    </div>
                    <div className="h-10 w-px bg-gray-800"></div>
                    <div className="text-left">
                        <div className="text-xs text-gray-500 font-bold uppercase">On Option</div>
                        <div className={`text-2xl font-black ${side === 'A' ? 'text-primary' : 'text-secondary'}`}>
                            {side}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <span className="text-white text-xs">👀</span>
                        </div>
                        <div className="text-left">
                            <div className="text-[10px] text-gray-500 font-bold uppercase">Attention</div>
                            <div className="text-xs font-black text-white tracking-tighter">ROULETTE</div>
                        </div>
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">
                        #AGIBet
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">
                    <Share2 size={16} /> Share to X
                </button>
                <button className="flex items-center justify-center gap-2 bg-surface text-white font-bold py-3 rounded-xl border border-gray-700 hover:bg-gray-800 transition-colors">
                    <Copy size={16} /> Copy
                </button>
            </div>
        </div>
    );
};
