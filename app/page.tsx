"use client";

import React, { useState } from 'react';
import { Sparkles, Filter } from 'lucide-react';
import { MOCK_MARKETS, Market } from '@/lib/data';
import { MarketCard } from '@/components/MarketCard';
import { BetModal } from '@/components/BetModal';
import { useAccount } from 'wagmi';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Home() {
  const { isConnected } = useAccount();
  const [selectedMarketId, setSelectedMarketId] = useState<number | null>(null);
  const [selectedSide, setSelectedSide] = useState<'A' | 'B' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Infinite Scroll State
  const [markets, setMarkets] = useState<Market[]>(MOCK_MARKETS);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = () => {
    // Simulate fetching more data from an API (or "Real Live Tweets")
    if (markets.length >= 20) {
      setHasMore(false);
      return;
    }

    // Simulate network delay and adding mock data dynamically
    setTimeout(() => {
      const newMarkets = MOCK_MARKETS.map(m => ({
        ...m,
        id: m.id + markets.length, // Ensure unique IDs
        question: m.question + ` (Round ${Math.floor(markets.length / 2) + 1})`
      }));
      setMarkets(prev => [...prev, ...newMarkets]);
    }, 1500);
  };

  const handleBetClick = (marketId: number, side: 'A' | 'B') => {
    if (!isConnected) {
      alert("Please connect your wallet to place a bet!");
      return;
    }
    setSelectedMarketId(marketId);
    setSelectedSide(side);
    setIsModalOpen(true);
  };

  const handleConfirmBet = async (amount: string) => {
    if (!selectedMarketId || !selectedSide) return;

    try {
      console.log(`Betting ${amount} on Market ${selectedMarketId}, Option ${selectedSide}`);
      // The actual transaction is handled in BetModal
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error confirming bet:', error);
      alert('Failed to confirm bet. Please try again.');
    }
  };

  const [selectedFilter, setSelectedFilter] = useState<'volume' | 'ending' | 'newest'>('volume');

  // Filter/Sort Logic
  const getSortedMarkets = () => {
    let sorted = [...markets];
    if (selectedFilter === 'volume') {
      sorted.sort((a, b) => (b.totalPoolA + b.totalPoolB) - (a.totalPoolA + a.totalPoolB));
    } else if (selectedFilter === 'ending') {
      sorted.sort((a, b) => a.expiresAt - b.expiresAt);
    } else if (selectedFilter === 'newest') {
      sorted.sort((a, b) => b.id - a.id);
    }
    return sorted;
  };

  const sortedMarkets = getSortedMarkets();

  return (
    <div className="pb-24 relative selection:bg-primary/30">
      <div className="max-w-7xl mx-auto px-4 pt-6 md:pt-10 flex flex-col lg:flex-row gap-8">

        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-28 h-fit">
          <div className="glass rounded-3xl p-6">
            <h3 className="text-muted text-[10px] font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Filter size={14} className="text-primary" /> Filter Markets
            </h3>
            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedFilter('volume')}
                className={`w-full text-left px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 flex items-center justify-between group ${selectedFilter === 'volume' ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5' : 'hover:bg-white/[0.03] text-muted border border-transparent hover:text-white'}`}
              >
                <span>High Volume</span>
                <span className="text-lg grayscale group-hover:grayscale-0 transition-all opacity-50 group-hover:opacity-100">🔥</span>
              </button>
              <button
                onClick={() => setSelectedFilter('ending')}
                className={`w-full text-left px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 flex items-center justify-between group ${selectedFilter === 'ending' ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5' : 'hover:bg-white/[0.03] text-muted border border-transparent hover:text-white'}`}
              >
                <span>Ending Soon</span>
                <span className="text-lg grayscale group-hover:grayscale-0 transition-all opacity-50 group-hover:opacity-100">⏳</span>
              </button>
              <button
                onClick={() => setSelectedFilter('newest')}
                className={`w-full text-left px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 flex items-center justify-between group ${selectedFilter === 'newest' ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5' : 'hover:bg-white/[0.03] text-muted border border-transparent hover:text-white'}`}
              >
                <span>Newest</span>
                <span className="text-lg grayscale group-hover:grayscale-0 transition-all opacity-50 group-hover:opacity-100">🆕</span>
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
              <div className="glass rounded-2xl p-4 bg-gradient-to-br from-primary/5 to-accent/5">
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Platform Stats</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted">24h Volume</span>
                    <span className="text-xs font-bold text-white">$1.2M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted">Open Interest</span>
                    <span className="text-xs font-bold text-white">$4.5M</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 w-full max-w-4xl mx-auto">
          {/* Premium Hero Section */}
          <div className="relative mb-10 p-8 md:p-12 rounded-5xl overflow-hidden glass group">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/2 z-0 opacity-40"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3 z-0"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Attention Economy Live
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[0.9] tracking-tighter">
                PREDICT THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">VIRAL MOMENT.</span>
              </h2>
              <p className="text-muted md:text-lg max-w-xl leading-relaxed mb-10">
                The world's first prediction market for internet culture. Bet on what captures the world's attention.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 rounded-2xl bg-white text-black font-bold text-sm hover:scale-105 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.15)] active:scale-95">
                  Start Trading
                </button>
                <button className="px-8 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white font-bold text-sm hover:bg-white/[0.08] transition-all backdrop-blur-md active:scale-95">
                  How it Works
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="text-primary" size={20} />
              Active Markets
            </h3>
            <div className="flex items-center gap-2 lg:hidden">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value as any)}
                className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-primary transition-all"
              >
                <option value="volume">High Volume</option>
                <option value="ending">Ending Soon</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          <InfiniteScroll
            dataLength={markets.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={
              <div className="flex justify-center p-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            }
            endMessage={
              <p className="text-center text-muted py-8 font-bold text-sm uppercase tracking-widest">
                You've seen it all!
              </p>
            }
            className="space-y-6"
            style={{ overflow: 'visible' }}
          >
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {sortedMarkets.map((market, index) => (
                <MarketCard
                  key={`${market.id}-${index}`}
                  market={market}
                  onBet={handleBetClick}
                />
              ))}
            </div>
          </InfiniteScroll>
        </div>
      </div>

      {/* Bet Modal */}
      {selectedMarketId && selectedSide && (
        <BetModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          marketId={selectedMarketId}
          side={selectedSide}
          onConfirm={handleConfirmBet}
        />
      )}
    </div>
  );
}

