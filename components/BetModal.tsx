"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, CheckCircle2, TrendingUp } from 'lucide-react';
import { ShareCard } from './ShareCard';
import confetti from 'canvas-confetti';

interface BetModalProps {
    isOpen: boolean;
    onClose: () => void;
    marketId: number;
    side: 'A' | 'B';
    onConfirm: (amount: string) => void;
}

export const BetModal: React.FC<BetModalProps> = ({ isOpen, onClose, marketId, side, onConfirm }) => {
    const [amount, setAmount] = useState('0.01');
    const [status, setStatus] = useState<'IDLE' | 'SUCCESS'>('IDLE');

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(amount);
        setStatus('SUCCESS');
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#a855f7', '#ec4899']
        });
    };

    if (status === 'SUCCESS') {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass w-full max-w-sm rounded-5xl p-8 text-center relative overflow-hidden"
                >
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/20">
                        <CheckCircle2 size={40} className="text-primary" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">
                        BET PLACED!
                    </h2>
                    <p className="text-muted text-sm mb-8">
                        Your prediction is now live on the blockchain.
                    </p>

                    <ShareCard
                        amount={amount}
                        side={side}
                        marketQuestion="Prediction live!" 
                    />

                    <button
                        onClick={() => { setStatus('IDLE'); onClose(); }}
                        className="w-full mt-6 py-4 rounded-2xl font-bold text-muted hover:text-white hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5"
                    >
                        Close Window
                    </button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                className="glass w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] p-8 relative"
            >
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tighter">
                            PLACE YOUR <span className={side === 'A' ? 'text-primary' : 'text-secondary'}>BET</span>
                        </h2>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mt-1">Market ID: #{marketId}</p>
                    </div>
                    <button onClick={onClose} className="p-3 rounded-2xl hover:bg-white/[0.05] transition-colors text-muted hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="mb-8">
                    <div className="flex justify-between items-end mb-4 px-1">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Wager Amount</label>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary">
                            <TrendingUp size={12} /> Potential: {(parseFloat(amount || '0') * 1.8).toFixed(4)} ETH
                        </div>
                    </div>
                    
                    <div className="relative mb-6">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 focus:border-primary/50 rounded-[2rem] p-8 text-5xl font-black text-white text-center outline-none transition-all shadow-inner"
                            placeholder="0.00"
                        />
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-sm font-bold text-muted">ETH</div>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        {['0.01', '0.05', '0.1', '0.5'].map((val) => (
                            <button
                                key={val}
                                onClick={() => setAmount(val)}
                                className="bg-white/[0.03] hover:bg-white/[0.08] text-white font-bold py-3 rounded-2xl text-xs transition-all border border-white/5 hover:border-white/10"
                            >
                                {val}
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-between items-center mt-6 px-2">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Available Balance</span>
                        <span className="text-[10px] font-mono font-bold text-white">1.5420 ETH</span>
                    </div>
                </div>

                <button
                    onClick={handleConfirm}
                    className={`group relative overflow-hidden w-full py-5 rounded-[2rem] font-black text-lg mb-6 transition-all active:scale-[0.98] flex justify-center items-center gap-3 shadow-2xl
                        ${side === 'A' 
                            ? 'bg-primary text-white shadow-primary/20' 
                            : 'bg-secondary text-white shadow-secondary/20'}
                    `}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    <Wallet size={20} />
                    Confirm Prediction
                </button>

                <p className="text-center text-[10px] font-bold text-muted leading-relaxed uppercase tracking-widest opacity-50">
                    Your funds will be locked in the <br /> 
                    smart contract until resolution
                </p>
            </motion.div>
        </div>
    );
};
