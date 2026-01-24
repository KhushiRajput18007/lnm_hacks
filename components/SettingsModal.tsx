"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Volume2, Globe, Moon, HelpCircle } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState(true);
    const [sound, setSound] = useState(true);
    const [currency, setCurrency] = useState('ETH');

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    className="bg-surface w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 border-t sm:border border-gray-800"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="text-primary">⚙️</span> Settings
                        </h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Section 1: Preferences */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Preferences</h3>
                            <div className="bg-black/20 rounded-2xl overflow-hidden border border-gray-800">
                                <div className="p-4 flex items-center justify-between border-b border-gray-800">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-500/20 p-2 rounded-lg text-blue-500"><Bell size={18} /></div>
                                        <span className="font-medium">Notifications</span>
                                    </div>
                                    <button
                                        onClick={() => setNotifications(!notifications)}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-primary' : 'bg-gray-700'}`}
                                    >
                                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-purple-500/20 p-2 rounded-lg text-purple-500"><Volume2 size={18} /></div>
                                        <span className="font-medium">Sound Effects</span>
                                    </div>
                                    <button
                                        onClick={() => setSound(!sound)}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${sound ? 'bg-primary' : 'bg-gray-700'}`}
                                    >
                                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${sound ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: General */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">General</h3>
                            <div className="bg-black/20 rounded-2xl overflow-hidden border border-gray-800">
                                <div className="p-4 flex items-center justify-between border-b border-gray-800 hover:bg-white/5 cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-500/20 p-2 rounded-lg text-green-500"><Globe size={18} /></div>
                                        <span className="font-medium">Currency</span>
                                    </div>
                                    <div className="text-sm text-gray-400 font-bold">{currency}</div>
                                </div>
                                <div className="p-4 flex items-center justify-between border-b border-gray-800 hover:bg-white/5 cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-yellow-500/20 p-2 rounded-lg text-yellow-500"><Moon size={18} /></div>
                                        <span className="font-medium">Theme</span>
                                    </div>
                                    <div className="text-sm text-gray-400">Dark Neon</div>
                                </div>
                                <div className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-red-500/20 p-2 rounded-lg text-red-500"><HelpCircle size={18} /></div>
                                        <span className="font-medium">Support</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-xs text-gray-600">
                        Version 1.0.2 • Build 42
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
};
