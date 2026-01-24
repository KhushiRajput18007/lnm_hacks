"use client";

import React from 'react';
import { useTransactionStore } from '@/lib/stores/transactionStore';
import { getNativeCurrencySymbol } from '@/lib/web3/chains';
import { Clock, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

export const TransactionHistory: React.FC = () => {
    const { transactions } = useTransactionStore();

    if (transactions.length === 0) {
        return (
            <div className="glass rounded-3xl p-8 text-center">
                <div className="w-16 h-16 bg-white/[0.03] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock size={32} className="text-muted" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Predictions Yet</h3>
                <p className="text-sm text-muted">
                    Your prediction history will appear here once you place your first bet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-black text-white mb-6">Recent Predictions</h2>

            {transactions.map((tx, index) => (
                <div
                    key={`${tx.txHash}-${index}`}
                    className="glass rounded-2xl p-6 hover:bg-white/[0.05] transition-all"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">
                                    {tx.chain === 10143 ? '⚡' : tx.chain === 1 ? '💎' : '🌞'}
                                </span>
                                <span className="text-xs font-bold text-muted uppercase tracking-wider">
                                    {tx.chainName}
                                </span>
                                {tx.status === 'success' && (
                                    <CheckCircle size={14} className="text-green-500" />
                                )}
                                {tx.status === 'pending' && (
                                    <Clock size={14} className="text-yellow-500 animate-pulse" />
                                )}
                                {tx.status === 'failed' && (
                                    <XCircle size={14} className="text-red-500" />
                                )}
                            </div>

                            <h3 className="text-white font-bold mb-1 leading-tight">
                                {tx.marketQuestion}
                            </h3>

                            <div className="flex items-center gap-3 text-xs text-muted">
                                <span>Market #{tx.marketId}</span>
                                <span>•</span>
                                <span className={tx.side === 'YES' ? 'text-green-500' : 'text-red-500'}>
                                    {tx.side}
                                </span>
                                <span>•</span>
                                <span>{new Date(tx.timestamp).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-lg font-black text-white">
                                {tx.amount} {getNativeCurrencySymbol(tx.chain)}
                            </div>
                            <div className="text-xs text-muted">
                                {tx.chain === 10143 ? 'Real TX' : 'Mock TX'}
                            </div>
                        </div>
                    </div>

                    {tx.txHash && (
                        <div className="pt-4 border-t border-white/5">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                                    Transaction Hash
                                </span>
                                <span className="text-xs font-mono text-white/60">
                                    {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
