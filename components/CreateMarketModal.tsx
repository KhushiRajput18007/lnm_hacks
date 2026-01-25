"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Clock } from 'lucide-react';
import { useAccount } from 'wagmi';
import { createMarket } from '@/lib/web3/predictionMarket';
import { ethers } from 'ethers';

interface CreateMarketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const CreateMarketModal: React.FC<CreateMarketModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { isConnected } = useAccount();
    const [question, setQuestion] = useState('');
    const [duration, setDuration] = useState('24'); // hours
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [errorMessage, setErrorMessage] = useState('');
    const [txHash, setTxHash] = useState('');

    if (!isOpen) return null;

    const handleCreate = async () => {
        if (!isConnected) {
            setErrorMessage('Please connect your wallet first');
            setStatus('ERROR');
            return;
        }

        if (!question.trim()) {
            setErrorMessage('Please enter a question');
            setStatus('ERROR');
            return;
        }

        setStatus('LOADING');
        setErrorMessage('');

        try {
            // Get signer
            if (!window.ethereum) {
                throw new Error('MetaMask not found');
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            // Convert hours to seconds
            const durationInSeconds = parseInt(duration) * 60 * 60;

            // Create market on blockchain
            const result = await createMarket(signer, question, durationInSeconds);

            setTxHash(result.txHash);
            setStatus('SUCCESS');

            // Reset form
            setTimeout(() => {
                setQuestion('');
                setDuration('24');
                setStatus('IDLE');
                onSuccess();
                onClose();
            }, 2000);
        } catch (error: any) {
            console.error('Create market error:', error);
            setErrorMessage(error.message || 'Failed to create market');
            setStatus('ERROR');
        }
    };

    if (status === 'SUCCESS') {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass w-full max-w-md rounded-5xl p-8 text-center"
                >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Plus size={40} className="text-green-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2">Market Created!</h2>
                    <p className="text-muted text-sm mb-4">Your prediction market is now live on the blockchain.</p>
                    {txHash && (
                        <p className="text-xs text-muted font-mono mb-6 break-all">
                            TX: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                        </p>
                    )}
                </motion.div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass w-full max-w-md rounded-5xl p-8 relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-muted hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className="text-3xl font-black text-white mb-2">Create Market</h2>
                <p className="text-muted text-sm mb-6">Create a new prediction market on the blockchain</p>

                <div className="space-y-4">
                    {/* Question Input */}
                    <div>
                        <label className="block text-sm font-bold text-white mb-2">
                            Question (YES/NO format)
                        </label>
                        <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Will Bitcoin reach $100k by end of 2026?"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-primary transition-all resize-none"
                            rows={3}
                        />
                    </div>

                    {/* Duration Input */}
                    <div>
                        <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <Clock size={16} className="text-primary" />
                            Duration (hours)
                        </label>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            min="1"
                            max="720"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-primary transition-all"
                        />
                        <p className="text-xs text-muted mt-1">Market will close in {duration} hours</p>
                    </div>

                    {/* Error Message */}
                    {status === 'ERROR' && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                            <p className="text-red-500 text-sm font-bold">{errorMessage}</p>
                        </div>
                    )}

                    {/* Create Button */}
                    <button
                        onClick={handleCreate}
                        disabled={status === 'LOADING'}
                        className="w-full py-4 rounded-2xl font-bold text-white bg-primary hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'LOADING' ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Creating Market...
                            </div>
                        ) : (
                            'Create Market'
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
