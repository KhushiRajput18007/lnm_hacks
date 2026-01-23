"use client";

import { useState } from "react";
import { generatePrediction } from "@/lib/ai/predictionAI";
// import { createMarket } from "@/lib/web3/attentionRoulette"; // TODO: Phase 4 Integration

export function AdminPanel() {
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const aiData = await generatePrediction();
            console.log("AI Generated:", aiData);

            // TODO: Call Smart Contract
            // await createMarket(aiData.question, aiData.expiresInMinutes);

            alert(`Market Created (Mock): ${aiData.question}`);
        } catch (e) {
            console.error(e);
            alert("Error generating market");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border-t border-gray-800 mt-8">
            <h3 className="text-sm font-bold text-gray-500 mb-2">Admin / Demo Panel</h3>
            <button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full"
            >
                {loading ? "Generating with AI..." : "✨ Generate AI Market"}
            </button>
            <p className="text-xs text-center text-gray-600 mt-2">
                Testnet Only • Owner Access
            </p>
        </div>
    );
}
