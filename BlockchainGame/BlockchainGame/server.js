require('dotenv').config();
const express = require("express");
const cors = require("cors");
const ethers = require("ethers");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Network and Wallet Setup
const networkUrl = process.env.LOCAL_URL; // Ensure this is correctly set in your .env file
const provider = new ethers.providers.JsonRpcProvider(networkUrl); // Corrected this line

const privateKey = process.env.LOCAL_PRIVATE_KEY; // Ensure this is correctly set in your .env file
const wallet = new ethers.Wallet(privateKey, provider);

// Contract Setup
const contractABI = [
    "function mintCard(address to, string memory name, uint256 attack, uint256 defense) public",
    "function getCardsByOwner(address owner) public view returns (uint256[] memory)",
    "function getCardDetails(uint256 tokenId) public view returns (string memory, uint256, uint256)",
    "function battle(uint256 tokenId1, uint256 tokenId2) public view returns (address)",
    "function tradeCard(address to, uint256 tokenId) public"
];
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Routes

// Root Route
app.get("/", (req, res) => {
    res.send("Welcome to the Blockchain Game API! Use the available endpoints to interact with the game.");
});

// Mint card route
app.post("/mint", async (req, res) => {
    try {
        const { to, name, attack, defense } = req.body;

        // Validate inputs
        console.log('Received "to" address:', to);
        if (typeof to !== 'string' || !ethers.utils.isAddress(to)) { // Access isAddress from ethers.utils
            return res.status(400).send("Invalid or missing 'to' address");
        }
        if (!name || typeof name !== "string" || name.trim() === "") {
            return res.status(400).send("Invalid or missing 'name'");
        }
        if (typeof attack !== "number" || attack <= 0) {
            return res.status(400).send("Invalid 'attack' value");
        }
        if (typeof defense !== "number" || defense <= 0) {
            return res.status(400).send("Invalid 'defense' value");
        }

        // Proceed with minting the card
        const tx = await contract.mintCard(to, name, attack, defense);
        await tx.wait(); // Wait for the transaction to be mined

        res.send("Card minted successfully");
    } catch (error) {
        console.error("Error minting card:", error);
        res.status(500).send("Internal Server Error: Error minting card");
    }
});

// Get Cards by Owner Route
app.get("/cards/:owner", async (req, res) => {
    try {
        const owner = req.params.owner;

        // Validate address
        if (!ethers.utils.isAddress(owner)) {
            return res.status(400).send("Invalid owner address.");
        }

        const cards = await contract.getCardsByOwner(owner);
        res.json({ cards });
    } catch (error) {
        console.error("Error fetching cards:", error);
        res.status(500).send("Error fetching cards.");
    }
});

// Battle Cards Route
app.post("/battle", async (req, res) => {
    try {
        const { tokenId1, tokenId2 } = req.body;

        if (!tokenId1 || !tokenId2) {
            return res.status(400).send("Both token IDs are required.");
        }

        const winner = await contract.battle(tokenId1, tokenId2);
        res.json({ winner });
    } catch (error) {
        console.error("Error during battle:", error);
        res.status(500).send("Error during battle.");
    }
});

// Trade Card Route
app.post("/trade", async (req, res) => {
    try {
        const { to, tokenId } = req.body;

        if (!to || !ethers.utils.isAddress(to)) {
            return res.status(400).send("Invalid 'to' address.");
        }
        if (!tokenId) {
            return res.status(400).send("Invalid or missing token ID.");
        }

        const tx = await contract.tradeCard(to, tokenId);
        await tx.wait();

        res.send("Card traded successfully!");
    } catch (error) {
        console.error("Error trading card:", error);
        res.status(500).send("Error trading card.");
    }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
