export const PREDICTION_MARKET_ADDRESS = "0xE5B7B04041A13B2Fe5AAf5dB1784f19EAc2878a0";

export const PREDICTION_MARKET_ABI = [
    {
        "type": "constructor",
        "inputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "FEE_DENOMINATOR",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "calculateWinnings",
        "inputs": [{ "name": "betId", "type": "uint256", "internalType": "uint256" }],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "claimWinnings",
        "inputs": [{ "name": "betId", "type": "uint256", "internalType": "uint256" }],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "collectedFees",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "createMarket",
        "inputs": [
            { "name": "question", "type": "string", "internalType": "string" },
            { "name": "duration", "type": "uint256", "internalType": "uint256" }
        ],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "getBet",
        "inputs": [{ "name": "betId", "type": "uint256", "internalType": "uint256" }],
        "outputs": [
            {
                "name": "",
                "type": "tuple",
                "internalType": "struct PredictionMarket.Bet",
                "components": [
                    { "name": "id", "type": "uint256", "internalType": "uint256" },
                    { "name": "marketId", "type": "uint256", "internalType": "uint256" },
                    { "name": "bettor", "type": "address", "internalType": "address" },
                    { "name": "side", "type": "bool", "internalType": "bool" },
                    { "name": "amount", "type": "uint256", "internalType": "uint256" },
                    { "name": "claimed", "type": "bool", "internalType": "bool" }
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getMarket",
        "inputs": [{ "name": "marketId", "type": "uint256", "internalType": "uint256" }],
        "outputs": [
            {
                "name": "",
                "type": "tuple",
                "internalType": "struct PredictionMarket.Market",
                "components": [
                    { "name": "id", "type": "uint256", "internalType": "uint256" },
                    { "name": "question", "type": "string", "internalType": "string" },
                    { "name": "totalYesStake", "type": "uint256", "internalType": "uint256" },
                    { "name": "totalNoStake", "type": "uint256", "internalType": "uint256" },
                    { "name": "endTime", "type": "uint256", "internalType": "uint256" },
                    { "name": "resolved", "type": "bool", "internalType": "bool" },
                    { "name": "outcome", "type": "bool", "internalType": "bool" },
                    { "name": "creator", "type": "address", "internalType": "address" },
                    { "name": "exists", "type": "bool", "internalType": "bool" }
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getMarketOdds",
        "inputs": [{ "name": "marketId", "type": "uint256", "internalType": "uint256" }],
        "outputs": [
            { "name": "yesOdds", "type": "uint256", "internalType": "uint256" },
            { "name": "noOdds", "type": "uint256", "internalType": "uint256" }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getUserBets",
        "inputs": [{ "name": "user", "type": "address", "internalType": "address" }],
        "outputs": [{ "name": "", "type": "uint256[]", "internalType": "uint256[]" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "nextBetId",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "nextMarketId",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "owner",
        "inputs": [],
        "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "placeBet",
        "inputs": [
            { "name": "marketId", "type": "uint256", "internalType": "uint256" },
            { "name": "side", "type": "bool", "internalType": "bool" }
        ],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "platformFeePercent",
        "inputs": [],
        "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "resolveMarket",
        "inputs": [
            { "name": "marketId", "type": "uint256", "internalType": "uint256" },
            { "name": "outcome", "type": "bool", "internalType": "bool" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "event",
        "name": "BetPlaced",
        "inputs": [
            { "name": "betId", "type": "uint256", "indexed": true, "internalType": "uint256" },
            { "name": "marketId", "type": "uint256", "indexed": true, "internalType": "uint256" },
            { "name": "bettor", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "side", "type": "bool", "indexed": false, "internalType": "bool" },
            { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "MarketCreated",
        "inputs": [
            { "name": "marketId", "type": "uint256", "indexed": true, "internalType": "uint256" },
            { "name": "question", "type": "string", "indexed": false, "internalType": "string" },
            { "name": "endTime", "type": "uint256", "indexed": false, "internalType": "uint256" },
            { "name": "creator", "type": "address", "indexed": true, "internalType": "address" }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "MarketResolved",
        "inputs": [
            { "name": "marketId", "type": "uint256", "indexed": true, "internalType": "uint256" },
            { "name": "outcome", "type": "bool", "indexed": false, "internalType": "bool" },
            { "name": "totalYesStake", "type": "uint256", "indexed": false, "internalType": "uint256" },
            { "name": "totalNoStake", "type": "uint256", "indexed": false, "internalType": "uint256" }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "WinningsClaimed",
        "inputs": [
            { "name": "betId", "type": "uint256", "indexed": true, "internalType": "uint256" },
            { "name": "bettor", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
        ],
        "anonymous": false
    }
] as const;
