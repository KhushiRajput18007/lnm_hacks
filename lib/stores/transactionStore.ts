import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserBet {
    id: string;
    marketId: number;
    blockchainMarketId?: number; // Actual market ID on blockchain
    betId?: string; // Bet ID from contract for claiming
    txHash: string;
    chain: number;
    chainName: string;
    amount: string;
    side: 'YES' | 'NO';
    status: 'pending' | 'active' | 'won' | 'lost' | 'claimed';
    timestamp: number;
    marketQuestion: string;
    potentialWinnings?: string;
    socialContent?: {
        author: string;
        handle: string;
        content: string;
    };
}

export interface MarketState {
    localMarketId: number;
    blockchainMarketId?: number;
    totalYesBets: number;
    totalNoBets: number;
    userBets: string[]; // Bet IDs
    created: boolean;
}

interface BettingStore {
    // User bets
    bets: UserBet[];
    addBet: (bet: UserBet) => void;
    updateBetStatus: (id: string, status: UserBet['status']) => void;
    getBetsByMarket: (marketId: number) => UserBet[];

    // Market states (tracking local pool before blockchain sync)
    marketStates: Record<number, MarketState>;
    updateMarketState: (marketId: number, updates: Partial<MarketState>) => void;
    getMarketState: (marketId: number) => MarketState | undefined;

    // Chain selection
    selectedChain: number;
    setSelectedChain: (chainId: number) => void;

    // Balance
    optimisticBalance: string | null;
    setOptimisticBalance: (balance: string | null) => void;
    subtractFromBalance: (amount: string) => void;
    addToBalance: (amount: string) => void;

    // Stats
    getTotalBetsCount: () => number;
    getActiveBetsCount: () => number;
    getWinsCount: () => number;
    getLossesCount: () => number;
}

export const useBettingStore = create<BettingStore>()(
    persist(
        (set, get) => ({
            bets: [],
            marketStates: {},
            selectedChain: 10143,
            optimisticBalance: null,

            addBet: (bet: UserBet) => {
                set((state) => ({
                    bets: [bet, ...state.bets],
                }));
            },

            updateBetStatus: (id: string, status: UserBet['status']) => {
                set((state) => ({
                    bets: state.bets.map(bet =>
                        bet.id === id ? { ...bet, status } : bet
                    ),
                }));
            },

            getBetsByMarket: (marketId: number) => {
                return get().bets.filter(bet => bet.marketId === marketId);
            },

            updateMarketState: (marketId: number, updates: Partial<MarketState>) => {
                set((state) => ({
                    marketStates: {
                        ...state.marketStates,
                        [marketId]: {
                            ...state.marketStates[marketId],
                            localMarketId: marketId,
                            ...updates,
                        },
                    },
                }));
            },

            getMarketState: (marketId: number) => {
                return get().marketStates[marketId];
            },

            setSelectedChain: (chainId: number) => {
                set({ selectedChain: chainId });
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

            addToBalance: (amount: string) => {
                const current = get().optimisticBalance;
                if (current) {
                    const currentNum = parseFloat(current);
                    const amountNum = parseFloat(amount);
                    const newBalance = currentNum + amountNum;
                    set({ optimisticBalance: newBalance.toFixed(4) });
                }
            },

            getTotalBetsCount: () => get().bets.length,

            getActiveBetsCount: () =>
                get().bets.filter(b => b.status === 'active' || b.status === 'pending').length,

            getWinsCount: () =>
                get().bets.filter(b => b.status === 'won' || b.status === 'claimed').length,

            getLossesCount: () =>
                get().bets.filter(b => b.status === 'lost').length,
        }),
        {
            name: 'attention-roulette-bets',
        }
    )
);

// Legacy export for compatibility
export const useTransactionStore = useBettingStore;
export type Transaction = UserBet;
