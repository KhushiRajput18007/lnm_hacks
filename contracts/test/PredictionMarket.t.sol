// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PredictionMarket.sol";

contract PredictionMarketTest is Test {
    PredictionMarket public market;
    
    address public owner = address(1);
    address public alice = address(2);
    address public bob = address(3);
    address public charlie = address(4);
    
    uint256 constant INITIAL_BALANCE = 100 ether;
    
    function setUp() public {
        vm.prank(owner);
        market = new PredictionMarket();
        
        // Fund test accounts
        vm.deal(alice, INITIAL_BALANCE);
        vm.deal(bob, INITIAL_BALANCE);
        vm.deal(charlie, INITIAL_BALANCE);
    }
    
    // ============ Market Creation Tests ============
    
    function testCreateMarket() public {
        vm.prank(alice);
        uint256 marketId = market.createMarket("Will ETH hit $5000?", 7 days);
        
        assertEq(marketId, 1);
        
        PredictionMarket.Market memory m = market.getMarket(marketId);
        assertEq(m.id, 1);
        assertEq(m.question, "Will ETH hit $5000?");
        assertEq(m.creator, alice);
        assertEq(m.resolved, false);
        assertTrue(m.exists);
    }
    
    function testCannotCreateMarketWithZeroDuration() public {
        vm.prank(alice);
        vm.expectRevert("Duration must be positive");
        market.createMarket("Question?", 0);
    }
    
    function testCannotCreateMarketWithEmptyQuestion() public {
        vm.prank(alice);
        vm.expectRevert("Question cannot be empty");
        market.createMarket("", 7 days);
    }
    
    // ============ Betting Tests ============
    
    function testPlaceBet() public {
        // Create market
        vm.prank(alice);
        uint256 marketId = market.createMarket("Will BTC hit $100k?", 7 days);
        
        // Place YES bet
        vm.prank(bob);
        market.placeBet{value: 1 ether}(marketId, true);
        
        PredictionMarket.Market memory m = market.getMarket(marketId);
        assertEq(m.totalYesStake, 1 ether);
        assertEq(m.totalNoStake, 0);
        
        // Check bet details
        PredictionMarket.Bet memory bet = market.getBet(1);
        assertEq(bet.bettor, bob);
        assertEq(bet.side, true);
        assertEq(bet.amount, 1 ether);
        assertEq(bet.claimed, false);
    }
    
    function testPlaceMultipleBets() public {
        vm.prank(alice);
        uint256 marketId = market.createMarket("Test market", 7 days);
        
        // Alice bets YES
        vm.prank(alice);
        market.placeBet{value: 2 ether}(marketId, true);
        
        // Bob bets NO
        vm.prank(bob);
        market.placeBet{value: 3 ether}(marketId, false);
        
        // Charlie bets YES
        vm.prank(charlie);
        market.placeBet{value: 1 ether}(marketId, true);
        
        PredictionMarket.Market memory m = market.getMarket(marketId);
        assertEq(m.totalYesStake, 3 ether);
        assertEq(m.totalNoStake, 3 ether);
    }
    
    function testCannotBetOnNonexistentMarket() public {
        vm.prank(alice);
        vm.expectRevert("Market does not exist");
        market.placeBet{value: 1 ether}(999, true);
    }
    
    function testCannotBetZeroAmount() public {
        vm.prank(alice);
        uint256 marketId = market.createMarket("Test", 7 days);
        
        vm.prank(bob);
        vm.expectRevert("Bet amount must be positive");
        market.placeBet{value: 0}(marketId, true);
    }
    
    function testCannotBetAfterMarketClosed() public {
        vm.prank(alice);
        uint256 marketId = market.createMarket("Test", 1 days);
        
        // Fast forward past end time
        vm.warp(block.timestamp + 2 days);
        
        vm.prank(bob);
        vm.expectRevert("Market closed");
        market.placeBet{value: 1 ether}(marketId, true);
    }
    
    // ============ Market Resolution Tests ============
    
    function testResolveMarket() public {
        vm.prank(alice);
        uint256 marketId = market.createMarket("Test", 1 days);
        
        vm.prank(bob);
        market.placeBet{value: 1 ether}(marketId, true);
        
        // Fast forward
        vm.warp(block.timestamp + 2 days);
        
        // Resolve as YES
        vm.prank(owner);
        market.resolveMarket(marketId, true);
        
        PredictionMarket.Market memory m = market.getMarket(marketId);
        assertTrue(m.resolved);
        assertTrue(m.outcome);
    }
    
    function testCannotResolveBeforeEndTime() public {
        vm.prank(alice);
        uint256 marketId = market.createMarket("Test", 7 days);
        
        vm.prank(owner);
        vm.expectRevert("Market not closed yet");
        market.resolveMarket(marketId, true);
    }
    
    function testOnlyOwnerCanResolve() public {
        vm.prank(alice);
        uint256 marketId = market.createMarket("Test", 1 days);
        
        vm.warp(block.timestamp + 2 days);
        
        vm.prank(alice);
        vm.expectRevert();
        market.resolveMarket(marketId, true);
    }
    
    // ============ Winnings Calculation Tests ============
    
    function testCalculateWinningsSimple() public {
        vm.prank(alice);
        uint256 marketId = market.createMarket("Test", 1 days);
        
        // Alice bets 2 ETH on YES
        vm.prank(alice);
        market.placeBet{value: 2 ether}(marketId, true);
        
        // Bob bets 2 ETH on NO
        vm.prank(bob);
        market.placeBet{value: 2 ether}(marketId, false);
        
        // Resolve as YES
        vm.warp(block.timestamp + 2 days);
        vm.prank(owner);
        market.resolveMarket(marketId, true);
        
        // Alice should win: 2 ETH (original) + 2 ETH (Bob's stake) = 4 ETH
        uint256 winnings = market.calculateWinnings(1);
        assertEq(winnings, 4 ether);
    }
    
    function testCalculateWinningsProportional() public {
        vm.prank(alice);
        uint256 marketId = market.createMarket("Test", 1 days);
        
        // YES side: Alice 3 ETH, Charlie 1 ETH (total 4 ETH)
        vm.prank(alice);
        market.placeBet{value: 3 ether}(marketId, true);
        
        vm.prank(charlie);
        market.placeBet{value: 1 ether}(marketId, true);
        
        // NO side: Bob 4 ETH
        vm.prank(bob);
        market.placeBet{value: 4 ether}(marketId, false);
        
        // Resolve as YES
        vm.warp(block.timestamp + 2 days);
        vm.prank(owner);
        market.resolveMarket(marketId, true);
        
        // Alice: 3 ETH + (3/4 * 4 ETH) = 3 + 3 = 6 ETH
        uint256 aliceWinnings = market.calculateWinnings(1);
        assertEq(aliceWinnings, 6 ether);
        
        // Charlie: 1 ETH + (1/4 * 4 ETH) = 1 + 1 = 2 ETH
        uint256 charlieWinnings = market.calculateWinnings(2);
        assertEq(charlieWinnings, 2 ether);
    }
    
    function testCalculateWinningsNoLosingSide() public {
        vm.prank(alice);
        uint256 marketId = market.createMarket("Test", 1 days);
        
        // Only YES bets, no NO bets
        vm.prank(alice);
        market.placeBet{value: 2 ether}(marketId, true);
        
        vm.prank(bob);
        market.placeBet{value: 1 ether}(marketId, true);
        
        // Resolve as YES
        vm.warp(block.timestamp + 2 days);
        vm.prank(owner);
        market.resolveMarket(marketId, true);
        
        // Should just return original stakes
        assertEq(market.calculateWinnings(1), 2 ether);
        assertEq(market.calculateWinnings(2), 1 ether);
    }
    
    // ============ Claim Winnings Tests ============
    
    function testClaimWinnings() public {
        vm.prank(alice);
        uint256 marketId = market.createMarket("Test", 1 days);
        
        // Alice bets YES
        vm.prank(alice);
        market.placeBet{value: 2 ether}(marketId, true);
        
        // Bob bets NO
        vm.prank(bob);
        market.placeBet{value: 2 ether}(marketId, false);
        
        // Resolve as YES
        vm.warp(block.timestamp + 2 days);
        vm.prank(owner);
        market.resolveMarket(marketId, true);
        
        uint256 aliceBalanceBefore = alice.balance;
        
        // Alice claims
        vm.prank(alice);
        market.claimWinnings(1);
        
        uint256 aliceBalanceAfter = alice.balance;
        
        // Alice should receive ~4 ETH minus 2% fee
        uint256 expectedPayout = 4 ether * 98 / 100; // 3.92 ETH
        assertEq(aliceBalanceAfter - aliceBalanceBefore, expectedPayout);
    }
    
    function testCannotClaimTwice() public {
        vm.prank(alice);
        uint256 marketId = market.createMarket("Test", 1 days);
        
        vm.prank(alice);
        market.placeBet{value: 1 ether}(marketId, true);
        
        vm.prank(bob);
        market.placeBet{value: 1 ether}(marketId, false);
        
        vm.warp(block.timestamp + 2 days);
        vm.prank(owner);
        market.resolveMarket(marketId, true);
        
        vm.prank(alice);
        market.claimWinnings(1);
        
        vm.prank(alice);
        vm.expectRevert("Already claimed");
        market.claimWinnings(1);
    }
    
    function testCannotClaimLosingBet() public {
        vm.prank(alice);
        uint256 marketId = market.createMarket("Test", 1 days);
        
        vm.prank(alice);
        market.placeBet{value: 1 ether}(marketId, true);
        
        vm.prank(bob);
        market.placeBet{value: 1 ether}(marketId, false);
        
        vm.warp(block.timestamp + 2 days);
        vm.prank(owner);
        market.resolveMarket(marketId, false); // NO wins
        
        vm.prank(alice);
        vm.expectRevert("Bet lost");
        market.claimWinnings(1);
    }
    
    // ============ View Function Tests ============
    
    function testGetUserBets() public {
        vm.prank(alice);
        uint256 marketId = market.createMarket("Test", 7 days);
        
        vm.prank(bob);
        market.placeBet{value: 1 ether}(marketId, true);
        
        vm.prank(bob);
        market.placeBet{value: 2 ether}(marketId, false);
        
        uint256[] memory bobBets = market.getUserBets(bob);
        assertEq(bobBets.length, 2);
        assertEq(bobBets[0], 1);
        assertEq(bobBets[1], 2);
    }
    
    function testGetMarketOdds() public {
        vm.prank(alice);
        uint256 marketId = market.createMarket("Test", 7 days);
        
        // 3 ETH YES, 1 ETH NO = 75% YES, 25% NO
        vm.prank(alice);
        market.placeBet{value: 3 ether}(marketId, true);
        
        vm.prank(bob);
        market.placeBet{value: 1 ether}(marketId, false);
        
        (uint256 yesOdds, uint256 noOdds) = market.getMarketOdds(marketId);
        assertEq(yesOdds, 7500); // 75%
        assertEq(noOdds, 2500);  // 25%
    }
    
    // ============ Admin Tests ============
    
    function testWithdrawFees() public {
        vm.prank(alice);
        uint256 marketId = market.createMarket("Test", 1 days);
        
        vm.prank(alice);
        market.placeBet{value: 2 ether}(marketId, true);
        
        vm.prank(bob);
        market.placeBet{value: 2 ether}(marketId, false);
        
        vm.warp(block.timestamp + 2 days);
        vm.prank(owner);
        market.resolveMarket(marketId, true);
        
        vm.prank(alice);
        market.claimWinnings(1);
        
        uint256 ownerBalanceBefore = owner.balance;
        
        vm.prank(owner);
        market.withdrawFees();
        
        uint256 ownerBalanceAfter = owner.balance;
        
        // Fee should be 2% of 4 ETH = 0.08 ETH
        assertEq(ownerBalanceAfter - ownerBalanceBefore, 0.08 ether);
    }
    
    function testSetPlatformFee() public {
        vm.prank(owner);
        market.setPlatformFee(5);
        
        assertEq(market.platformFeePercent(), 5);
    }
    
    function testCannotSetFeeTooHigh() public {
        vm.prank(owner);
        vm.expectRevert("Fee too high");
        market.setPlatformFee(11);
    }
}
