const { ethers } = require("hardhat");

async function main() {
    // Fetch the deployer account (signer)
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Get the deployer's account balance
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("Account balance (in wei):", balance.toString());

    // Ensure sufficient balance
    const requiredBalance = ethers.parseEther("1"); // 1 ETH in wei
    if (balance < requiredBalance) {
        throw new Error("Insufficient balance for deployment.");
    }

    // Deploy the contract
    const BlockchainGame = await ethers.getContractFactory("BlockchainGame");
    const blockchainGame = await BlockchainGame.deploy(); // No arguments required

    // Wait for the deployment to complete
    await blockchainGame.waitForDeployment();

    // Retrieve the deployed contract address
    console.log("Contract deployed to:", await blockchainGame.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
