"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Shield } from 'lucide-react';

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'docs' | 'audit';
}

const content = {
    docs: {
        icon: FileText,
        title: 'Documentation',
        message: 'Comprehensive documentation is coming soon!',
        description: 'We\'re working on detailed guides, API references, and tutorials to help you get the most out of Attention Roulette.',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
    },
    audit: {
        icon: Shield,
        title: 'Security Audit',
        message: 'Audit pending for mainnet launch',
        description: 'Our smart contracts will undergo comprehensive security audits before mainnet deployment to ensure the safety of user funds.',
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20',
    },
};

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, type }) => {
    if (!isOpen) return null;

    const info = content[type];
    const Icon = info.icon;

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
                    className="relative w-full max-w-md glass rounded-3xl p-8 shadow-2xl border border-white/10"
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-muted hover:text-white"
                    >
                        <X size={20} />
                    </button>

                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl ${info.bgColor} border ${info.borderColor} flex items-center justify-center mb-6`}>
                        <Icon size={32} className={info.color} />
                    </div>

                    {/* Content */}
                    <h2 className="text-3xl font-black text-white mb-3 tracking-tight">
                        {info.title}
                    </h2>
                    <p className="text-xl font-bold text-primary mb-4">
                        {info.message}
                    </p>
                    <p className="text-muted leading-relaxed mb-8">
                        {info.description}
                    </p>

                    {/* CTA */}
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10"
                    >
                        Close
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
