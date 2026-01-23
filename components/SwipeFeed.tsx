"use client";

import { PredictionCard } from "./PredictionCard";

export function SwipeFeed() {
    const markets = [
        { id: "1", title: "Will @dwr.eth cast 5 times in the next hour?", yesPool: 1.2, noPool: 0.5, expiresIn: "45m" },
        { id: "2", title: "Will Monad testnet cross 10k tps today?", yesPool: 5.0, noPool: 2.1, expiresIn: "4h" },
        { id: "3", title: "Will BTC hit $100k before Friday?", yesPool: 10.5, noPool: 12.0, expiresIn: "2d" },
    ];

    return (
        <div className="space-y-4 pb-24">
            {markets.map((market) => (
                <PredictionCard key={market.id} {...market} />
            ))}
        </div>
    );
}
