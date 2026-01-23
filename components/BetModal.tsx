"use client";

import { useBetStore } from "@/app/hooks/useBetStore";
import { useState } from "react";
import { placeBetOnChain, Side } from "@/lib/web3/attentionRoulette";
// Mock signer/provider import would go here, or use wagmi hooks

export function BetModal() {
    const { isModalOpen, closeBetModal, activeSide } = useBetStore();
    const [amount, setAmount] = useState("0.01");
    const [loading, setLoading] = useState(false);

    if (!isModalOpen) return null;

    const handlePlaceBet = async () => {
        setLoading(true);
        try {
            // Demo Mock Call if no wallet
            console.log(`Placing bet: ${amount} ETH on ${activeSide}`);
            await new Promise(r => setTimeout(r, 1000));
            alert("Bet Placed! (Demo)");
            closeBetModal();
        } catch (e) {
            console.error(e);
            alert("Failed to place bet");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="bg-zinc-900 rounded-2xl w-full max-w-sm p-6">
                <h3 className="text-xl font-bold text-white mb-4">Bet {activeSide}</h3>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-zinc-800 text-white p-3 rounded-xl mb-4"
                    placeholder="Amount (ETH)"
                />
                <div className="flex gap-3">
                    <button onClick={closeBetModal} className="flex-1 py-3 text-zinc-400">Cancel</button>
                    <button
                        onClick={handlePlaceBet}
                        disabled={loading}
                        className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-500"
                    >
                        {loading ? "Confirming..." : "Place Bet"}
                    </button>
                </div>
            </div>
        </div>
    );
}
