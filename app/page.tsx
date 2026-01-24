"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, User, Filter } from 'lucide-react';
import { MOCK_MARKETS, Market } from '@/lib/data';
import { MarketCard } from '@/components/MarketCard';
import { BetModal } from '@/components/BetModal';
import { ConnectButton } from '@/components/ConnectButton';
import { useAccount } from 'wagmi';
import Link from 'next/link';
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

  const handleConfirmBet = (amount: string) => {
    if (!selectedMarketId || !selectedSide) return;
    console.log(`Betting ${amount} on Market ${selectedMarketId}, Option ${selectedSide}`);
    setIsModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-background pb-24 relative selection:bg-primary/30">

      {/* Desktop Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles size={20} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-xl tracking-tight leading-none">Attention<span className="text-primary">Roulette</span></h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">Market of Attention</p>
            </div>
          </div>

          {/* Desktop Nav - Hidden on Mobile */}
          <nav className="hidden md:flex items-center gap-8 bg-surface/50 rounded-full px-6 py-2 border border-white/5">
            <Link href="/" className="text-white font-medium text-sm hover:text-primary transition-colors flex items-center gap-2">
              <Sparkles size={16} /> Markets
            </Link>
            <Link href="/leaderboard" className="text-gray-400 font-medium text-sm hover:text-white transition-colors flex items-center gap-2">
              <Trophy size={16} /> Leaderboard
            </Link>
            <Link href="/profile" className="text-gray-400 font-medium text-sm hover:text-white transition-colors flex items-center gap-2">
              <User size={16} /> Profile
            </Link>
          </nav>

          <ConnectButton />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 pt-6 md:pt-10 flex gap-8">

        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-24 h-fit">
          <div className="bg-surface rounded-3xl p-6 border border-gray-800">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Filter size={14} /> Filters
            </h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 rounded-xl bg-white/5 text-white font-medium border border-white/10">High Volume 🔥</button>
              <button className="w-full text-left px-4 py-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors">Ending Soon ⏳</button>
              <button className="w-full text-left px-4 py-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors">Newest 🆕</button>
              <button className="w-full text-left px-4 py-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors">My Bets 💼</button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 w-full max-w-4xl mx-auto">
          {/* Mobile Hero (Hidden on large screens maybe?) */}
          <div className="relative mb-8 p-8 rounded-3xl bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-white/10 overflow-hidden group hover:border-primary/30 transition-all">
            <div className="relative z-10 max-w-lg">
              <div className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold mb-3">
                LIVE MARKETS
              </div>
              <h2 className="text-3xl md:text-5xl font-black italic text-white mb-2 leading-tight">
                PREDICT THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">VIRAL.</span>
              </h2>
              <p className="text-gray-300 md:text-lg max-w-sm">
                Bet on real-time internet culture. Which tweet bangs? Which reel flops? You decide.
              </p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
          </div>

          {/* Infinite Scroll Feed */}
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
              <p className="text-center text-gray-500 py-8">
                <b>You've seen it all! Come back later for more drama.</b>
              </p>
            }
            className="space-y-6"
            style={{ overflow: 'visible' }} // Fix scrolling issue
          >
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {markets.map((market, index) => (
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

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-xl border-t border-gray-800 p-4 pb-6 z-50">
        <div className="flex justify-around items-center">
          <Link href="/">
            <button className="flex flex-col items-center text-primary transition-transform active:scale-95">
              <Sparkles size={24} />
              <span className="text-[10px] font-medium mt-1">Markets</span>
            </button>
          </Link>
          <Link href="/leaderboard">
            <button className="flex flex-col items-center text-gray-500 hover:text-white transition-colors">
              <Trophy size={24} />
              <span className="text-[10px] font-medium mt-1">Top</span>
            </button>
          </Link>
          <Link href="/profile">
            <button className="flex flex-col items-center text-gray-500 hover:text-white transition-colors">
              <User size={24} />
              <span className="text-[10px] font-medium mt-1">Me</span>
            </button>
          </Link>
        </div>
      </nav>

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
    </main>
  );
}
