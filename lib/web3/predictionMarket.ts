import { ethers } from 'ethers';
import { PREDICTION_MARKET_ADDRESS, PREDICTION_MARKET_ABI } from './predictionMarketContract';

/**
 * Get an instance of the Prediction Market contract
 */
export function getPredictionMarketContract(providerOrSigner: ethers.Provider | ethers.Signer) {
    return new ethers.Contract(
        PREDICTION_MARKET_ADDRESS,
        PREDICTION_MARKET_ABI,
        providerOrSigner
    );
}

/**
 * Place a bet on a prediction market
 */
export async function placeBet(
    signer: ethers.Signer,
    marketId: number,
    side: boolean, // true = YES, false = NO
    amount: string
): Promise<{ txHash: string; betId: bigint }> {
    const contract = getPredictionMarketContract(signer);
    
    // Convert amount to wei
    const amountInWei = ethers.parseEther(amount);
    
    // Call placeBet function with value
    const tx = await contract.placeBet(marketId, side, {
        value: amountInWei
    });
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    
    // Extract betId from event logs
    let betId = BigInt(0);
    if (receipt && receipt.logs) {
        for (const log of receipt.logs) {
            try {
                const parsedLog = contract.interface.parseLog({
                    topics: log.topics as string[],
                    data: log.data
                });
                
                if (parsedLog && parsedLog.name === 'BetPlaced') {
                    betId = parsedLog.args.betId;
                    break;
                }
            } catch (e) {
                // Skip logs that don't match our ABI
                continue;
            }
        }
    }
    
    return {
        txHash: receipt?.hash || tx.hash,
        betId
    };
}

/**
 * Create a new prediction market
 */
export async function createMarket(
    signer: ethers.Signer,
    question: string,
    durationInSeconds: number
): Promise<{ txHash: string; marketId: bigint }> {
    const contract = getPredictionMarketContract(signer);
    
    const tx = await contract.createMarket(question, durationInSeconds);
    const receipt = await tx.wait();
    
    // Extract marketId from event logs
    let marketId = BigInt(0);
    if (receipt && receipt.logs) {
        for (const log of receipt.logs) {
            try {
                const parsedLog = contract.interface.parseLog({
                    topics: log.topics as string[],
                    data: log.data
                });
                
                if (parsedLog && parsedLog.name === 'MarketCreated') {
                    marketId = parsedLog.args.marketId;
                    break;
                }
            } catch (e) {
                continue;
            }
        }
    }
    
    return {
        txHash: receipt?.hash || tx.hash,
        marketId
    };
}

/**
 * Resolve a market (only owner can call this)
 */
export async function resolveMarket(
    signer: ethers.Signer,
    marketId: number,
    outcome: boolean // true = YES won, false = NO won
): Promise<string> {
    const contract = getPredictionMarketContract(signer);
    
    const tx = await contract.resolveMarket(marketId, outcome);
    const receipt = await tx.wait();
    
    return receipt?.hash || tx.hash;
}

/**
 * Claim winnings for a bet
 */
export async function claimWinnings(
    signer: ethers.Signer,
    betId: number
): Promise<string> {
    const contract = getPredictionMarketContract(signer);
    
    const tx = await contract.claimWinnings(betId);
    const receipt = await tx.wait();
    
    return receipt?.hash || tx.hash;
}

/**
 * Get market details
 */
export async function getMarket(
    provider: ethers.Provider,
    marketId: number
) {
    const contract = getPredictionMarketContract(provider);
    return await contract.getMarket(marketId);
}

/**
 * Get bet details
 */
export async function getBet(
    provider: ethers.Provider,
    betId: number
) {
    const contract = getPredictionMarketContract(provider);
    return await contract.getBet(betId);
}

/**
 * Get market odds
 */
export async function getMarketOdds(
    provider: ethers.Provider,
    marketId: number
): Promise<{ yesOdds: bigint; noOdds: bigint }> {
    const contract = getPredictionMarketContract(provider);
    const [yesOdds, noOdds] = await contract.getMarketOdds(marketId);
    return { yesOdds, noOdds };
}

/**
 * Calculate potential winnings for a bet
 */
export async function calculateWinnings(
    provider: ethers.Provider,
    betId: number
): Promise<bigint> {
    const contract = getPredictionMarketContract(provider);
    return await contract.calculateWinnings(betId);
}

/**
 * Get all bet IDs for a user
 */
export async function getUserBets(
    provider: ethers.Provider,
    userAddress: string
): Promise<bigint[]> {
    const contract = getPredictionMarketContract(provider);
    return await contract.getUserBets(userAddress);
}
