"use client";

import React from 'react';
import { Trophy, Crown, TrendingUp, Users } from 'lucide-react';

const LEADERBOARD_DATA = [
    { rank: 1, address: '0x1A2...3B4C', balance: '12.5 ETH', wins: 42, winRate: '78%' },
    { rank: 2, address: '0x7F2...9D0E', balance: '8.2 ETH', wins: 31, winRate: '65%' },
    { rank: 3, address: '0x3C4...1A2B', balance: '5.7 ETH', wins: 24, winRate: '52%' },
    { rank: 4, address: '0x9E1...5F6G', balance: '3.1 ETH', wins: 18, winRate: '48%' },
    { rank: 5, address: '0x2D3...8H9I', balance: '1.4 ETH', wins: 12, winRate: '41%' },
];

export default function LeaderboardPage() {
    return (
        <div className="max-w-4xl mx-auto min-h-screen pb-20 relative px-4 pt-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
                        TOP <span className="text-primary">TRADERS</span>
                    </h1>
                    <p className="text-muted font-medium">The elite of the attention economy.</p>
                </div>
                <div className="flex gap-4">
                    <div className="glass rounded-2xl px-6 py-3">
                        <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Total Players</div>
                        <div className="text-xl font-black text-white flex items-center gap-2">
                            <Users size={18} className="text-primary" /> 12,402
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative mb-12 p-1 md:p-12 rounded-5xl overflow-hidden glass group">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 blur-[100px] rounded-full translate-x-1/4 -translate-y-1/4"></div>
                
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-primary/20">
                        <Crown size={40} className="text-primary" />
                    </div>
                    <div className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3">Current Champion</div>
                    <h2 className="text-3xl font-mono font-black text-white mb-2">0x1A2...3B4C</h2>
                    <div className="flex items-center gap-6 mt-4">
                        <div className="text-center">
                            <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Won</div>
                            <div className="text-lg font-black text-white">12.5 ETH</div>
                        </div>
                        <div className="w-[1px] h-8 bg-white/10"></div>
                        <div className="text-center">
                            <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Win Rate</div>
                            <div className="text-lg font-black text-green-500">78%</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass rounded-4xl overflow-hidden">
                <div className="grid grid-cols-4 p-6 border-b border-white/5 text-[10px] font-bold text-muted uppercase tracking-widest">
                    <div className="col-span-2">Trader</div>
                    <div className="text-right">Profit</div>
                    <div className="text-right">Win Rate</div>
                </div>
                <div className="divide-y divide-white/5">
                    {LEADERBOARD_DATA.map((player) => (
                        <div key={player.rank} className="grid grid-cols-4 p-6 items-center hover:bg-white/[0.02] transition-colors group">
                            <div className="col-span-2 flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border
                                    ${player.rank === 1 ? 'bg-primary/20 border-primary/50 text-primary' :
                                      player.rank === 2 ? 'bg-white/10 border-white/20 text-white' :
                                      player.rank === 3 ? 'bg-secondary/20 border-secondary/50 text-secondary' : 
                                      'bg-white/[0.03] border-white/5 text-muted'}
                                `}>
                                    {player.rank}
                                </div>
                                <div>
                                    <div className="font-mono text-sm font-bold text-white group-hover:text-primary transition-colors">{player.address}</div>
                                    <div className="text-[10px] text-muted font-bold uppercase tracking-widest">{player.wins} Successful Predictions</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-black text-white">{player.balance}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-black text-green-500">{player.winRate}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
