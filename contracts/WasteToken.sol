// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WasteToken
 * @dev ERC20 token for rewarding waste collection and recycling participation
 */
contract WasteToken is ERC20, Ownable {
    
    // Mapping to track token balance for recycling rewards
    mapping(address => uint256) public recyclingRewards;
    
    // Event for token minting
    event TokensMinted(address indexed to, uint256 amount, string reason);
    
    // Event for reward claimed
    event RewardClaimed(address indexed claimer, uint256 amount);

    constructor() ERC20("Waste Management Token", "WMT") {
        // Initial supply can be minted by owner
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    /**
     * @dev Mint tokens for waste collection rewards
     * @param to Address to receive tokens
     * @param amount Amount of tokens to mint
     * @param reason Reason for minting (e.g., "collection", "recycling")
     */
    function mintReward(address to, uint256 amount, string memory reason) 
        external 
        onlyOwner 
    {
        _mint(to, amount);
        emit TokensMinted(to, amount, reason);
    }

    /**
     * @dev Award tokens for successful recycling
     * @param participant Address of participant
     * @param amount Amount of tokens to award
     */
    function awardRecyclingTokens(address participant, uint256 amount) 
        external 
        onlyOwner 
    {
        recyclingRewards[participant] += amount;
        _mint(participant, amount);
        emit TokensMinted(participant, amount, "recycling_reward");
    }

    /**
     * @dev Claim accumulated recycling rewards
     */
    function claimRecyclingRewards() external {
        uint256 rewards = recyclingRewards[msg.sender];
        require(rewards > 0, "No rewards to claim");
        
        recyclingRewards[msg.sender] = 0;
        emit RewardClaimed(msg.sender, rewards);
    }

    /**
     * @dev Get recycling rewards for an address
     * @param account Address to check
     * @return Reward amount
     */
    function getRecyclingRewards(address account) external view returns (uint256) {
        return recyclingRewards[account];
    }
}
