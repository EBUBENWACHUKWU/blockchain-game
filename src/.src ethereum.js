import { ethers } from "ethers";

// Initialize provider and signer to interact with Ethereum network
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

export const connectWallet = async () => {
    try {
        // Requesting account access from the user
        await provider.send("eth_requestAccounts", []);
        console.log("Wallet connected!");
        const address = await signer.getAddress();
        console.log("Connected account:", address);
        return address;
    } catch (error) {
        console.error("Error connecting wallet:", error);
        throw error;
    }
};

// Exporting provider and signer for use in other components
export { provider, signer };
