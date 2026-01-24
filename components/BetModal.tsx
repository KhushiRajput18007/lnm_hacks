"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet } from 'lucide-react';

interface BetModalProps {
    isOpen: boolean;
    onClose: () => void;
    marketId: number;
    side: 'A' | 'B';
    onConfirm: (amount: string) => void;
}


import { ShareCard } from './ShareCard';
import confetti from 'canvas-confetti';

// ... (props interface)

export const BetModal: React.FC<BetModalProps> = ({ isOpen, onClose, marketId, side, onConfirm }) => {
    const [amount, setAmount] = useState('0.01');
    const [status, setStatus] = useState<'IDLE' | 'SUCCESS'>('IDLE');

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(amount);
        setStatus('SUCCESS');
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00FF94', '#3b82f6', '#ffffff']
        });
    };

    if (status === 'SUCCESS') {
        return (
            <AnimatePresence>
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-surface w-full max-w-sm rounded-3xl p-6 border border-gray-800 text-center relative overflow-hidden"
                    >
                        <h2 className="text-2xl font-black text-white mb-2">
                            BET PLACED! 🎉
                        </h2>
                        <p className="text-gray-400 text-sm mb-6">
                            Good luck! Here is your receipt.
                        </p>

                        <ShareCard
                            amount={amount}
                            side={side}
                            marketQuestion="Which will get more likes?" // Todo: pass actual question
                        />

                        <button
                            onClick={() => { setStatus('IDLE'); onClose(); }}
                            className="w-full mt-4 py-3 rounded-xl font-bold text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Close
                        </button>
                    </motion.div>
                </div>
            </AnimatePresence>
        )
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    className="bg-surface w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 border-t sm:border border-gray-800"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">
                            Bet on <span className={side === 'A' ? 'text-primary' : 'text-secondary'}>Option {side}</span>
                        </h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="mb-8">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Enter Amount</label>
                        <div className="relative mb-4">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-black/40 border-2 border-transparent focus:border-accent rounded-2xl p-6 text-4xl font-black text-white text-center outline-none transition-colors"
                                placeholder="0.00"
                            />
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">ETH</span>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            {[1, 5, 10].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => setAmount(val.toString())}
                                    className="bg-gray-800/50 hover:bg-white/10 text-white font-medium py-2 rounded-xl text-sm transition-colors border border-transparent hover:border-gray-600"
                                >
                                    {val}
                                </button>
                            ))}
                            <button
                                onClick={() => setAmount('1.54')} // Mock Max
                                className="bg-gray-800/50 hover:bg-accent/20 text-accent font-medium py-2 rounded-xl text-sm transition-colors border border-transparent hover:border-accent/50"
                            >
                                MAX
                            </button>
                        </div>
                        <div className="text-center mt-3 text-xs text-gray-500">
                            Available: <span className="text-white font-mono">1.54 ETH</span>
                        </div>
                    </div>

                    <button
                        onClick={handleConfirm}
                        className={`w-full py-4 rounded-xl font-bold text-lg mb-4 transition-all active:scale-95 flex justify-center items-center gap-2
              ${side === 'A' ? 'bg-primary hover:bg-blue-600' : 'bg-secondary hover:bg-red-600'}
            `}
                    >
                        <Wallet size={20} />
                        Confirm Bet
                    </button>

                    <p className="text-center text-xs text-gray-500">
                        Funds will be locked in the smart contract until resolution.
                    </p>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
