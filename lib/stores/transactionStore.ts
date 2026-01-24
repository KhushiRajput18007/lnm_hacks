import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
    txHash: string;
    chain: number;
    chainName: string;
    amount: string;
    marketId: number;
    side: 'YES' | 'NO';
    status: 'pending' | 'success' | 'failed' | 'active';
    timestamp: number;
    marketQuestion?: string;
}

interface TransactionStore {
    transactions: Transaction[];
    selectedChain: number;
    optimisticBalance: string | null;
    addTransaction: (tx: Transaction) => void;
    setSelectedChain: (chainId: number) => void;
    getTransactionsByAddress: (address: string) => Transaction[];
    getActiveBetsCount: () => number;
    getTotalBetsCount: () => number;
    setOptimisticBalance: (balance: string | null) => void;
    subtractFromBalance: (amount: string) => void;
}

export const useTransactionStore = create<TransactionStore>()(
    persist(
        (set, get) => ({
            transactions: [],
            selectedChain: 10143, // Default to Monad Testnet
            optimisticBalance: null,

            addTransaction: (tx: Transaction) => {
                set((state) => ({
                    transactions: [tx, ...state.transactions],
                }));
            },

            setSelectedChain: (chainId: number) => {
                set({ selectedChain: chainId });
            },

            getTransactionsByAddress: (address: string) => {
                // For now, return all transactions
                // In future, filter by address
                return get().transactions;
            },

            getActiveBetsCount: () => {
                return get().transactions.filter(
                    (tx) => tx.status === 'active' || tx.status === 'success'
                ).length;
            },

            getTotalBetsCount: () => {
                return get().transactions.length;
            },

            setOptimisticBalance: (balance: string | null) => {
                set({ optimisticBalance: balance });
            },

            subtractFromBalance: (amount: string) => {
                const current = get().optimisticBalance;
                if (current) {
                    const currentNum = parseFloat(current);
                    const amountNum = parseFloat(amount);
                    const newBalance = Math.max(0, currentNum - amountNum);
                    set({ optimisticBalance: newBalance.toFixed(4) });
                }
            },
        }),
        {
            name: 'attention-roulette-transactions',
        }
    )
);
