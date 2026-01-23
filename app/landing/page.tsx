"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Trophy, Shield } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center max-w-md mx-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold mb-6 mx-auto shadow-2xl shadow-purple-500/20">
                    AR
                </div>
            </motion.div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
                Attention <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Roulette</span>
            </h1>
            <p className="text-zinc-400 mb-8 max-w-xs mx-auto">
                The viral prediction market for the Monad ecosystem. Bet on attention.
            </p>

            <div className="grid grid-cols-1 gap-3 w-full max-w-xs mb-8">
                <Feature icon={<Zap size={16} className="text-yellow-400" />} text="Instant settlements on Monad" />
                <Feature icon={<Trophy size={16} className="text-purple-400" />} text="Climb the leaderboard" />
                <Feature icon={<Shield size={16} className="text-green-400" />} text="Provably fair contracts" />
            </div>

            <Link
                href="/feed"
                className="w-full max-w-xs bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
            >
                Launch App <ArrowRight size={18} />
            </Link>

            <p className="text-[10px] text-zinc-600 mt-6 font-mono">
                v0.1.0 • Monad Testnet
            </p>
        </div>
    );
}

function Feature({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 p-3 rounded-lg text-sm text-zinc-300">
            {icon}
            {text}
        </div>
    )
}
