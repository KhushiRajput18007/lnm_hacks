"use client";

import { Github, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="w-full border-t border-white/5 bg-background/50 backdrop-blur-md py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                                <span className="text-white font-black text-xs">AR</span>
                            </div>
                            <span className="font-bold text-lg tracking-tight text-white">
                                Attention<span className="text-primary">Roulette</span>
                            </span>
                        </Link>
                        <p className="text-muted text-sm max-w-sm leading-relaxed">
                            The decentralized prediction market for the attention economy. 
                            Trade on the pulse of internet culture, powered by Monad.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Resources</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-muted hover:text-primary text-sm transition-colors">Documentation</a></li>
                            <li><a href="#" className="text-muted hover:text-primary text-sm transition-colors">How it Works</a></li>
                            <li><a href="#" className="text-muted hover:text-primary text-sm transition-colors">Security Audit</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Community</h4>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-muted hover:text-white hover:bg-white/[0.08] transition-all">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-muted hover:text-white hover:bg-white/[0.08] transition-all">
                                <Github size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-muted hover:text-white hover:bg-white/[0.08] transition-all">
                                <Youtube size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase text-center">Connected to Monad Testnet</span>
                    </div>
                    <p className="text-muted text-[10px] font-bold uppercase tracking-widest">
                        © 2024 Attention Roulette. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
