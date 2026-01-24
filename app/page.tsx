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
    <main className="min-h-screen bg-background pb-24 relative selection:bg-primary/30">

      {/* Desktop Header */}
      <header className="sticky top-0 z-40 bg-[#0D0D0F]/70 backdrop-blur-xl border-b border-white/5">
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
          <nav className="hidden md:flex items-center gap-1 p-1 bg-white/5 rounded-full border border-white/5 backdrop-blur-md">
            <Link href="/" className="px-5 py-2 rounded-full text-white bg-white/10 font-medium text-sm transition-all flex items-center gap-2 shadow-inner">
              <Sparkles size={16} className="text-indigo-400" /> Markets
            </Link>
            <Link href="/leaderboard" className="px-5 py-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 font-medium text-sm transition-all flex items-center gap-2">
              <Trophy size={16} /> Leaderboard
            </Link>
            <Link href="/profile" className="px-5 py-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 font-medium text-sm transition-all flex items-center gap-2">
              <User size={16} /> Profile
            </Link>
          </nav>

          <ConnectButton />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 pt-6 md:pt-10 flex gap-8">

        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-28 h-fit">
          <div className="bg-[#151519]/80 backdrop-blur-md border border-white/5 shadow-xl transition-all duration-300 hover:border-white/10 hover:bg-[#1A1A1F]/90 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 rounded-3xl p-6">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <Filter size={14} /> Filter Markets
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedFilter('volume')}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium border transition-all duration-200 flex items-center justify-between group ${selectedFilter === 'volume' ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20 shadow-lg shadow-indigo-500/10' : 'hover:bg-white/5 text-gray-400 border-transparent hover:text-white'}`}
              >
                <span>High Volume</span>
                <span className="text-lg grayscale group-hover:grayscale-0 transition-all">🔥</span>
              </button>
              <button
                onClick={() => setSelectedFilter('ending')}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium border transition-all duration-200 flex items-center justify-between group ${selectedFilter === 'ending' ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20 shadow-lg shadow-indigo-500/10' : 'hover:bg-white/5 text-gray-400 border-transparent hover:text-white'}`}
              >
                <span>Ending Soon</span>
                <span className="text-lg grayscale group-hover:grayscale-0 transition-all">⏳</span>
              </button>
              <button
                onClick={() => setSelectedFilter('newest')}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium border transition-all duration-200 flex items-center justify-between group ${selectedFilter === 'newest' ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20 shadow-lg shadow-indigo-500/10' : 'hover:bg-white/5 text-gray-400 border-transparent hover:text-white'}`}
              >
                <span>Newest</span>
                <span className="text-lg grayscale group-hover:grayscale-0 transition-all">🆕</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 w-full max-w-4xl mx-auto">
          {/* Mobile Hero (Hidden on large screens maybe?) */}
          {/* Premium Hero Section */}
          <div className="relative mb-10 p-10 rounded-[2.5rem] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A24] to-[#0D0D0F] border border-white/5 rounded-[2.5rem] z-0"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/2 z-0 opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3 z-0"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                Live Markets
              </div>
              <h2 className="text-4xl md:text-6xl font-black italic text-white mb-4 leading-[0.9] tracking-tighter mix-blend-screen">
                PREDICT THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">VIRAL MOMENT.</span>
              </h2>
              <p className="text-gray-400 md:text-lg max-w-lg leading-relaxed mb-8">
                Bet on real-time internet culture. Which tweet bangs? Which reel flops?
                <span className="text-white font-medium"> The market decides.</span>
              </p>

              <div className="flex gap-4">
                <button className="px-6 py-3 rounded-full bg-white text-black font-bold text-sm hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  Start Betting
                </button>
                <button className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-colors backdrop-blur-md">
                  How it Works
                </button>
              </div>
            </div>
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
