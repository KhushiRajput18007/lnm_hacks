"use client";

import { SwipeFeed } from "@/components/SwipeFeed";
import { BetModal } from "@/components/BetModal";
import { AdminPanel } from "@/components/AdminPanel";
import { DemoControlPanel } from "@/components/DemoControlPanel"; // New component
import { useState, useEffect } from "react";
import { SkeletonCard } from "@/components/ui/SkeletonCard";

export default function FeedPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate initial load for skeletal state check
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="p-4 max-w-md mx-auto space-y-4">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-white">Live Markets</h2>
                <div className="flex items-center gap-2 text-xs text-green-500 font-mono">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    LIVE
                </div>
            </div>

            {loading ? (
                <>
                    <SkeletonCard />
                    <SkeletonCard />
                </>
            ) : (
                <SwipeFeed />
            )}

            <AdminPanel />
            <DemoControlPanel />
            <BetModal />
        </div>
    );
}
