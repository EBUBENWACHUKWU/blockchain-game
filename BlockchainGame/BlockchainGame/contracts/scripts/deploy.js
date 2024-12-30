const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying contracts...");

    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const balance = await deployer.getBalance();
    console.log("Deployer balance:", ethers.utils.formatEther(balance), "ETH");

    // Deploy BlockchainGame contract
    const BlockchainGame = await ethers.getContractFactory("BlockchainGame");
    const blockchainGame = await BlockchainGame.deploy();
    await blockchainGame.deployed();

    console.log("Contract deployed to:", blockchainGame.address);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
