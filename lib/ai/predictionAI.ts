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
    },
    {
        question: "Will ETH break $3000 in the next 24 hours?",
        expiresInMinutes: 1440,
        shareCaption: "Bullish on ETH. Let's see if it breaks $3k!",
    },
    {
        question: "Will this tweet get more engagement than the last one?",
        expiresInMinutes: 120,
        shareCaption: "Betting on viral content. This one's going to moon!",
    }
];

/**
 * Generate a prediction question
 * Uses AI if enabled, otherwise returns mock data
 */
export const generatePrediction = async (): Promise<Prediction> => {
    // Check if AI is enabled
    const aiEnabled = process.env.NEXT_PUBLIC_ENABLE_AI === 'true';
    const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (aiEnabled && geminiApiKey) {
        try {
            // TODO: Integrate LangChain + Gemini here
            // For now, fall back to mock data
            console.log('AI generation not yet implemented, using mock data');
        } catch (error) {
            console.error('AI generation failed, falling back to mock data:', error);
        }
    }

    // Simulate AI delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Pick random prediction
    const index = Math.floor(Math.random() * MOCK_PREDICTIONS.length);
    return MOCK_PREDICTIONS[index];
};

export const generateShareCaption = (result: "WIN" | "LOSE"): string => {
    if (result === "WIN") {
        return "I predicted the future on Attention Roulette. 🔮 #Monad #Farcaster";
    }
    return "Missed the mark this time. Retrying on Attention Roulette. 🎲 #Monad";
};
