// Social Media Prediction Market - Combining trending content with YES/NO betting

export interface SocialContent {
    id: string;
    type: 'tweet' | 'reel';
    author: string;
    handle: string;
    avatar: string;
    content: string;
    currentLikes?: number;
    currentViews?: number;
    imageUrl?: string;
    tweetId?: string; // Real Twitter tweet ID for linking
    platform: 'twitter' | 'instagram' | 'tiktok';
}

export interface Market {
    id: number;
    question: string; // YES/NO question about the social content
    socialContent: SocialContent; // The trending tweet/reel
    totalYesStake: number;
    totalNoStake: number;
    endTime: number;
    resolved: boolean;
    outcome: boolean; // true = YES wins, false = NO wins
    creator: string;
    exists: boolean;

    // UI compatibility
    expiresAt: number;
    totalPoolA: number;
    totalPoolB: number;
}

// For comparison markets (Option A vs Option B)
export interface ComparisonMarket {
    id: number;
    question: string;
    optionA: SocialContent & { currentStats: number };
    optionB: SocialContent & { currentStats: number };
    totalPoolA: number;
    totalPoolB: number;
    expiresAt: number;
}

const AVATARS = [
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Elon&backgroundColor=b6e3f4",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Jimmy&backgroundColor=c0aede",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Mark&backgroundColor=ffdfbf",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Khaby",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Speed",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Vitalik&backgroundColor=ffdfbf",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Taylor",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Kanye",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Donald&backgroundColor=ffd5dc",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Satya&backgroundColor=c0e3ff",
];

const IMAGES = [
    "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&q=80",
    "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&q=80",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80",
];

