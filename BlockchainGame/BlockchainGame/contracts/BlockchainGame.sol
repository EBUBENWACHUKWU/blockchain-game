// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BlockchainGame {
    struct Card {
        string name;
        uint256 attackPoints;
        uint256 defensePoints;
        address owner;
    }

    mapping(uint256 => Card) public cards;
    mapping(address => uint256[]) public ownerCards;
    uint256 public nextTokenId;

    event CardMinted(uint256 tokenId, address owner, string name, uint256 attack, uint256 defense);
    event CardTraded(uint256 tokenId, address from, address to);
    event BattleResult(uint256 tokenId1, uint256 tokenId2, address winner);

    // Mint a new card
    function mintCard(
        address to,
        string memory name,
        uint256 attack,
        uint256 defense
    ) public {
        cards[nextTokenId] = Card(name, attack, defense, to);
        ownerCards[to].push(nextTokenId);
        emit CardMinted(nextTokenId, to, name, attack, defense);
        nextTokenId++;
    }

    // Get all cards owned by an address
    function getCardsByOwner(address owner) public view returns (uint256[] memory) {
        return ownerCards[owner];
    }

    // Get card details
    function getCardDetails(uint256 tokenId)
        public
        view
        returns (
            string memory,
            uint256,
            uint256
        )
    {
        Card memory card = cards[tokenId];
        require(card.owner != address(0), "Card does not exist");
        return (card.name, card.attackPoints, card.defensePoints);
    }

    // Battle two cards and determine the winner
    function battle(uint256 tokenId1, uint256 tokenId2) public view returns (address) {
        Card memory card1 = cards[tokenId1];
        Card memory card2 = cards[tokenId2];

        require(card1.owner != address(0) && card2.owner != address(0), "Card does not exist");

        uint256 power1 = card1.attackPoints + card1.defensePoints;
        uint256 power2 = card2.attackPoints + card2.defensePoints;

        if (power1 > power2) {
            return card1.owner;
        } else if (power2 > power1) {
            return card2.owner;
        } else {
            return address(0); // Draw
        }
    }

    // Trade a card
    function tradeCard(address to, uint256 tokenId) public {
        Card storage card = cards[tokenId];
        require(msg.sender == card.owner, "Only the owner can trade the card");

        // Remove the card from the current owner's list
        uint256[] storage fromCards = ownerCards[card.owner];
        for (uint256 i = 0; i < fromCards.length; i++) {
            if (fromCards[i] == tokenId) {
                fromCards[i] = fromCards[fromCards.length - 1];
                fromCards.pop();
                break;
            }
        }

        // Transfer card ownership
        card.owner = to;
        ownerCards[to].push(tokenId);

        emit CardTraded(tokenId, msg.sender, to);
    }
}
