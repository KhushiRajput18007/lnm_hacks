"use client";

import React from 'react';
import { useTransactionStore } from '@/lib/stores/transactionStore';
import { monadTestnet, ethereum, getChainName } from '@/lib/web3/chains';
import { useChainId, useSwitchChain } from 'wagmi';
import { Check } from 'lucide-react';

interface ChainOption {
    id: number;
    name: string;
    symbol: string;
    icon: string;
    isReal: boolean;
    recommended?: boolean;
}

const CHAIN_OPTIONS: ChainOption[] = [
    {
        id: monadTestnet.id,
        name: 'Monad Testnet',
        symbol: 'MON',
        icon: '⚡',
        isReal: true,
        recommended: true,
    },
    {
        id: ethereum.id,
        name: 'Ethereum',
        symbol: 'ETH',
        icon: '💎',
        isReal: false,
    },
    {
        id: 900, // Solana placeholder
        name: 'Solana',
        symbol: 'SOL',
        icon: '🌞',
        isReal: false,
    },
];

export const ChainSelector: React.FC = () => {
    const { selectedChain, setSelectedChain } = useTransactionStore();
    const currentChainId = useChainId();
    const { switchChain } = useSwitchChain();
    const [isOpen, setIsOpen] = React.useState(false);

    const handleSelectChain = async (chainId: number) => {
        setSelectedChain(chainId);
        setIsOpen(false);

        // Only try to switch if it's a real EVM chain
        if (chainId === monadTestnet.id || chainId === ethereum.id) {
            try {
                await switchChain({ chainId });
            } catch (error) {
                console.error('Failed to switch chain:', error);
            }
        }
    };

    const selectedChainOption = CHAIN_OPTIONS.find(c => c.id === selectedChain) || CHAIN_OPTIONS[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-white hover:bg-white/[0.08] transition-all"
            >
                <span className="text-lg">{selectedChainOption.icon}</span>
                <span className="hidden sm:inline">{selectedChainOption.name}</span>
                <span className="sm:hidden">{selectedChainOption.symbol}</span>
                {selectedChainOption.recommended && (
                    <span className="text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase tracking-wider">
                        Recommended
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 w-64 bg-black/95 border border-white/10 rounded-xl shadow-xl backdrop-blur-md overflow-hidden z-50">
                        <div className="p-2">
                            <div className="text-[10px] font-bold text-muted uppercase tracking-widest px-3 py-2">
                                Select Chain
                            </div>
                            {CHAIN_OPTIONS.map((chain) => (
                                <button
                                    key={chain.id}
                                    onClick={() => handleSelectChain(chain.id)}
                                    className={`w-full text-left px-3 py-3 rounded-lg transition-all flex items-center justify-between group ${selectedChain === chain.id
                                            ? 'bg-primary/10 text-primary'
                                            : 'hover:bg-white/[0.05] text-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{chain.icon}</span>
                                        <div>
                                            <div className="font-bold text-sm flex items-center gap-2">
                                                {chain.name}
                                                {chain.recommended && (
                                                    <span className="text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase tracking-wider">
                                                        Recommended
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-muted">
                                                {chain.isReal ? 'Real transactions' : 'Mock transactions'}
                                            </div>
                                        </div>
                                    </div>
                                    {selectedChain === chain.id && (
                                        <Check size={16} className="text-primary" />
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="border-t border-white/5 p-3 bg-white/[0.02]">
                            <p className="text-[10px] text-muted leading-relaxed">
                                <span className="text-primary font-bold">Monad</span> uses real blockchain transactions.
                                Other chains simulate for demo purposes.
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
