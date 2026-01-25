"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Wallet, CheckCircle2, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { ShareCard } from './ShareCard';
import confetti from 'canvas-confetti';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { placeBet as placeBetContract, createMarket, getMarket } from '@/lib/web3/predictionMarket';
import { monadTestnet, getNativeCurrencySymbol, getChainName } from '@/lib/web3/chains';
import { useBettingStore, UserBet } from '@/lib/stores/transactionStore';
import { useNotificationStore } from '@/lib/stores/notificationStore';
import { ethers } from 'ethers';
import { MOCK_MARKETS } from '@/lib/data';

interface BetModalProps {
    isOpen: boolean;
    onClose: () => void;
    marketId: number;
    side: 'A' | 'B';
    onConfirm: (amount: string) => void;
    marketQuestion?: string;
}

export const BetModal: React.FC<BetModalProps> = ({ isOpen, onClose, marketId, side, onConfirm, marketQuestion }) => {
    const [amount, setAmount] = useState('0.01');
    const [status, setStatus] = useState<'IDLE' | 'CREATING_MARKET' | 'PLACING_BET' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [errorMessage, setErrorMessage] = useState('');
    const [txHash, setTxHash] = useState('');

    const { isConnected, address } = useAccount();
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();
    const {
        selectedChain,
        addBet,
        subtractFromBalance,
        optimisticBalance,
        updateMarketState,
        getMarketState
    } = useBettingStore();
    const { addNotification } = useNotificationStore();

    const currencySymbol = getNativeCurrencySymbol(selectedChain || monadTestnet.id);
    const targetChainId = selectedChain || monadTestnet.id;

    // Get market details
    const mockMarket = MOCK_MARKETS.find(m => m.id === marketId);

    if (!isOpen) return null;

    // Check balance
    const currentBalance = optimisticBalance ? parseFloat(optimisticBalance) : 0;
    const betAmount = parseFloat(amount) || 0;
    const hasEnoughBalance = betAmount <= currentBalance || currentBalance === 0;

    // Calculate potential return
    const potentialReturn = (betAmount * 1.8).toFixed(4);

    const handleConfirm = async () => {
        if (!isConnected || !address) {
            setErrorMessage('Please connect your wallet first');
            setStatus('ERROR');
            return;
        }

        if (optimisticBalance && betAmount > currentBalance) {
            setErrorMessage(`Insufficient balance. You have ${currentBalance.toFixed(4)} ${currencySymbol}`);
            setStatus('ERROR');
            return;
        }

        if (betAmount <= 0) {
            setErrorMessage('Please enter a valid bet amount');
            setStatus('ERROR');
            return;
        }

        try {
            // Check if on correct chain
            if (chainId !== targetChainId) {
                try {
                    await switchChain({ chainId: targetChainId });
                } catch (switchError: any) {
                    setErrorMessage(`Please switch to ${getChainName(targetChainId)} network`);
                    setStatus('ERROR');
                    return;
                }
            }

            if (!window.ethereum) {
                throw new Error('MetaMask not found');
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            // Check if market exists on blockchain, if not create it
            let blockchainMarketId = getMarketState(marketId)?.blockchainMarketId;

            if (!blockchainMarketId) {
                setStatus('CREATING_MARKET');

                try {
                    // Try to get existing market first
                    const existingMarket = await getMarket(provider, marketId);
                    if (existingMarket && existingMarket.exists) {
                        blockchainMarketId = marketId;
                    }
                } catch (e) {
                    // Market doesn't exist, need to create it
                }

                if (!blockchainMarketId) {
                    // Create the market on blockchain
                    const question = marketQuestion || mockMarket?.question || `Prediction Market #${marketId}`;
                    const duration = 48 * 60 * 60; // 48 hours

                    const createResult = await createMarket(signer, question, duration);
                    blockchainMarketId = Number(createResult.marketId);

                    // Save the blockchain market ID
                    updateMarketState(marketId, {
                        blockchainMarketId,
                        created: true
                    });

                    addNotification({
                        type: 'info',
                        message: 'Market created on blockchain!',
                        duration: 3000,
                    });
                }
            }

            // Now place the bet
            setStatus('PLACING_BET');

            const betSide = side === 'A'; // true = YES, false = NO
            const result = await placeBetContract(signer, blockchainMarketId!, betSide, amount);

            setTxHash(result.txHash);
            setStatus('SUCCESS');

            // Deduct from balance
            subtractFromBalance(amount);

            // Update market state with new bet
            const currentState = getMarketState(marketId);
            const newYesBets = (currentState?.totalYesBets || 0) + (betSide ? betAmount : 0);
            const newNoBets = (currentState?.totalNoBets || 0) + (!betSide ? betAmount : 0);

            updateMarketState(marketId, {
                totalYesBets: newYesBets,
                totalNoBets: newNoBets,
                blockchainMarketId,
            });

            // Create bet record
            const betRecord: UserBet = {
                id: `bet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                marketId,
                blockchainMarketId,
                betId: result.betId.toString(),
                txHash: result.txHash,
                chain: targetChainId,
                chainName: getChainName(targetChainId),
                amount,
                side: betSide ? 'YES' : 'NO',
                status: 'active',
                timestamp: Date.now(),
                marketQuestion: marketQuestion || mockMarket?.question || `Market #${marketId}`,
                potentialWinnings: potentialReturn,
                socialContent: mockMarket?.socialContent ? {
                    author: mockMarket.socialContent.author,
                    handle: mockMarket.socialContent.handle,
                    content: mockMarket.socialContent.content,
                } : undefined,
            };

            addBet(betRecord);
            onConfirm(amount);

            addNotification({
                type: 'success',
                message: `Bet placed! ${amount} ${currencySymbol} on ${betSide ? 'YES' : 'NO'}`,
                duration: 4000,
            });

            // Confetti!
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: betSide ? ['#22c55e', '#16a34a', '#15803d'] : ['#ef4444', '#dc2626', '#b91c1c']
            });

        } catch (error: any) {
            console.error('Bet error:', error);

            let errorMsg = error.message || 'Failed to place bet';
            if (errorMsg.includes('insufficient funds')) {
                errorMsg = 'Insufficient funds in wallet';
            } else if (errorMsg.includes('user rejected')) {
                errorMsg = 'Transaction rejected by user';
            } else if (errorMsg.length > 100) {
                errorMsg = 'Transaction failed. Please try again.';
            }

            setErrorMessage(errorMsg);
            setStatus('ERROR');
        }
    };

    // Success state
    if (status === 'SUCCESS') {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass w-full max-w-sm rounded-5xl p-8 text-center relative overflow-hidden"
                >
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl ${side === 'A' ? 'bg-green-500/20 shadow-green-500/20' : 'bg-red-500/20 shadow-red-500/20'
                        }`}>
                        <CheckCircle2 size={40} className={side === 'A' ? 'text-green-500' : 'text-red-500'} />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">
                        BET PLACED!
                    </h2>
                    <p className="text-muted text-sm mb-2">
                        Your {side === 'A' ? 'YES' : 'NO'} prediction is live on the blockchain.
                    </p>
                    <p className={`text-sm font-bold mb-4 ${side === 'A' ? 'text-green-500' : 'text-red-500'}`}>
                        -{amount} {currencySymbol} • Potential: +{potentialReturn} {currencySymbol}
                    </p>

                    <ShareCard
                        amount={amount}
                        side={side}
                        marketQuestion={marketQuestion || "Prediction live!"}
                        txHash={txHash}
                    />

                    <button
                        onClick={() => { setStatus('IDLE'); setAmount('0.01'); onClose(); }}
                        className="w-full mt-6 py-4 rounded-2xl font-bold text-muted hover:text-white hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5"
                    >
                        Close Window
                    </button>
                </motion.div>
            </div>
        );
    }

    // Error state
    if (status === 'ERROR') {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass w-full max-w-sm rounded-5xl p-8 text-center relative overflow-hidden"
                >
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle size={40} className="text-red-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">
                        OOPS!
                    </h2>
                    <p className="text-muted text-sm mb-8 max-w-xs mx-auto">
                        {errorMessage}
                    </p>

                    <button
                        onClick={() => { setStatus('IDLE'); setErrorMessage(''); }}
                        className="w-full py-4 rounded-2xl font-bold bg-primary text-white hover:bg-primary/90 transition-all"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => { setStatus('IDLE'); onClose(); }}
                        className="w-full mt-3 py-4 rounded-2xl font-bold text-muted hover:text-white hover:bg-white/[0.03] transition-all"
                    >
                        Cancel
                    </button>
                </motion.div>
            </div>
        );
    }

    // Loading states
    if (status === 'CREATING_MARKET' || status === 'PLACING_BET') {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass w-full max-w-sm rounded-5xl p-8 text-center relative overflow-hidden"
                >
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Loader2 size={40} className="text-primary animate-spin" />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2 tracking-tighter">
                        {status === 'CREATING_MARKET' ? 'CREATING MARKET...' : 'PLACING BET...'}
                    </h2>
                    <p className="text-muted text-sm mb-4">
                        {status === 'CREATING_MARKET'
                            ? 'Setting up the market on the blockchain...'
                            : 'Confirming your prediction on the blockchain...'
                        }
                    </p>
                    <p className="text-xs text-muted">
                        Please confirm the transaction in your wallet
                    </p>
                </motion.div>
            </div>
        );
    }

    // Default betting form
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
                            BET <span className={side === 'A' ? 'text-green-500' : 'text-red-500'}>{side === 'A' ? 'YES' : 'NO'}</span>
                        </h2>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mt-1">
                            {marketQuestion?.slice(0, 40)}...
                        </p>
                    </div>
                    <button onClick={onClose} className="p-3 rounded-2xl hover:bg-white/[0.05] transition-colors text-muted hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Balance Display */}
                {optimisticBalance && (
                    <div className="mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-muted font-bold uppercase">Your Balance</span>
                            <span className="text-sm font-black text-white">{optimisticBalance} {currencySymbol}</span>
                        </div>
                        {betAmount > 0 && (
                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
                                <span className="text-xs text-muted font-bold uppercase">After Bet</span>
                                <span className={`text-sm font-black ${hasEnoughBalance ? 'text-green-500' : 'text-red-500'}`}>
                                    {Math.max(0, currentBalance - betAmount).toFixed(4)} {currencySymbol}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Amount Input */}
                <div className="mb-8">
                    <div className="flex justify-between items-end mb-4 px-1">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Wager Amount</label>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-500">
                            <TrendingUp size={12} /> Potential: {potentialReturn} {currencySymbol}
                        </div>
                    </div>

                    <div className="relative mb-6">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className={`w-full bg-white/[0.03] border focus:border-primary/50 rounded-[2rem] p-8 text-5xl font-black text-white text-center outline-none transition-all shadow-inner ${!hasEnoughBalance && optimisticBalance ? 'border-red-500/50' : 'border-white/10'
                                }`}
                            placeholder="0.00"
                            step="0.01"
                            min="0.001"
                        />
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-sm font-bold text-muted">{currencySymbol}</div>
                    </div>

                    {!hasEnoughBalance && optimisticBalance && (
                        <p className="text-red-500 text-xs text-center mb-4 font-bold">
                            Insufficient balance!
                        </p>
                    )}

                    <div className="grid grid-cols-4 gap-3">
                        {['0.01', '0.05', '0.1', '0.5'].map((val) => (
                            <button
                                key={val}
                                onClick={() => setAmount(val)}
                                className={`py-3 rounded-2xl text-xs font-bold transition-all border ${amount === val
                                        ? 'bg-primary/20 border-primary/50 text-primary'
                                        : 'bg-white/[0.03] border-white/5 text-white hover:bg-white/[0.08]'
                                    }`}
                            >
                                {val}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Confirm Button */}
                <button
                    onClick={handleConfirm}
                    disabled={!isConnected || (!hasEnoughBalance && !!optimisticBalance) || betAmount <= 0}
                    className={`group relative overflow-hidden w-full py-5 rounded-[2rem] font-black text-lg mb-6 transition-all active:scale-[0.98] flex justify-center items-center gap-3 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed
                        ${side === 'A'
                            ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/20'
                            : 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'}
                    `}
                >
                    <Wallet size={20} />
                    Bet {side === 'A' ? 'YES' : 'NO'} - {amount} {currencySymbol}
                </button>

                <p className="text-center text-[10px] font-bold text-muted leading-relaxed uppercase tracking-widest opacity-50">
                    Your funds will be locked until market resolution
                </p>
            </motion.div>
        </div>
    );
};
