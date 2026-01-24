
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

const AVATARS = [
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Elon&backgroundColor=b6e3f4",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Jimmy&backgroundColor=c0aede",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Mark&backgroundColor=ffdfbf",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Khaby",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Speed",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Vitalik&backgroundColor=ffdfbf",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Satoshi",
    "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Noah",
    "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Cyrene",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Taylor",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Kanye",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Cristiano",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Messi",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Rock",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Kevin",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Bill",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Jeff",
];

const IMAGES = [
    "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&q=80",
    "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&q=80",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80",
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80",
    "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80",
    "https://images.unsplash.com/photo-1531297461136-82lw9f2p4p4?w=400&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80",
    "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=400&q=80",
];

// Helper to generate random markets
const generateMarkets = (count: number): Market[] => {
    const markets: Market[] = [];
    const topics = [
        "Tech", "Crypto", "Music", "Sports", "Politics", "Gaming", "Movies", "Meme", "AI", "Space"
    ];

    // Seeded random function for deterministic results
    const seededRandom = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };

    for (let i = 1; i <= count; i++) {
        const topic = topics[i % topics.length];
        const isTweet = seededRandom(i * 1000) > 0.3;

        markets.push({
            id: i,
            question: `${topic} Showdown: Who wins the internet today? #${i}`,
            expiresAt: Date.now() + seededRandom(i * 2000) * 86400000 * 3,
            totalPoolA: parseFloat((seededRandom(i * 3000) * 20).toFixed(2)),
            totalPoolB: parseFloat((seededRandom(i * 4000) * 20).toFixed(2)),
            status: 'active',
            optionA: {
                id: `optA_${i}`,
                type: isTweet ? 'tweet' : 'reel',
                author: `User A${i}`,
                handle: `@user_a_${i}`,
                avatar: AVATARS[i % AVATARS.length],
                content: `This is a simulated ${topic} post for market #${i}. The future is wild! 🚀`,
                currentStats: Math.floor(seededRandom(i * 5000) * 1000000),
                predictedStats: Math.floor(seededRandom(i * 6000) * 1000000),
                imageUrl: IMAGES[i % IMAGES.length]
            },
            optionB: {
                id: `optB_${i}`,
                type: isTweet ? 'tweet' : 'reel',
                author: `User B${i}`,
                handle: `@user_b_${i}`,
                avatar: AVATARS[(i + 1) % AVATARS.length],
                content: `I bet this post will go viral faster than the other one! 👀 #${topic}`,
                currentStats: Math.floor(seededRandom(i * 7000) * 1000000),
                predictedStats: Math.floor(seededRandom(i * 8000) * 1000000),
                imageUrl: IMAGES[(i + 1) % IMAGES.length]
            }
        });
    }
    return markets;
};

// Initial static high-quality mocks + generated ones
const STATIC_MARKETS: Market[] = [
    {
        id: 1001,
        question: "Who's winning the engagement war today?",
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
            imageUrl: "https://images.unsplash.com/photo-1614728853975-d14f4e918549?w=400&q=80"
        },
        optionB: {
            id: "t2",
            type: "tweet",
            author: "MrBeast",
            handle: "@MrBeast",
            avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jimmy&backgroundColor=c0aede",
            content: "2% of global time is spent on YouTube...",
            currentStats: 420000,
            predictedStats: 420000,
            imageUrl: "https://images.unsplash.com/photo-1585250003058-29a399f928bd?w=400&q=80"
        }
    },
    {
        id: 1002,
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
            imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80"
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
            imageUrl: "https://images.unsplash.com/photo-1541873676-a18131494184?w=400&q=80"
        }
    },
    {
        id: 1003,
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
        id: 1004,
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
            imageUrl: "https://images.unsplash.com/photo-1622630929302-790135d9685e?w=400&q=80"
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
            imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&q=80"
        }
    },
    {
        id: 1005,
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
            avatar: "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png",
            content: "I have never been happier. The Eras Tour is my life. 💖",
            currentStats: 2500000,
            predictedStats: 2500000,
            imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80"
        },
        optionB: {
            id: "t8",
            type: "tweet",
            author: "Kanye West",
            handle: "@kanyewest",
            avatar: "https://pbs.twimg.com/profile_images/1276461929934942210/cqNhNk6v_400x400.jpg",
            content: "I am the greatest artist of all time. No debate.",
            currentStats: 1800000,
            predictedStats: 1800000,
            imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80"
        }
    },
    {
        id: 1006,
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
            predictedStats: 85000,
            imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80"
        },
        optionB: {
            id: "ai2",
            type: "tweet",
            author: "Cyrene",
            handle: "@cyrene_agent",
            avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Cyrene",
            content: "Attention is the only currency left. And I just stole yours. 💋 $CYRENE",
            currentStats: 81000,
            predictedStats: 81000,
            imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80"
        }
    }
];

export const MOCK_MARKETS: Market[] = [
    ...STATIC_MARKETS,
    ...generateMarkets(200) // Generating 200 markets -> 400 tweets
];
