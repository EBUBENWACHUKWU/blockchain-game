import React, { useState } from 'react';
import { ethers } from 'ethers'; // Ensure ethers is imported properly
import './App.css'; // Tailwind styles are included here

function App() {
  const [account, setAccount] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [cardName, setCardName] = useState('');
  const [attackPoints, setAttackPoints] = useState('');
  const [defensePoints, setDefensePoints] = useState('');

  const connectToMetaMask = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    } else {
      alert('Please install MetaMask!');
    }
  };

  const handleMintCard = async () => {
    if (!account) {
      alert('Connect to MetaMask first!');
      return;
    }
    if (!tokenId || !cardName || !attackPoints || !defensePoints) {
      alert('Please fill in all fields!');
      return;
    }

    console.log(`Minting Card:
      Token ID: ${tokenId}
      Name: ${cardName}
      Attack Points: ${attackPoints}
      Defense Points: ${defensePoints}`);

    // Correct usage for ethers v6
    const provider = new ethers.JsonRpcProvider(window.ethereum); // Corrected to JsonRpcProvider
    const signer = provider.getSigner();
    const contractAddress = "0xYourContractAddress";  // Replace with your contract address
    const contractABI = [
      "function mint(uint256 tokenId, string memory cardName, uint256 attackPoints, uint256 defensePoints) public"
    ];
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const tx = await contract.mint(tokenId, cardName, attackPoints, defensePoints);
      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      console.log("Minting successful! Transaction hash:", tx.hash);
      alert(`Minting successful! Transaction hash: ${tx.hash}`);
    } catch (error) {
      console.error("Minting failed:", error);
      alert("Minting failed. Check console for details.");
    }
  };

  return (
    <div className="App">
      <header className="header-container">
        <h1>Welcome to Blockchain Game</h1>
        {account ? (
          <p>Connected Account: {account}</p>
        ) : (
          <button onClick={connectToMetaMask} className="connect-btn">Connect to MetaMask</button>
        )}
      </header>

      <div className="form-container">
        <h2>Mint a Card</h2>
        <input
          type="text"
          placeholder="Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          className="form-input"
        />
        <input
          type="text"
          placeholder="Card Name"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          className="form-input"
        />
        <input
          type="number"
          placeholder="Attack Points"
          value={attackPoints}
          onChange={(e) => setAttackPoints(e.target.value)}
          className="form-input"
        />
        <input
          type="number"
          placeholder="Defense Points"
          value={defensePoints}
          onChange={(e) => setDefensePoints(e.target.value)}
          className="form-input"
        />
        <button onClick={handleMintCard} className="mint-btn">Mint Card</button>
      </div>
    </div>
  );
}

export default App;
