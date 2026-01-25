// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PredictionMarket
 * @notice Polymarket-style prediction market for YES/NO betting
 * @dev Users bet on outcomes, winners share losers' stakes proportionally
 */
contract PredictionMarket is ReentrancyGuard, Ownable {
    
    // ============ Structs ============
    
    struct Market {
        uint256 id;
        string question;
        uint256 totalYesStake;
        uint256 totalNoStake;
        uint256 endTime;
        bool resolved;
        bool outcome; // true = YES wins, false = NO wins
        address creator;
        bool exists;
    }
    
    struct Bet {
        uint256 id;
        uint256 marketId;
        address bettor;
        bool side; // true = YES, false = NO
        uint256 amount;
        bool claimed;
    }
    
    // ============ State Variables ============
    
    uint256 public nextMarketId;
    uint256 public nextBetId;
    uint256 public platformFeePercent = 2; // 2% platform fee
    uint256 public constant FEE_DENOMINATOR = 100;
    
    mapping(uint256 => Market) public markets;
    mapping(uint256 => Bet) public bets;
    mapping(address => uint256[]) public userBets;
    mapping(uint256 => uint256[]) public marketBets;
    
    uint256 public collectedFees;
    
    // ============ Events ============
    
    event MarketCreated(
        uint256 indexed marketId,
        string question,
        uint256 endTime,
        address indexed creator
    );
    
    event BetPlaced(
        uint256 indexed betId,
        uint256 indexed marketId,
        address indexed bettor,
        bool side,
        uint256 amount
    );
    
    event MarketResolved(
        uint256 indexed marketId,
        bool outcome,
        uint256 totalYesStake,
        uint256 totalNoStake
    );
    
    event WinningsClaimed(
        uint256 indexed betId,
        address indexed bettor,
        uint256 amount
    );
    
    event FeesWithdrawn(address indexed owner, uint256 amount);
    
    // ============ Constructor ============
    
    constructor() Ownable(msg.sender) {
        nextMarketId = 1;
        nextBetId = 1;
    }
    
    // ============ Market Functions ============
    
    /**
     * @notice Create a new prediction market
     * @param question The market question
     * @param duration Duration in seconds until market closes
     */
    function createMarket(
        string calldata question,
        uint256 duration
    ) external returns (uint256) {
        require(duration > 0, "Duration must be positive");
        require(bytes(question).length > 0, "Question cannot be empty");
        
        uint256 marketId = nextMarketId++;
        uint256 endTime = block.timestamp + duration;
        
        markets[marketId] = Market({
            id: marketId,
            question: question,
            totalYesStake: 0,
            totalNoStake: 0,
            endTime: endTime,
            resolved: false,
            outcome: false,
            creator: msg.sender,
            exists: true
        });
        
        emit MarketCreated(marketId, question, endTime, msg.sender);
        
        return marketId;
    }
    
    /**
     * @notice Place a bet on a market
     * @param marketId The market to bet on
     * @param side true for YES, false for NO
     */
    function placeBet(
        uint256 marketId,
        bool side
    ) external payable nonReentrant {
        Market storage market = markets[marketId];
        
        require(market.exists, "Market does not exist");
        require(!market.resolved, "Market already resolved");
        require(block.timestamp < market.endTime, "Market closed");
        require(msg.value > 0, "Bet amount must be positive");
        
        uint256 betId = nextBetId++;
        
        bets[betId] = Bet({
            id: betId,
            marketId: marketId,
            bettor: msg.sender,
            side: side,
            amount: msg.value,
            claimed: false
        });
        
        // Update market totals
        if (side) {
            market.totalYesStake += msg.value;
        } else {
            market.totalNoStake += msg.value;
        }
        
        // Track user bets
        userBets[msg.sender].push(betId);
        marketBets[marketId].push(betId);
        
        emit BetPlaced(betId, marketId, msg.sender, side, msg.value);
    }
    
    /**
     * @notice Resolve a market with the final outcome
     * @param marketId The market to resolve
     * @param outcome true if YES wins, false if NO wins
     */
    function resolveMarket(
        uint256 marketId,
        bool outcome
    ) external onlyOwner {
        Market storage market = markets[marketId];
        
        require(market.exists, "Market does not exist");
        require(!market.resolved, "Market already resolved");
        require(block.timestamp >= market.endTime, "Market not closed yet");
        
        market.resolved = true;
        market.outcome = outcome;
        
        emit MarketResolved(
            marketId,
            outcome,
            market.totalYesStake,
            market.totalNoStake
        );
    }
    
    /**
     * @notice Claim winnings from a winning bet
     * @param betId The bet to claim
     */
    function claimWinnings(uint256 betId) external nonReentrant {
        Bet storage bet = bets[betId];
        Market storage market = markets[bet.marketId];
        
        require(bet.bettor == msg.sender, "Not your bet");
        require(market.resolved, "Market not resolved");
        require(!bet.claimed, "Already claimed");
        require(bet.side == market.outcome, "Bet lost");
        
        bet.claimed = true;
        
        // Calculate winnings
        uint256 winnings = calculateWinnings(betId);
        
        // Deduct platform fee
        uint256 fee = (winnings * platformFeePercent) / FEE_DENOMINATOR;
        uint256 payout = winnings - fee;
        
        collectedFees += fee;
        
        // Transfer winnings
        (bool success, ) = payable(msg.sender).call{value: payout}("");
        require(success, "Transfer failed");
        
        emit WinningsClaimed(betId, msg.sender, payout);
    }
    
    /**
     * @notice Calculate winnings for a bet
     * @param betId The bet ID
     * @return The total winnings (original stake + profit)
     */
    function calculateWinnings(uint256 betId) public view returns (uint256) {
        Bet storage bet = bets[betId];
        Market storage market = markets[bet.marketId];
        
        if (!market.resolved || bet.side != market.outcome) {
            return 0;
        }
        
        uint256 winningStake = bet.side ? market.totalYesStake : market.totalNoStake;
        uint256 losingStake = bet.side ? market.totalNoStake : market.totalYesStake;
        
        // Handle edge case: no losing bets
        if (losingStake == 0) {
            return bet.amount; // Return original stake
        }
        
        // Calculate proportional share of losing stakes
        uint256 profit = (bet.amount * losingStake) / winningStake;
        
        return bet.amount + profit;
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Get market information
     * @param marketId The market ID
     */
    function getMarket(uint256 marketId) external view returns (Market memory) {
        return markets[marketId];
    }
    
    /**
     * @notice Get bet information
     * @param betId The bet ID
     */
    function getBet(uint256 betId) external view returns (Bet memory) {
        return bets[betId];
    }
    
    /**
     * @notice Get all bets for a user
     * @param user The user address
     */
    function getUserBets(address user) external view returns (uint256[] memory) {
        return userBets[user];
    }
    
    /**
     * @notice Get all bets for a market
     * @param marketId The market ID
     */
    function getMarketBets(uint256 marketId) external view returns (uint256[] memory) {
        return marketBets[marketId];
    }
    
    /**
     * @notice Get market odds (implied probability)
     * @param marketId The market ID
     * @return yesOdds YES probability (basis points, 10000 = 100%)
     * @return noOdds NO probability (basis points, 10000 = 100%)
     */
    function getMarketOdds(uint256 marketId) external view returns (
        uint256 yesOdds,
        uint256 noOdds
    ) {
        Market storage market = markets[marketId];
        uint256 totalStake = market.totalYesStake + market.totalNoStake;
        
        if (totalStake == 0) {
            return (5000, 5000); // 50/50 if no bets
        }
        
        yesOdds = (market.totalYesStake * 10000) / totalStake;
        noOdds = (market.totalNoStake * 10000) / totalStake;
    }
    
    // ============ Admin Functions ============
    
    /**
     * @notice Withdraw collected platform fees
     */
    function withdrawFees() external onlyOwner nonReentrant {
        uint256 amount = collectedFees;
        require(amount > 0, "No fees to withdraw");
        
        collectedFees = 0;
        
        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit FeesWithdrawn(owner(), amount);
    }
    
    /**
     * @notice Update platform fee percentage
     * @param newFeePercent New fee percentage (max 10%)
     */
    function setPlatformFee(uint256 newFeePercent) external onlyOwner {
        require(newFeePercent <= 10, "Fee too high");
        platformFeePercent = newFeePercent;
    }
    
    /**
     * @notice Emergency withdraw (only if no active markets)
     */
    function emergencyWithdraw() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }
}
