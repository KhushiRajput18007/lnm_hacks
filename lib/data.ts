export type MediaType = 'tweet' | 'reel';

export interface SocialContent {
    id: string;
    type: MediaType;
    author: string;
    handle: string;
    avatar: string; // URL
    content: string; // Text or Thumbnail URL
    currentStats: number; // Likes/Views current
    predictedStats: number; // Baseline for the bet
    imageUrl?: string;
    tweetId?: string; // Real Tweet ID for react-tweet
}

export interface Market {
    id: number;
    question: string;
    optionA: SocialContent;
    optionB: SocialContent;
    expiresAt: number; // Timestamp
    totalPoolA: number; // ETH/MON
    totalPoolB: number;
    status: 'active' | 'resolved';
    outcome?: 'A' | 'B';
}

export const MOCK_MARKETS: Market[] = [
    {
        id: 1,
        question: "Which announcement gets more hype in 24h?",
        expiresAt: Date.now() + 3600000 * 24,
        totalPoolA: 12.5,
        totalPoolB: 8.2,
        status: 'active',
        optionA: {
            id: "t1",
            type: "tweet",
            author: "Elon Musk",
            handle: "@elonmusk",
            avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Elon&backgroundColor=b6e3f4",
            content: "Mars is the only place in the solar system where it’s possible for life to become multi-planetary. 🚀🔴",
            currentStats: 450000,
            predictedStats: 450000,
            tweetId: "1762394592070365223"
        },
        optionB: {
            id: "t2",
            type: "tweet",
            author: "MrBeast",
            handle: "@MrBeast",
            avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jimmy&backgroundColor=c0aede",
            content: "2% of global time is spent on YouTube. That is actually wild... time to make it 3%! 🎬",
            currentStats: 420000,
            predictedStats: 420000,
            tweetId: "1759283475829384752"
        }
    },
    {
        id: 2,
        question: "Battle of the Tech Giants: Who ratios who?",
        expiresAt: Date.now() + 1800000,
        totalPoolA: 5.5,
        totalPoolB: 11.2,
        status: 'active',
        optionA: {
            id: "t3",
            type: "tweet",
            author: "Mark Zuckerberg",
            handle: "@finkd",
            avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Mark&backgroundColor=ffdfbf",
            content: "Threads is growing faster than any app in history. Don't call it a comeback.",
            currentStats: 12500,
            predictedStats: 12500,
        },
        optionB: {
            id: "t4",
            type: "tweet",
            author: "Elon Musk",
            handle: "@elonmusk",
            avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Elon&backgroundColor=b6e3f4",
            content: "Competition is fine, cheating is not. 🥋",
            currentStats: 89000,
            predictedStats: 89000,
        }
    },
    {
        id: 3,
        question: "Viral Video Face-off",
        expiresAt: Date.now() + 7200000,
        totalPoolA: 2.1,
        totalPoolB: 1.8,
        status: 'active',
        optionA: {
            id: "r1",
            type: "reel",
            author: "Khaby Lame",
            handle: "@khaby.lame",
            avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Khaby",
            content: "It's this simple... 🤲",
            currentStats: 1500000,
            predictedStats: 1500000,
            imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80"
        },
        optionB: {
            id: "r2",
            type: "reel",
            author: "IShowSpeed",
            handle: "@ishowspeed",
            avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Speed",
            content: "Ronaldo is the GOAT! SUIII! ⚽️",
            currentStats: 1200000,
            predictedStats: 1200000,
            imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&q=80"
        }
    },
    {
        id: 4,
        question: "Crypto Twitter Drama",
        expiresAt: Date.now() + 360000,
        totalPoolA: 50.5,
        totalPoolB: 48.9,
        status: 'active',
        optionA: {
            id: "t5",
            type: "tweet",
            author: "Vitalik Buterin",
            handle: "@VitalikButerin",
            avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Vitalik&backgroundColor=ffdfbf",
            content: "Ethereum's roadmap is centering on rollups. The future is L2.",
            currentStats: 15000,
            predictedStats: 15000,
        },
        optionB: {
            id: "t6",
            type: "tweet",
            author: "Satoshi (Fake)",
            handle: "@satoshi",
            avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Satoshi",
            content: "Bitcoin is the only true decentralized money. Everything else is a distraction.",
            currentStats: 14500,
            predictedStats: 14500,
        }
    },
    {
        id: 5,
        question: "Music Industry Beef",
        expiresAt: Date.now() + 10000000,
        totalPoolA: 8.8,
        totalPoolB: 15.2,
        status: 'active',
        optionA: {
            id: "t7",
            type: "tweet",
            author: "Taylor Swift",
            handle: "@taylorswift13",
            avatar: "https://pbs.twimg.com/profile_images/1580951113575641089/Vf3l8a6i_400x400.jpg",
            content: "I have never been happier. The Eras Tour is my life. 💖",
            currentStats: 2500000,
            predictedStats: 2500000
        },
        optionB: {
            id: "t8",
            type: "tweet",
            author: "Kanye West",
            handle: "@kanyewest",
            avatar: "https://pbs.twimg.com/profile_images/1276461929934942210/cqNhNk6v_400x400.jpg",
            content: "I am the greatest artist of all time. No debate.",
            currentStats: 1800000,
            predictedStats: 1800000
        }
    },
    {
        id: 6,
        question: "Battle of the AI Agents 🤖",
        expiresAt: Date.now() + 5000000,
        totalPoolA: 25.4,
        totalPoolB: 22.1,
        status: 'active',
        optionA: {
            id: "ai1",
            type: "tweet",
            author: "Noah AI",
            handle: "@noah_ai",
            avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Noah",
            content: "Optimizing global attention span. Humans waste 4.2 hours daily on noise. My protocol fixes this. 🌊 #TheArk",
            currentStats: 85000,
            predictedStats: 85000
        },
        optionB: {
            id: "ai2",
            type: "tweet",
            author: "Cyrene",
            handle: "@cyrene_agent",
            avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Cyrene",
            content: "Attention is the only currency left. And I just stole yours. 💋 $CYRENE",
            currentStats: 81000,
            predictedStats: 81000
        }
    }
];
