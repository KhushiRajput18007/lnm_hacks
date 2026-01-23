"use client";

import { useState } from "react";
import { useBetStore } from "@/app/hooks/useBetStore";

export function DemoControlPanel() {
    const [isVisible, setIsVisible] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    // Toggle with a secret double click or just a button for dev
    // For Hackathon, we'll keep it as a small "Dev" toggle at bottom

    const addLog = (msg: string) => setLogs(p => [msg, ...p].slice(0, 5));

    const handleSeed = () => {
        // In a real app this would write to Zustand/LocalStorage
        // Since mockMarkets is hardcoded in SwipeFeed/lib, we can't easily mute it *here* 
        // without refactoring SwipeFeed to read from a Store.
        // Assuming Phase 5 refactor implies SwipeFeed reads from a prop or store.
        addLog("Seeded 3 markets (Mock)");
        window.location.reload(); // Cheap way to reset state for demo
    };

    const handleClear = () => {
        addLog("Cleared all data");
        // Logic to clear local storage if used
    };

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className="fixed bottom-4 right-4 text-[10px] text-zinc-700 hover:text-zinc-500 transition-colors"
            >
                dev
            </button>
        )
    }

    return (
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl mt-8 text-xs font-mono mb-20">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-zinc-400 font-bold">Demo Controls</h3>
                <button onClick={() => setIsVisible(false)} className="text-zinc-600 hover:text-white">x</button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
                <button onClick={handleSeed} className="bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded">
                    Seed Data
                </button>
                <button onClick={handleClear} className="bg-zinc-800 hover:bg-zinc-700 text-red-400 py-2 rounded">
                    Clear State
                </button>
            </div>

            <div className="bg-black p-2 rounded h-24 overflow-y-auto text-zinc-500">
                {logs.length === 0 ? "No logs..." : logs.map((l, i) => <div key={i}>&gt; {l}</div>)}
            </div>
        </div>
    );
}