// Demo markets based on social media content predictions
export const MOCK_MARKETS: Market[] = [
    {
        id: 1,
        question: "Will Elon's next tweet about Mars get over 500K likes?",
        socialContent: {
            id: "tweet_1",
            type: "tweet",
            author: "Elon Musk",
            handle: "@elonmusk",
            avatar: AVATARS[0],
            content: "Mars is the only place in the solar system where it's possible for life to become multi-planetary. 🚀🔴",
            currentLikes: 245000,
            platform: "twitter",
            imageUrl: IMAGES[0],
        },
        totalYesStake: 15.5,
        totalNoStake: 8.2,
        endTime: Date.now() + 48 * 60 * 60 * 1000,
        resolved: false,
        outcome: false,
        creator: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        exists: true,
        expiresAt: Date.now() + 48 * 60 * 60 * 1000,
        totalPoolA: 15.5,
        totalPoolB: 8.2,
    },
    {
        id: 2,
        question: "Will MrBeast's giveaway tweet get 1M likes?",
        socialContent: {
            id: "tweet_2",
            type: "tweet",
            author: "MrBeast",
            handle: "@MrBeast",
            avatar: AVATARS[1],
            content: "I'm giving away $1,000,000 to random followers who retweet this in the next 48 hours! 💰🎉",
            currentLikes: 654000,
            platform: "twitter",
            imageUrl: IMAGES[1],
        },
        totalYesStake: 42.5,
        totalNoStake: 12.3,
        endTime: Date.now() + 36 * 60 * 60 * 1000,
        resolved: false,
        outcome: false,
        creator: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
        exists: true,
        expiresAt: Date.now() + 36 * 60 * 60 * 1000,
        totalPoolA: 42.5,
        totalPoolB: 12.3,
    },
    {
        id: 3,
        question: "Will Khaby Lame's next reel hit 5M views in 24h?",
        socialContent: {
            id: "reel_1",
            type: "reel",
            author: "Khaby Lame",
            handle: "@khaby.lame",
            avatar: AVATARS[3],
            content: "It's this simple... 🤲 Why do people make things complicated?",
            currentViews: 2500000,
            platform: "instagram",
            imageUrl: IMAGES[2],
        },
        totalYesStake: 31.2,
        totalNoStake: 45.8,
        endTime: Date.now() + 12 * 60 * 60 * 1000,
        resolved: false,
        outcome: false,
        creator: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
        exists: true,
        expiresAt: Date.now() + 12 * 60 * 60 * 1000,
        totalPoolA: 31.2,
        totalPoolB: 45.8,
    },
    {
        id: 4,
        question: "Will Vitalik's ETH update tweet hit 100K likes?",
        socialContent: {
            id: "tweet_3",
            type: "tweet",
            author: "Vitalik Buterin",
            handle: "@VitalikButerin",
            avatar: AVATARS[5],
            content: "Ethereum's roadmap is centering on rollups. The future is L2. 🔷 Scalability is coming faster than expected.",
            currentLikes: 45000,
            platform: "twitter",
            imageUrl: IMAGES[3],
        },
        totalYesStake: 12.1,
        totalNoStake: 9.4,
        endTime: Date.now() + 18 * 60 * 60 * 1000,
        resolved: false,
        outcome: false,
        creator: "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E",
        exists: true,
        expiresAt: Date.now() + 18 * 60 * 60 * 1000,
        totalPoolA: 12.1,
        totalPoolB: 9.4,
    },
    {
        id: 5,
        question: "Will IShowSpeed's Ronaldo clip get 3M views?",
        socialContent: {
            id: "reel_2",
            type: "reel",
            author: "IShowSpeed",
            handle: "@ishowspeed",
            avatar: AVATARS[4],
            content: "Ronaldo is the GOAT! SUIII! ⚽️🔥 Nobody can convince me otherwise!",
            currentViews: 1800000,
            platform: "tiktok",
            imageUrl: IMAGES[5],
        },
        totalYesStake: 18.7,
        totalNoStake: 28.4,
        endTime: Date.now() + 24 * 60 * 60 * 1000,
        resolved: false,
        outcome: false,
        creator: "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
        exists: true,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        totalPoolA: 18.7,
        totalPoolB: 28.4,
    },
    {
        id: 6,
        question: "Will Taylor Swift's tour post get over 2M likes?",
        socialContent: {
            id: "tweet_4",
            type: "tweet",
            author: "Taylor Swift",
            handle: "@taylorswift13",
            avatar: AVATARS[6],
            content: "I have never been happier. The Eras Tour is my life. 💖✨ Thank you all for making this possible!",
            currentLikes: 890000,
            platform: "twitter",
            imageUrl: IMAGES[4],
        },
        totalYesStake: 52.3,
        totalNoStake: 15.6,
        endTime: Date.now() + 30 * 60 * 60 * 1000,
        resolved: false,
        outcome: false,
        creator: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
        exists: true,
        expiresAt: Date.now() + 30 * 60 * 60 * 1000,
        totalPoolA: 52.3,
        totalPoolB: 15.6,
    },
];

/**
 * Calculate market odds (YES/NO percentages)
 */
export function calculateOdds(market: Market): { yesOdds: number; noOdds: number } {
    const totalStake = market.totalYesStake + market.totalNoStake;

    if (totalStake === 0) {
        return { yesOdds: 50, noOdds: 50 };
    }

    const yesOdds = (market.totalYesStake / totalStake) * 100;
    const noOdds = (market.totalNoStake / totalStake) * 100;

    return {
        yesOdds: Math.round(yesOdds),
        noOdds: Math.round(noOdds)
    };
}

/**
 * Format time remaining
 */
export function getTimeRemaining(endTime: number): string {
    const now = Date.now();
    const diff = endTime - now;

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;

    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    return `${minutes}m`;
}

/**
 * Get total volume
 */
export function getTotalVolume(market: Market): number {
    return market.totalYesStake + market.totalNoStake;
}

/**
 * Format social media stats
 */
export function formatSocialStats(content: SocialContent): string {
    if (content.type === 'tweet' && content.currentLikes) {
        return `${(content.currentLikes / 1000).toFixed(1)}K likes`;
    }
    if (content.type === 'reel' && content.currentViews) {
        return `${(content.currentViews / 1000000).toFixed(1)}M views`;
    }
    return '0';
}

/**
 * Format number for display
 */
export function formatNumber(num: number): string {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
}
