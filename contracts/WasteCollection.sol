// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title WasteCollection
 * @dev Smart contract for tracking waste collection activities
 */
contract WasteCollection is Ownable, ReentrancyGuard {

    enum WasteType { 
        Organic, 
        Plastic, 
        Metal, 
        Glass, 
        Paper, 
        Electronic, 
        Hazardous,
        Mixed
    }

    enum CollectionStatus { 
        Pending, 
        InProgress, 
        Completed, 
        Verified 
    }

    struct WasteCollectionRecord {
        uint256 id;
        address collector;
        WasteType wasteType;
        uint256 weight; // in kg
        uint256 timestamp;
        CollectionStatus status;
        string locationHash; // IPFS hash for location data
        uint256 verificationTime;
        address verifier;
    }

    struct Collector {
        address wallet;
        uint256 totalCollected; // total weight collected
        uint256 totalRewards;
        uint256 collectionCount;
        bool isActive;
    }

    // State variables
    uint256 public collectionCount = 0;
    mapping(uint256 => WasteCollectionRecord) public collections;
    mapping(address => Collector) public collectors;
    mapping(address => uint256[]) public collectorCollections;

    // Reward amounts per kg for each waste type (in wei/tokens)
    mapping(WasteType => uint256) public rewardPerKg;

    // Authorized verifiers
    mapping(address => bool) public authorizedVerifiers;

    // Events
    event CollectionRecorded(
        uint256 indexed collectionId,
        address indexed collector,
        WasteType wasteType,
        uint256 weight,
        uint256 timestamp
    );

    event CollectionVerified(
        uint256 indexed collectionId,
        address indexed verifier,
        uint256 timestamp
    );

    event RewardAllocated(
        uint256 indexed collectionId,
        address indexed collector,
        uint256 rewardAmount
    );

    event CollectorRegistered(
        address indexed collector,
        uint256 timestamp
    );

    event VerifierAuthorized(
        address indexed verifier,
        uint256 timestamp
    );

    constructor() {
        // Set default rewards per kg for each waste type
        rewardPerKg[WasteType.Organic] = 1e16; // 0.01 tokens per kg
        rewardPerKg[WasteType.Plastic] = 2e16; // 0.02 tokens per kg
        rewardPerKg[WasteType.Metal] = 3e16; // 0.03 tokens per kg
        rewardPerKg[WasteType.Glass] = 2e16; // 0.02 tokens per kg
        rewardPerKg[WasteType.Paper] = 1e16; // 0.01 tokens per kg
        rewardPerKg[WasteType.Electronic] = 5e16; // 0.05 tokens per kg
        rewardPerKg[WasteType.Hazardous] = 10e16; // 0.10 tokens per kg
        rewardPerKg[WasteType.Mixed] = 1e16; // 0.01 tokens per kg

        // Register deployer as verifier
        authorizedVerifiers[msg.sender] = true;
    }

    /**
     * @dev Register a new waste collector
     */
    function registerCollector(address _collector) 
        external 
        onlyOwner 
    {
        require(_collector != address(0), "Invalid address");
        require(!collectors[_collector].isActive, "Already registered");

        collectors[_collector] = Collector({
            wallet: _collector,
            totalCollected: 0,
            totalRewards: 0,
            collectionCount: 0,
            isActive: true
        });

        emit CollectorRegistered(_collector, block.timestamp);
    }

    /**
     * @dev Authorize a verifier account
     */
    function authorizeVerifier(address _verifier) 
        external 
        onlyOwner 
    {
        require(_verifier != address(0), "Invalid address");
        authorizedVerifiers[_verifier] = true;
        emit VerifierAuthorized(_verifier, block.timestamp);
    }

    /**
     * @dev Record a waste collection activity
     * @param _wasteType Type of waste collected
     * @param _weight Weight of waste in kg
     * @param _locationHash IPFS hash containing location details
     */
    function recordCollection(
        WasteType _wasteType,
        uint256 _weight,
        string memory _locationHash
    ) 
        external 
        nonReentrant
    {
        require(collectors[msg.sender].isActive, "Not registered as collector");
        require(_weight > 0, "Weight must be greater than 0");
        require(bytes(_locationHash).length > 0, "Location hash required");

        collectionCount++;
        uint256 collectionId = collectionCount;

        WasteCollectionRecord storage record = collections[collectionId];
        record.id = collectionId;
        record.collector = msg.sender;
        record.wasteType = _wasteType;
        record.weight = _weight;
        record.timestamp = block.timestamp;
        record.status = CollectionStatus.Pending;
        record.locationHash = _locationHash;

        collectorCollections[msg.sender].push(collectionId);

        // Update collector stats
        collectors[msg.sender].totalCollected += _weight;
        collectors[msg.sender].collectionCount++;

        emit CollectionRecorded(
            collectionId,
            msg.sender,
            _wasteType,
            _weight,
            block.timestamp
        );
    }

    /**
     * @dev Verify a waste collection
     * @param _collectionId ID of collection to verify
     */
    function verifyCollection(uint256 _collectionId) 
        external 
        nonReentrant
    {
        require(authorizedVerifiers[msg.sender], "Not authorized verifier");
        require(_collectionId <= collectionCount && _collectionId > 0, "Invalid collection ID");
        
        WasteCollectionRecord storage record = collections[_collectionId];
        require(record.status != CollectionStatus.Verified, "Already verified");

        record.status = CollectionStatus.Verified;
        record.verificationTime = block.timestamp;
        record.verifier = msg.sender;

        // Calculate and allocate reward
        uint256 reward = calculateReward(record.wasteType, record.weight);
        collectors[record.collector].totalRewards += reward;

        emit CollectionVerified(_collectionId, msg.sender, block.timestamp);
        emit RewardAllocated(_collectionId, record.collector, reward);
    }

    /**
     * @dev Calculate reward for waste collection
     * @param _wasteType Type of waste
     * @param _weight Weight in kg
     * @return Reward amount
     */
    function calculateReward(WasteType _wasteType, uint256 _weight) 
        public 
        view 
        returns (uint256) 
    {
        return _weight * rewardPerKg[_wasteType];
    }

    /**
     * @dev Set reward per kg for a waste type
     */
    function setRewardPerKg(WasteType _wasteType, uint256 _amount) 
        external 
        onlyOwner 
    {
        rewardPerKg[_wasteType] = _amount;
    }

    /**
     * @dev Get collector details
     */
    function getCollector(address _address) 
        external 
        view 
        returns (Collector memory) 
    {
        return collectors[_address];
    }

    /**
     * @dev Get collection record
     */
    function getCollection(uint256 _collectionId) 
        external 
        view 
        returns (WasteCollectionRecord memory) 
    {
        return collections[_collectionId];
    }

    /**
     * @dev Get all collections for a collector
     */
    function getCollectorCollections(address _collector) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return collectorCollections[_collector];
    }
}
