"use client";

import { useState } from "react";
import { useBetStore } from "@/app/hooks/useBetStore";
import { generateShareCaption } from "@/lib/ai/predictionAI";
import { ShareModal } from "./ShareModal";

interface PredictionCardProps {
    id: string;
    title: string;
    yesPool: number;
    noPool: number;
    expiresIn: string;
}

export function PredictionCard({ id, title, yesPool, noPool, expiresIn }: PredictionCardProps) {
    const { openBetModal } = useBetStore();
    const [isShareOpen, setShareOpen] = useState(false);
    const [shareCaption, setShareCaption] = useState("");

    const handleShare = () => {
        const caption = generateShareCaption("WIN"); // Mocking a win state for demo sharing
        setShareCaption(caption);
        setShareOpen(true);
    };

    return (
        <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 shadow-xl mb-4 relative overflow-hidden">
            {/* Testnet Badge */}
            <div className="absolute top-2 right-2 bg-yellow-500/20 text-yellow-500 text-[10px] font-bold px-2 py-1 rounded-full border border-yellow-500/30">
                TESTNET
            </div>

            <h3 className="text-lg font-bold text-white mb-2 pr-12 leading-tight">{title}</h3>

            <div className="flex justify-between text-xs text-zinc-400 mb-4 font-mono">
                <span>Ends in {expiresIn}</span>
                <span>Pool: {(yesPool + noPool).toFixed(2)} ETH</span>
            </div>

            {/* Pools Visual */}
            <div className="h-2 bg-zinc-800 rounded-full flex overflow-hidden mb-4">
                <div className="bg-green-500 h-full" style={{ width: `${(yesPool / (yesPool + noPool || 1)) * 100}%` }} />
                <div className="bg-red-500 h-full" style={{ width: `${(noPool / (yesPool + noPool || 1)) * 100}%` }} />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                    onClick={() => openBetModal(id, "YES")}
                    className="bg-green-500/10 text-green-500 border border-green-500/50 py-3 rounded-xl font-bold hover:bg-green-500/20 transition active:scale-95"
                >
                    YES
                </button>
                <button
                    onClick={() => openBetModal(id, "NO")}
                    className="bg-red-500/10 text-red-500 border border-red-500/50 py-3 rounded-xl font-bold hover:bg-red-500/20 transition active:scale-95"
                >
                    NO
                </button>
            </div>

            <button
                onClick={handleShare}
                className="w-full py-2 text-zinc-500 text-xs font-medium hover:text-white transition"
            >
                Share Prediction 🔗
            </button>

            <ShareModal
                isOpen={isShareOpen}
                onClose={() => setShareOpen(false)}
                caption={shareCaption}
            />
        </div>
    );
}
