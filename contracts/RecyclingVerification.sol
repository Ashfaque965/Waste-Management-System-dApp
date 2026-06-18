// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title RecyclingVerification
 * @dev Smart contract for verifying recycling activities and tracking recycled materials
 */
contract RecyclingVerification is Ownable, ReentrancyGuard {

    enum MaterialType { 
        Plastic, 
        Metal, 
        Glass, 
        Paper, 
        Organic, 
        Electronic
    }

    enum VerificationStatus { 
        Pending, 
        Approved, 
        Rejected, 
        Disputed
    }

    struct RecyclingRecord {
        uint256 id;
        uint256 collectionId; // Reference to WasteCollection ID
        address recycler;
        MaterialType material;
        uint256 quantity; // in kg
        string processHash; // IPFS hash of recycling process data
        VerificationStatus status;
        uint256 submissionTime;
        uint256 verificationTime;
        address verifier;
        string notes;
    }

    struct RecycledMaterial {
        MaterialType material;
        uint256 totalQuantity;
        uint256 totalVerified;
        uint256 recycleRate; // percentage (0-100)
    }

    struct Recycler {
        address wallet;
        uint256 totalRecycled;
        uint256 successfulVerifications;
        uint256 failedVerifications;
        bool isActive;
    }

    // State variables
    uint256 public recyclingRecordCount = 0;
    mapping(uint256 => RecyclingRecord) public recyclingRecords;
    mapping(MaterialType => RecycledMaterial) public materialStats;
    mapping(address => Recycler) public recyclers;
    mapping(address => uint256[]) public recyclerRecords;

    // Reward system
    mapping(MaterialType => uint256) public rewardPerKg;

    // Authorized verifiers
    mapping(address => bool) public authorizedVerifiers;

    // Events
    event RecyclingSubmitted(
        uint256 indexed recordId,
        uint256 indexed collectionId,
        address indexed recycler,
        MaterialType material,
        uint256 quantity,
        uint256 timestamp
    );

    event RecyclingVerified(
        uint256 indexed recordId,
        address indexed verifier,
        bool approved,
        uint256 timestamp
    );

    event RecyclerRegistered(
        address indexed recycler,
        uint256 timestamp
    );

    event MaterialStatsUpdated(
        MaterialType material,
        uint256 totalQuantity,
        uint256 totalVerified
    );

    constructor() {
        // Set default rewards per kg for each material type
        rewardPerKg[MaterialType.Plastic] = 3e16; // 0.03 tokens per kg
        rewardPerKg[MaterialType.Metal] = 5e16; // 0.05 tokens per kg
        rewardPerKg[MaterialType.Glass] = 2e16; // 0.02 tokens per kg
        rewardPerKg[MaterialType.Paper] = 1e16; // 0.01 tokens per kg
        rewardPerKg[MaterialType.Organic] = 1e16; // 0.01 tokens per kg
        rewardPerKg[MaterialType.Electronic] = 10e16; // 0.10 tokens per kg

        // Initialize material stats
        materialStats[MaterialType.Plastic].material = MaterialType.Plastic;
        materialStats[MaterialType.Metal].material = MaterialType.Metal;
        materialStats[MaterialType.Glass].material = MaterialType.Glass;
        materialStats[MaterialType.Paper].material = MaterialType.Paper;
        materialStats[MaterialType.Organic].material = MaterialType.Organic;
        materialStats[MaterialType.Electronic].material = MaterialType.Electronic;

        // Register deployer as verifier
        authorizedVerifiers[msg.sender] = true;
    }

    /**
     * @dev Register a recycler
     */
    function registerRecycler(address _recycler) 
        external 
        onlyOwner 
    {
        require(_recycler != address(0), "Invalid address");
        require(!recyclers[_recycler].isActive, "Already registered");

        recyclers[_recycler] = Recycler({
            wallet: _recycler,
            totalRecycled: 0,
            successfulVerifications: 0,
            failedVerifications: 0,
            isActive: true
        });

        emit RecyclerRegistered(_recycler, block.timestamp);
    }

    /**
     * @dev Authorize a verifier
     */
    function authorizeVerifier(address _verifier) 
        external 
        onlyOwner 
    {
        require(_verifier != address(0), "Invalid address");
        authorizedVerifiers[_verifier] = true;
    }

    /**
     * @dev Submit a recycling record for verification
     * @param _collectionId Reference to collection ID
     * @param _material Type of material recycled
     * @param _quantity Quantity of material in kg
     * @param _processHash IPFS hash of process documentation
     */
    function submitRecyclingRecord(
        uint256 _collectionId,
        MaterialType _material,
        uint256 _quantity,
        string memory _processHash
    ) 
        external 
        nonReentrant
    {
        require(recyclers[msg.sender].isActive, "Not registered as recycler");
        require(_quantity > 0, "Quantity must be greater than 0");
        require(bytes(_processHash).length > 0, "Process hash required");

        recyclingRecordCount++;
        uint256 recordId = recyclingRecordCount;

        RecyclingRecord storage record = recyclingRecords[recordId];
        record.id = recordId;
        record.collectionId = _collectionId;
        record.recycler = msg.sender;
        record.material = _material;
        record.quantity = _quantity;
        record.processHash = _processHash;
        record.status = VerificationStatus.Pending;
        record.submissionTime = block.timestamp;

        recyclerRecords[msg.sender].push(recordId);
        recyclers[msg.sender].totalRecycled += _quantity;

        emit RecyclingSubmitted(
            recordId,
            _collectionId,
            msg.sender,
            _material,
            _quantity,
            block.timestamp
        );
    }

    /**
     * @dev Verify a recycling record
     * @param _recordId ID of record to verify
     * @param _approved Whether to approve or reject
     * @param _notes Verification notes
     */
    function verifyRecyclingRecord(
        uint256 _recordId,
        bool _approved,
        string memory _notes
    ) 
        external 
        nonReentrant
    {
        require(authorizedVerifiers[msg.sender], "Not authorized verifier");
        require(_recordId <= recyclingRecordCount && _recordId > 0, "Invalid record ID");

        RecyclingRecord storage record = recyclingRecords[_recordId];
        require(record.status == VerificationStatus.Pending, "Already verified");

        record.verificationTime = block.timestamp;
        record.verifier = msg.sender;
        record.notes = _notes;

        if (_approved) {
            record.status = VerificationStatus.Approved;
            recyclers[record.recycler].successfulVerifications++;

            // Update material statistics
            materialStats[record.material].totalQuantity += record.quantity;
            materialStats[record.material].totalVerified += record.quantity;
            
            // Update recycle rate
            if (materialStats[record.material].totalQuantity > 0) {
                materialStats[record.material].recycleRate = 
                    (materialStats[record.material].totalVerified * 100) / 
                    materialStats[record.material].totalQuantity;
            }

            emit MaterialStatsUpdated(
                record.material,
                materialStats[record.material].totalQuantity,
                materialStats[record.material].totalVerified
            );
        } else {
            record.status = VerificationStatus.Rejected;
            recyclers[record.recycler].failedVerifications++;
        }

        emit RecyclingVerified(_recordId, msg.sender, _approved, block.timestamp);
    }

    /**
     * @dev Get recycling reward for a record
     */
    function getRecyclingReward(uint256 _recordId) 
        external 
        view 
        returns (uint256) 
    {
        RecyclingRecord memory record = recyclingRecords[_recordId];
        require(record.status == VerificationStatus.Approved, "Record not approved");
        return record.quantity * rewardPerKg[record.material];
    }

    /**
     * @dev Get recycler statistics
     */
    function getRecyclerStats(address _recycler) 
        external 
        view 
        returns (Recycler memory) 
    {
        return recyclers[_recycler];
    }

    /**
     * @dev Get material statistics
     */
    function getMaterialStats(MaterialType _material) 
        external 
        view 
        returns (RecycledMaterial memory) 
    {
        return materialStats[_material];
    }

    /**
     * @dev Get recycler records
     */
    function getRecyclerRecords(address _recycler) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return recyclerRecords[_recycler];
    }

    /**
     * @dev Get recycling record
     */
    function getRecyclingRecord(uint256 _recordId) 
        external 
        view 
        returns (RecyclingRecord memory) 
    {
        return recyclingRecords[_recordId];
    }
}
