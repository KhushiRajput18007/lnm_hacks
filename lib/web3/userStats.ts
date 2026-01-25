import { ethers } from 'ethers';
import { getPredictionMarketContract } from './predictionMarket';

export interface UserStats {
    address: string;
    totalBets: number;
    activeBets: number;
    totalWagered: bigint;
    netProfit: bigint;
    winRate: number;
    betIds: bigint[];
}

/**
 * Get comprehensive stats for a user across all their bets
 */
export async function getUserStats(
    provider: ethers.Provider,
    userAddress: string
): Promise<UserStats> {
    const contract = getPredictionMarketContract(provider);

    // Get all bet IDs for this user
    const betIds = await contract.getUserBets(userAddress);

    let totalWagered = BigInt(0);
    let activeBetsCount = 0;
    let wins = 0;
    let losses = 0;
    let netProfit = BigInt(0);

    // Fetch details for each bet
    for (const betId of betIds) {
        try {
            const bet = await contract.getBet(betId);
            const market = await contract.getMarket(bet.marketId);

            totalWagered += bet.amount;

            // Check if market is resolved
            if (market.resolved) {
                // Check if user won
                const userWon = bet.side === market.outcome;

                if (userWon) {
                    wins++;
                    // Calculate winnings if not claimed yet
                    if (!bet.claimed) {
                        const winnings = await contract.calculateWinnings(betId);
                        netProfit += winnings - bet.amount; // Profit = winnings - original bet
                    }
                } else {
                    losses++;
                    netProfit -= bet.amount; // Lost the bet amount
                }
            } else {
                // Market not resolved yet
                activeBetsCount++;
            }
        } catch (error) {
            console.error(`Error fetching bet ${betId}:`, error);
        }
    }

    const totalResolvedBets = wins + losses;
    const winRate = totalResolvedBets > 0 ? (wins / totalResolvedBets) * 100 : 0;

    return {
        address: userAddress,
        totalBets: betIds.length,
        activeBets: activeBetsCount,
        totalWagered,
        netProfit,
        winRate,
        betIds
    };
}

/**
 * Get leaderboard data (top users by net profit)
 * Note: This is a simplified version. In production, you'd want to track this off-chain
 */
export async function getLeaderboardData(
    provider: ethers.Provider,
    userAddresses: string[]
): Promise<UserStats[]> {
    const statsPromises = userAddresses.map(addr => getUserStats(provider, addr));
    const allStats = await Promise.all(statsPromises);

    // Sort by net profit (descending)
    return allStats.sort((a, b) => {
        if (a.netProfit > b.netProfit) return -1;
        if (a.netProfit < b.netProfit) return 1;
        return 0;
    });
}

/**
 * Get user's recent bets with market details
 */
export async function getUserRecentBets(
    provider: ethers.Provider,
    userAddress: string,
    limit: number = 10
) {
    const contract = getPredictionMarketContract(provider);
    const betIds = await contract.getUserBets(userAddress);

    // Get the most recent bets
    const recentBetIds = betIds.slice(-limit).reverse();

    const betsWithMarkets = [];

    for (const betId of recentBetIds) {
        try {
            const bet = await contract.getBet(betId);
            const market = await contract.getMarket(bet.marketId);

            betsWithMarkets.push({
                betId,
                bet,
                market
            });
        } catch (error) {
            console.error(`Error fetching bet ${betId}:`, error);
        }
    }

    return betsWithMarkets;
}
