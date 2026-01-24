"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Target, Wallet, Trophy } from 'lucide-react';

interface HowItWorksModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const steps = [
    {
        icon: Search,
        title: 'Discover Trends',
        description: 'Explore trending topics and viral moments across social media',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
    },
    {
        icon: Target,
        title: 'Predict YES / NO',
        description: 'Choose whether a moment will go viral or fade away',
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/20',
    },
    {
        icon: Wallet,
        title: 'Place a Bet',
        description: 'Select your amount and bet using Monad (recommended)',
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20',
    },
    {
        icon: Trophy,
        title: 'Resolution',
        description: 'Markets resolve when conditions are met. Winners earn rewards!',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/20',
    },
];

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-4xl glass rounded-3xl p-8 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto"
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-muted hover:text-white"
                    >
                        <X size={20} />
                    </button>

                    {/* Header */}
                    <div className="mb-10">
                        <h2 className="text-4xl font-black text-white mb-3 tracking-tight">
                            How It Works
                        </h2>
                        <p className="text-muted text-lg">
                            Start predicting viral moments in 4 simple steps
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`glass ${step.bgColor} border ${step.borderColor} rounded-2xl p-6 hover:scale-105 transition-transform`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${step.bgColor} border ${step.borderColor} flex items-center justify-center`}>
                                            <Icon size={24} className={step.color} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-bold text-muted uppercase tracking-wider">
                                                    Step {index + 1}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">
                                                {step.title}
                                            </h3>
                                            <p className="text-sm text-muted leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* CTA */}
                    <div className="mt-10 text-center">
                        <button
                            onClick={onClose}
                            className="px-8 py-4 bg-primary hover:bg-primary/80 text-white font-bold rounded-2xl transition-all active:scale-95"
                        >
                            Got it! Let's Start
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
