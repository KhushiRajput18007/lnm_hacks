"use client";

import { Sparkles, Trophy, User } from 'lucide-react';
import Link from 'next/link';
import { ConnectButton } from './ConnectButton';
import { ChainSelector } from './ChainSelector';
import { usePathname } from 'next/navigation';

export function Header() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Markets', href: '/', icon: Sparkles },
        { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
        { name: 'Profile', href: '/profile', icon: User },
    ];

    return (
        <header className="sticky top-0 z-50 w-full glass border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="font-bold text-xl tracking-tight leading-none text-white">
                                Attention<span className="text-primary">Roulette</span>
                            </h1>
                            <p className="text-[10px] text-muted font-medium tracking-wide uppercase mt-1">
                                Market of Attention
                            </p>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-1 p-1 bg-white/[0.03] rounded-full border border-white/5 backdrop-blur-md">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`px-5 py-2 rounded-full font-medium text-sm transition-all flex items-center gap-2 ${isActive
                                            ? 'bg-white/10 text-white shadow-inner shadow-white/5'
                                            : 'text-muted hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon size={16} className={isActive ? 'text-primary' : ''} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <ChainSelector />
                    <ConnectButton />
                </div>
            </div>
        </header>
    );
}
