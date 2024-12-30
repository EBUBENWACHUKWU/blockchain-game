
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // To use environment variables

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL; // Use the URL from the .env file
const PRIVATE_KEY = process.env.PRIVATE_KEY; // Use the private key from the .env file

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27", // Specify the Solidity version
  networks: {
    hardhat: {
      chainId: 31337, // Local Hardhat network (default)
    },
    localhost: {
      url: "http://127.0.0.1:8545", // Localhost for when you run `npx hardhat node`
      chainId: 31337, // Match the Hardhat network chain ID
    },
    sepolia: {
      url: SEPOLIA_RPC_URL, // Use the URL from the .env file
      accounts: [PRIVATE_KEY ], // Use the private key from the .env file
      chainId: 11155111, // Sepolia testnet chain ID
      timeout: 500000, // Set a higher timeout (in milliseconds)
    },
  },
};
