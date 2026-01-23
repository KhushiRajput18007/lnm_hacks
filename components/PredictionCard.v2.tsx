"use client";

import { motion } from "framer-motion";
import { useBetStore } from "@/app/hooks/useBetStore";
import { generateShareCaption } from "@/lib/ai/predictionAI";
import { ShareModal } from "@/components/ShareModal";
import { useState } from "react";
import { Share2, Clock, Smartphone } from "lucide-react";
import { theme } from "@/styles/theme";

interface PredictionCardProps {
    id: string;
    title: string;
    yesPool: number;
    noPool: number;
    expiresIn: string;
}

export function PredictionCardV2({ id, title, yesPool, noPool, expiresIn }: PredictionCardProps) {
    const { openBetModal } = useBetStore();
    const [isShareOpen, setShareOpen] = useState(false);
    const [shareCaption, setShareCaption] = useState("");

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        const caption = generateShareCaption("WIN");
        setShareCaption(caption);
        setShareOpen(true);
    };

    const totalPool = yesPool + noPool || 1;
    const yesPercent = (yesPool / totalPool) * 100;
    const noPercent = (noPool / totalPool) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            className="bg-zinc-900 rounded-[16px] p-4 border border-zinc-800 shadow-xl mb-4 relative overflow-hidden group hover:border-zinc-700 transition-colors"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]">🦄</div>
                    <span className="text-xs text-zinc-500 font-medium">@dwr.eth</span>
                </div>
                <div className="flex gap-1">
                    <div className="bg-yellow-500/10 text-yellow-500 text-[9px] font-bold px-1.5 py-0.5 rounded border border-yellow-500/20">TESTNET</div>
                </div>
            </div>

            {/* Question */}
            <h3 className="text-lg font-bold text-white mb-4 leading-tight min-h-[3rem] line-clamp-2">
                {title}
            </h3>

            {/* Stats */}
            <div className="flex justify-between text-xs text-zinc-400 mb-2 font-mono">
                <span className="flex items-center gap-1"><Clock size={12} /> {expiresIn}</span>
                <span className="text-zinc-500">{totalPool.toFixed(2)} TB</span>
            </div>

            {/* Pool Bar */}
            <div className="h-4 bg-zinc-800 rounded-full flex overflow-hidden mb-6 relative">
                <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${yesPercent}%` }} />
                <div className="bg-pink-500 h-full transition-all duration-500" style={{ width: `${noPercent}%` }} />

                {/* Percent Labels */}
                <span className="absolute left-2 top-0.5 text-[9px] font-bold text-black/60 mix-blend-overlay">{yesPercent.toFixed(0)}% YES</span>
                <span className="absolute right-2 top-0.5 text-[9px] font-bold text-black/60 mix-blend-overlay">{noPercent.toFixed(0)}% NO</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={() => openBetModal(id, "YES")}
                    className="flex-1 bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl transition-colors text-sm"
                >
                    Bet YES
                </button>
                <button
                    onClick={() => openBetModal(id, "NO")}
                    className="flex-1 bg-pink-500 hover:bg-pink-400 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                >
                    Bet NO
                </button>
                <button
                    onClick={handleShare}
                    className="w-12 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-400 hover:text-white transition-colors"
                >
                    <Share2 size={18} />
                </button>
            </div>

            <ShareModal
                isOpen={isShareOpen}
                onClose={() => setShareOpen(false)}
                caption={shareCaption}
            />
        </motion.div>
    );
}
