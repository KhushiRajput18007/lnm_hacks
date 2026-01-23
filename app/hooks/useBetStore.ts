import { create } from 'zustand';

interface BetState {
    isModalOpen: boolean;
    activeMarketId: string | null;
    activeSide: 'YES' | 'NO' | null;
    openBetModal: (marketId: string, side: 'YES' | 'NO') => void;
    closeBetModal: () => void;
}

export const useBetStore = create<BetState>((set) => ({
    isModalOpen: false,
    activeMarketId: null,
    activeSide: null,
    openBetModal: (marketId, side) => set({ isModalOpen: true, activeMarketId: marketId, activeSide: side }),
    closeBetModal: () => set({ isModalOpen: false, activeMarketId: null, activeSide: null }),
}));
