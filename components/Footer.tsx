"use client";

import React, { useState } from 'react';
import { Sparkles, Twitter, Github, FileText, Shield, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { HowItWorksModal } from './HowItWorksModal';
import { InfoModal } from './InfoModal';

export function Footer() {
    const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
    const [infoModalType, setInfoModalType] = useState<'docs' | 'audit' | null>(null);

    const handleDocsClick = () => setInfoModalType('docs');
    const handleAuditClick = () => setInfoModalType('audit');
    const handleHowItWorksClick = () => setIsHowItWorksOpen(true);

    return (
        <>
            <footer className="border-t border-white/5 bg-black/50 backdrop-blur-md mt-20">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Brand */}
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                                    <Sparkles size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl tracking-tight leading-none text-white">
                                        Attention<span className="text-primary">Roulette</span>
                                    </h3>
                                    <p className="text-[10px] text-muted font-medium tracking-wide uppercase">
                                        Market of Attention
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-muted leading-relaxed max-w-sm">
                                Predict viral moments and earn rewards. Powered by Monad for lightning-fast transactions.
                            </p>
                        </div>

                        {/* Product */}
                        <div>
                            <h4 className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4">
                                Product
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <button
                                        onClick={handleHowItWorksClick}
                                        className="text-sm text-white/60 hover:text-primary transition-colors"
                                    >
                                        How it Works
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={handleDocsClick}
                                        className="text-sm text-white/60 hover:text-primary transition-colors flex items-center gap-2"
                                    >
                                        <FileText size={14} />
                                        Documentation
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={handleAuditClick}
                                        className="text-sm text-white/60 hover:text-primary transition-colors flex items-center gap-2"
                                    >
                                        <Shield size={14} />
                                        Security Audit
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Community */}
                        <div>
                            <h4 className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4">
                                Community
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <a
                                        href="https://twitter.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-white/60 hover:text-primary transition-colors flex items-center gap-2"
                                    >
                                        <Twitter size={14} />
                                        Twitter
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://github.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-white/60 hover:text-primary transition-colors flex items-center gap-2"
                                    >
                                        <Github size={14} />
                                        GitHub
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-muted">
                            © 2024 Attention Roulette. Built on Monad Testnet.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link href="/leaderboard" className="text-xs text-muted hover:text-primary transition-colors">
                                Leaderboard
                            </Link>
                            <Link href="/profile" className="text-xs text-muted hover:text-primary transition-colors">
                                Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Modals */}
            <HowItWorksModal
                isOpen={isHowItWorksOpen}
                onClose={() => setIsHowItWorksOpen(false)}
            />
            {infoModalType && (
                <InfoModal
                    isOpen={true}
                    onClose={() => setInfoModalType(null)}
                    type={infoModalType}
                />
            )}
        </>
    );
}
