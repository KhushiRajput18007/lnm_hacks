"use client";

import { useState } from "react";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    caption: string;
}

export function ShareModal({ isOpen, onClose, caption }: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(caption);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(caption)}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-6 space-y-4">
                <h3 className="text-xl font-bold text-white text-center">Share Result</h3>

                <div className="bg-zinc-800 p-4 rounded-xl text-zinc-300 text-sm italic">
                    "{caption}"
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={handleCopy}
                        className="flex items-center justify-center px-4 py-3 rounded-xl bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition"
                    >
                        {copied ? "Copied!" : "Copy Text"}
                    </button>

                    <a
                        href={shareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center px-4 py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-500 transition"
                    >
                        Share on Farcaster
                    </a>
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-3 text-zinc-500 text-sm hover:text-white transition"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
