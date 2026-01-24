"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';

interface AIAnalysisProps {
    marketQuestion: string;
    optionA: string;
    optionB: string;
    statsA: number;
    statsB: number;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ marketQuestion, optionA, optionB, statsA, statsB }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [prediction, setPrediction] = useState<{ pick: 'A' | 'B'; confidence: number; reasoning: string } | null>(null);

    useEffect(() => {
        // Simulate AI "thinking" time
        const timer = setTimeout(() => {
            const isAWinning = statsA > statsB;
            // Introduce some "AI" variance - sometimes it predicts the underdog if close
            const gap = Math.abs(statsA - statsB) / ((statsA + statsB) || 1);
            const pick = gap < 0.1 ? (Math.random() > 0.5 ? 'A' : 'B') : (isAWinning ? 'A' : 'B');
            const confidence = 65 + Math.floor(Math.random() * 30); // 65-95%

            const reasoningList = [
                "Sentiment analysis detects higher viral velocity on this option.",
                "Historical data suggests shorter content performs better in this timeframe.",
                "Engagement ratios (Likes/Views) are significantly higher here.",
                "The creator's momentum score is currently peaking.",
                "Cross-platform mentions are spiking for this option."
            ];

            setPrediction({
                pick,
                confidence,
                reasoning: reasoningList[Math.floor(Math.random() * reasoningList.length)]
            });
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [statsA, statsB]);

    return (
        <div className="bg-black/40 rounded-xl p-4 border border-accent/20 mt-4 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                    <Bot size={14} className="text-accent" />
                </div>
                <span className="text-xs font-bold text-accent tracking-widest uppercase">Noah AI Analysis</span>
            </div>

            {isLoading ? (
                <div className="space-y-2 animate-pulse">
                    <div className="h-3 bg-gray-800 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs">Prediction:</span>
                            <span className={`font-bold ${prediction?.pick === 'A' ? 'text-primary' : 'text-secondary'}`}>
                                Option {prediction?.pick}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-accent text-xs font-mono">
                            <Sparkles size={10} />
                            {prediction?.confidence}% Confidence
                        </div>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed italic border-l-2 border-accent/50 pl-3">
                        "{prediction?.reasoning}"
                    </p>
                </motion.div>
            )}
        </div>
    );
};
