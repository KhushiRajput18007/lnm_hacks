// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AttentionRoulette is Ownable, ReentrancyGuard {
    enum Side { YES, NO }

    struct Market {
        uint256 id;
        string question;
        uint256 expiresAt;
        uint256 yesPool;
        uint256 noPool;
        bool resolved;
        Side outcome;
    }

    struct Bet {
        uint256 amount;
        Side side;
        bool claimed;
    }

    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => Bet)) public bets;
    uint256 public marketCount;

    event MarketCreated(uint256 indexed id, string question, uint256 expiresAt);
    event BetPlaced(uint256 indexed marketId, address indexed user, uint256 amount, Side side);
    event MarketResolved(uint256 indexed marketId, Side outcome);
    event RewardClaimed(uint256 indexed marketId, address indexed user, uint256 amount);

    constructor() Ownable() {}

    function createMarket(string memory question, uint256 expiresAt) external onlyOwner {
        require(expiresAt > block.timestamp, "Expiry must be in future");
        
        marketCount++;
        Market storage newMarket = markets[marketCount];
        newMarket.id = marketCount;
        newMarket.question = question;
        newMarket.expiresAt = expiresAt;
        
        emit MarketCreated(marketCount, question, expiresAt);
    }

    function placeBet(uint256 marketId, Side side) external payable nonReentrant {
        require(msg.value > 0, "Bet amount must be > 0");
        require(marketId > 0 && marketId <= marketCount, "Invalid market");
        Market storage market = markets[marketId];
        require(block.timestamp < market.expiresAt, "Market expired");
        require(!market.resolved, "Market already resolved");
        require(bets[marketId][msg.sender].amount == 0, "Already bet on this market");

        Bet storage newBet = bets[marketId][msg.sender];
        newBet.amount = msg.value;
        newBet.side = side;

        if (side == Side.YES) {
            market.yesPool += msg.value;
        } else {
            market.noPool += msg.value;
        }

        emit BetPlaced(marketId, msg.sender, msg.value, side);
    }

    function resolveMarket(uint256 marketId, Side outcome) external onlyOwner {
        require(marketId > 0 && marketId <= marketCount, "Invalid market");
        Market storage market = markets[marketId];
        require(!market.resolved, "Already resolved");
        require(block.timestamp >= market.expiresAt, "Not yet expired"); // Enforce expiry check
        
        market.resolved = true;
        market.outcome = outcome;

        emit MarketResolved(marketId, outcome);
    }

    function claimReward(uint256 marketId) external nonReentrant {
        require(marketId > 0 && marketId <= marketCount, "Invalid market");
        Market storage market = markets[marketId];
        require(market.resolved, "Not resolved yet");
        
        Bet storage userBet = bets[marketId][msg.sender];
        require(userBet.amount > 0, "No bet placed");
        require(!userBet.claimed, "Already claimed");
        require(userBet.side == market.outcome, "You lost");

        userBet.claimed = true;
        
        uint256 winningPool = (market.outcome == Side.YES) ? market.yesPool : market.noPool;
        uint256 losingPool = (market.outcome == Side.YES) ? market.noPool : market.yesPool;
        
        uint256 reward = userBet.amount;
        if (losingPool > 0) {
            // Pro-rata share of losing pool
            uint256 bonus = (losingPool * userBet.amount) / winningPool;
            reward += bonus;
        }
        
        (bool success, ) = payable(msg.sender).call{value: reward}("");
        require(success, "Transfer failed");
        
        emit RewardClaimed(marketId, msg.sender, reward);
    }
}
