
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Trophy, User } from 'lucide-react';

export const BottomNav = () => {
    const pathname = usePathname();

    const navItems = [
        { name: 'Markets', href: '/', icon: Sparkles },
        { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
        { name: 'Profile', href: '/profile', icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-4 pt-0">
            <nav className="glass border border-white/10 rounded-2xl p-2 flex justify-around items-center shadow-[0_10px_40px_rgba(0,0,0,0.5)] bg-black/80 backdrop-blur-xl">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted hover:text-white'
                                }`}
                        >
                            <item.icon size={20} className={isActive ? 'stroke-[2.5px]' : ''} />
                            <span className="text-[10px] font-bold tracking-wide">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};
