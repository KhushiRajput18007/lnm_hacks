import { ethers } from 'ethers';

// Human Readable ABI
export const ATTENTION_ROULETTE_ABI = [
    "event MarketCreated(uint256 indexed id, string question, uint256 expiresAt)",
    "event BetPlaced(uint256 indexed marketId, address indexed user, uint256 amount, uint8 side)",
    "event MarketResolved(uint256 indexed marketId, uint8 outcome)",
    "event RewardClaimed(uint256 indexed marketId, address indexed user, uint256 amount)",
    "function createMarket(string memory question, uint256 expiresAt) external",
    "function placeBet(uint256 marketId, uint8 side) external payable",
    "function resolveMarket(uint256 marketId, uint8 outcome) external",
    "function claimReward(uint256 marketId) external",
    "function markets(uint256) view returns (uint256 id, string question, uint256 expiresAt, uint256 yesPool, uint256 noPool, bool resolved, uint8 outcome)",
    "function bets(uint256, address) view returns (uint256 amount, uint8 side, bool claimed)"
];

// Enum mapping
export enum Side {
    YES = 0,
    NO = 1
}

export const getContract = (address: string, signerOrProvider: ethers.Signer | ethers.Provider) => {
    return new ethers.Contract(address, ATTENTION_ROULETTE_ABI, signerOrProvider);
}

export const createMarket = async (contractAddress: string, signer: ethers.Signer, question: string, expiresAt: number) => {
    const contract = getContract(contractAddress, signer);
    const tx = await contract.createMarket(question, expiresAt);
    return tx.wait();
}

export const placeBetOnChain = async (contractAddress: string, signer: ethers.Signer, marketId: number, side: Side, amountEth: string) => {
    const contract = getContract(contractAddress, signer);
    const tx = await contract.placeBet(marketId, side, { value: ethers.parseEther(amountEth) });
    return tx.wait();
}

export const resolveMarket = async (contractAddress: string, signer: ethers.Signer, marketId: number, outcome: Side) => {
    const contract = getContract(contractAddress, signer);
    const tx = await contract.resolveMarket(marketId, outcome);
    return tx.wait();
}

export const claimReward = async (contractAddress: string, signer: ethers.Signer, marketId: number) => {
    const contract = getContract(contractAddress, signer);
    const tx = await contract.claimReward(marketId);
    return tx.wait();
}
