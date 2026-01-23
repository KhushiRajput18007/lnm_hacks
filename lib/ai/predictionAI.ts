export interface Prediction {
    question: string;
    expiresInMinutes: number;
    shareCaption: string;
}

const MOCK_PREDICTIONS: Prediction[] = [
    {
        question: "Will @dwr.eth cast 5 times in the next hour?",
        expiresInMinutes: 60,
        shareCaption: "I'm betting yes on @dwr.eth activity. Attention is alpha.",
    },
    {
        question: "Will Monad testnet cross 10k tps today?",
        expiresInMinutes: 1440,
        shareCaption: "Monad speed is real. Betting YES on 10k TPS.",
    },
    {
        question: "Will this frame get 100 likes?",
        expiresInMinutes: 30,
        shareCaption: "This frame is going viral. Betting YES.",
    }
];

export const generatePrediction = async (): Promise<Prediction> => {
    // Simulate AI delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Pick random prediction (Deterministic for demo if needed, but random is funner)
    const index = Math.floor(Math.random() * MOCK_PREDICTIONS.length);
    return MOCK_PREDICTIONS[index];
};

export const generateShareCaption = (result: "WIN" | "LOSE"): string => {
    if (result === "WIN") {
        return "I predicted the future on Attention Roulette. 🔮 #Monad #Farcaster";
    }
    return "Missed the mark this time. Retrying on Attention Roulette. 🎲 #Monad";
};
