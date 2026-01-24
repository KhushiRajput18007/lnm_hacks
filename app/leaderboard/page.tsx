"use client";

import React from 'react';
import { Trophy, ArrowLeft, Crown } from 'lucide-react';
import Link from 'next/link';

// Mock data for leaderboard
const LEADERBOARD_DATA = [
    { rank: 1, address: '0x1A2...3B4C', balance: '12.5 ETH', wins: 42, winRate: '78%' },
    { rank: 2, address: '0x7F2...9D0E', balance: '8.2 ETH', wins: 31, winRate: '65%' },
    { rank: 3, address: '0x3C4...1A2B', balance: '5.7 ETH', wins: 24, winRate: '52%' },
    { rank: 4, address: '0x9E1...5F6G', balance: '3.1 ETH', wins: 18, winRate: '48%' },
    { rank: 5, address: '0x2D3...8H9I', balance: '1.4 ETH', wins: 12, winRate: '41%' },
];

export default function LeaderboardPage() {
    return (
        <div className="max-w-md mx-auto min-h-screen bg-background pb-20 relative px-4 pt-6">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/">
                    <button className="bg-surface p-2 rounded-full border border-gray-800 hover:border-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                </Link>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Trophy className="text-yellow-500" /> Leaderboard
                </h1>
            </div>

            <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-2xl p-6 border border-yellow-500/20 mb-8 relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center text-center">
                    <Crown size={48} className="text-yellow-400 mb-2 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                    <div className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-1">Top Bettor</div>
                    <div className="text-2xl font-mono font-bold text-white mb-1">0x1A2...3B4C</div>
                    <div className="text-sm text-yellow-200">12.5 ETH Won</div>
                </div>
            </div>

            <div className="space-y-3">
                {LEADERBOARD_DATA.map((player) => (
                    <div key={player.rank} className="bg-surface rounded-xl p-4 flex items-center justify-between border border-gray-800">
                        <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                ${player.rank === 1 ? 'bg-yellow-500 text-black' :
                                    player.rank === 2 ? 'bg-gray-400 text-black' :
                                        player.rank === 3 ? 'bg-orange-600 text-black' : 'bg-gray-800 text-gray-400'}
              `}>
                                {player.rank}
                            </div>
                            <div>
                                <div className="font-mono text-sm font-bold">{player.address}</div>
                                <div className="text-xs text-gray-500">{player.wins} Wins</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold text-primary">{player.balance}</div>
                            <div className="text-xs text-green-500">{player.winRate}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
