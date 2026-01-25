"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Check, Twitter } from 'lucide-react';

interface ShareCardProps {
    amount: string;
    side: 'A' | 'B';
    marketQuestion: string;
    isWin?: boolean;
    winAmount?: string;
    txHash?: string;
}

export const ShareCard: React.FC<ShareCardProps> = ({
    amount,
    side,
    marketQuestion,
    isWin,
    winAmount,
    txHash
}) => {
    const [copied, setCopied] = React.useState(false);

    // Generate share text
    const getShareText = () => {
        if (isWin !== undefined) {
            if (isWin) {
                return `🎉 I just WON ${winAmount || amount} on @AttentionRoulette!\n\n"${marketQuestion}"\n\nI bet on ${side === 'A' ? 'YES' : 'NO'} and crushed it! 🚀\n\n#AttentionRoulette #Crypto #Web3 #PredictionMarket`;
            } else {
                return `😅 I lost ${amount} on @AttentionRoulette betting on "${marketQuestion}"\n\nBetter luck next time! The game continues 🎰\n\n#AttentionRoulette #Crypto #Web3`;
            }
        }
        return `🎯 I just placed a ${amount} ETH bet on @AttentionRoulette!\n\n"${marketQuestion}"\n\nI'm betting ${side === 'A' ? 'YES' : 'NO'}! LFG! 🔥\n\n#AttentionRoulette #Crypto #Web3 #PredictionMarket`;
    };

    // Share to Twitter/X
    const shareToTwitter = () => {
        const text = encodeURIComponent(getShareText());
        const url = encodeURIComponent(window.location.href);
        window.open(
            `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
            '_blank',
            'width=550,height=420'
        );
    };

    // Copy to clipboard
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(getShareText());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="w-full">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`p-6 rounded-2xl border shadow-2xl relative overflow-hidden mb-6 ${isWin === true
                        ? 'bg-gradient-to-br from-green-900/50 to-green-950 border-green-500/30'
                        : isWin === false
                            ? 'bg-gradient-to-br from-red-900/50 to-red-950 border-red-500/30'
                            : 'bg-gradient-to-br from-gray-900 to-black border-gray-800'
                    }`}
            >
                <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none ${isWin === true ? 'bg-green-500/30' : isWin === false ? 'bg-red-500/30' : 'bg-accent/20'
                    }`}></div>

                <div className="text-center mb-6">
                    <div className={`inline-block text-[10px] font-black tracking-widest px-3 py-1 rounded-full mb-3 uppercase ${isWin === true
                            ? 'bg-green-500/10 border border-green-500/20 text-green-500'
                            : isWin === false
                                ? 'bg-red-500/10 border border-red-500/20 text-red-500'
                                : 'bg-accent/10 border border-accent/20 text-accent'
                        }`}>
                        {isWin === true ? '🎉 Winner!' : isWin === false ? '😢 Better Luck Next Time' : 'Prediction Locked'}
                    </div>
                    <h3 className="text-white font-bold text-lg leading-tight mb-1">
                        {marketQuestion}
                    </h3>
                </div>

                <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="text-right">
                        <div className="text-xs text-gray-500 font-bold uppercase">
                            {isWin === true ? 'Won' : isWin === false ? 'Lost' : 'I Bet'}
                        </div>
                        <div className={`text-2xl font-black ${isWin === true ? 'text-green-500' : isWin === false ? 'text-red-500' : 'text-white'
                            }`}>
                            {isWin === true && winAmount ? winAmount : amount} ETH
                        </div>
                    </div>
                    <div className="h-10 w-px bg-gray-800"></div>
                    <div className="text-left">
                        <div className="text-xs text-gray-500 font-bold uppercase">On Option</div>
                        <div className={`text-2xl font-black ${side === 'A' ? 'text-primary' : 'text-secondary'}`}>
                            {side === 'A' ? 'YES' : 'NO'}
                        </div>
                    </div>
                </div>

                {txHash && (
                    <div className="text-center mb-4">
                        <p className="text-xs text-gray-500 font-mono">
                            TX: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                        </p>
                    </div>
                )}

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
                <button
                    onClick={shareToTwitter}
                    className="flex items-center justify-center gap-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-bold py-3 rounded-xl transition-colors"
                >
                    <Twitter size={16} /> Share to X
                </button>
                <button
                    onClick={copyToClipboard}
                    className="flex items-center justify-center gap-2 bg-surface text-white font-bold py-3 rounded-xl border border-gray-700 hover:bg-gray-800 transition-colors"
                >
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
        </div>
    );
};

// Standalone share buttons for use anywhere
export const ShareButtons: React.FC<{
    message: string;
    className?: string;
}> = ({ message, className = '' }) => {
    const [copied, setCopied] = React.useState(false);

    const shareToTwitter = () => {
        const text = encodeURIComponent(message);
        window.open(
            `https://twitter.com/intent/tweet?text=${text}`,
            '_blank',
            'width=550,height=420'
        );
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(message);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className={`flex gap-2 ${className}`}>
            <button
                onClick={shareToTwitter}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border border-[#1DA1F2]/30 rounded-lg text-[#1DA1F2] text-xs font-bold transition-all"
            >
                <Twitter size={12} /> Share
            </button>
            <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/70 text-xs font-bold transition-all"
            >
                {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
            </button>
        </div>
    );
};
