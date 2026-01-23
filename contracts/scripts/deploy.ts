import { ethers } from "hardhat";

async function main() {
    const currentTimestampInSeconds = Math.round(Date.now() / 1000);
    const unlockTime = currentTimestampInSeconds + 60;

    console.log("Deploying AttentionRoulette to Monad Testnet...");

    const AttentionRoulette = await ethers.getContractFactory("AttentionRoulette");
    const attentionRoulette = await AttentionRoulette.deploy();

    await attentionRoulette.waitForDeployment();

    console.log(
        `AttentionRoulette deployed to ${await attentionRoulette.getAddress()}`
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
