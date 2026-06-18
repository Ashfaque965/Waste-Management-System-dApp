# Smart Contracts Documentation

## Overview

The Waste Management System consists of 4 core smart contracts:

1. **WasteToken** - ERC20 token for rewards
2. **WasteCollection** - Waste collection tracking
3. **RecyclingVerification** - Recycling verification and rewards
4. **ReportingService** - Automated reporting

---

## WasteToken Contract

ERC20 token for rewarding waste collection and recycling activities.

### Key Functions

#### `mintReward(address to, uint256 amount, string reason)`
Mint tokens as rewards.

**Parameters:**
- `to`: Recipient address
- `amount`: Token amount to mint
- `reason`: Reason for minting (e.g., "collection", "recycling")

**Emits:**
- `TokensMinted(address indexed to, uint256 amount, string reason)`

---

#### `awardRecyclingTokens(address participant, uint256 amount)`
Award tokens for successful recycling.

**Parameters:**
- `participant`: Recycler address
- `amount`: Token amount

---

#### `claimRecyclingRewards()`
Claim accumulated recycling rewards (callable by participant).

---

#### `getRecyclingRewards(address account) → uint256`
Get unclaimed recycling rewards.

---

## WasteCollection Contract

Tracks waste collection activities with verification and rewards.

### Key Enums

```solidity
enum WasteType { Organic, Plastic, Metal, Glass, Paper, Electronic, Hazardous, Mixed }
enum CollectionStatus { Pending, InProgress, Completed, Verified }
```

### Key Structures

```solidity
struct WasteCollectionRecord {
    uint256 id;
    address collector;
    WasteType wasteType;
    uint256 weight;           // in kg
    uint256 timestamp;
    CollectionStatus status;
    string locationHash;       // IPFS hash
    uint256 verificationTime;
    address verifier;
}

struct Collector {
    address wallet;
    uint256 totalCollected;    // total weight
    uint256 totalRewards;
    uint256 collectionCount;
    bool isActive;
}
```

### Key Functions

#### `registerCollector(address _collector)`
Register a new waste collector.

**Modifiers:** onlyOwner

**Events:**
- `CollectorRegistered(address indexed collector, uint256 timestamp)`

---

#### `authorizeVerifier(address _verifier)`
Authorize a verifier account.

**Modifiers:** onlyOwner

---

#### `recordCollection(WasteType _wasteType, uint256 _weight, string _locationHash)`
Record a waste collection activity.

**Parameters:**
- `_wasteType`: Type of waste
- `_weight`: Weight in kg
- `_locationHash`: IPFS hash with location data

**Requirements:**
- Collector must be registered
- Weight > 0
- Location hash must be provided

**Emits:**
- `CollectionRecorded(uint256 id, address collector, WasteType wasteType, uint256 weight, uint256 timestamp)`

---

#### `verifyCollection(uint256 _collectionId)`
Verify a waste collection by authorized verifier.

**Requirements:**
- Caller must be authorized verifier
- Collection must not already be verified

**Emits:**
- `CollectionVerified(uint256 id, address verifier, uint256 timestamp)`
- `RewardAllocated(uint256 id, address collector, uint256 rewardAmount)`

---

#### `calculateReward(WasteType _wasteType, uint256 _weight) → uint256`
Calculate reward for waste collection.

**Formula:** weight * rewardPerKg[wasteType]

---

#### `setRewardPerKg(WasteType _wasteType, uint256 _amount)`
Set reward per kg for specific waste type.

**Modifiers:** onlyOwner

**Default Rewards:**
- Organic: 0.01 tokens/kg
- Plastic: 0.02 tokens/kg
- Metal: 0.03 tokens/kg
- Glass: 0.02 tokens/kg
- Paper: 0.01 tokens/kg
- Electronic: 0.05 tokens/kg
- Hazardous: 0.10 tokens/kg
- Mixed: 0.01 tokens/kg

---

#### `getCollector(address _address) → Collector`
Get collector details.

---

#### `getCollection(uint256 _collectionId) → WasteCollectionRecord`
Get collection record.

---

#### `getCollectorCollections(address _collector) → uint256[]`
Get all collection IDs for a collector.

---

## RecyclingVerification Contract

Verifies recycling activities and tracks material statistics.

### Key Enums

```solidity
enum MaterialType { Plastic, Metal, Glass, Paper, Organic, Electronic }
enum VerificationStatus { Pending, Approved, Rejected, Disputed }
```

### Key Structures

```solidity
struct RecyclingRecord {
    uint256 id;
    uint256 collectionId;       // Reference to WasteCollection ID
    address recycler;
    MaterialType material;
    uint256 quantity;           // in kg
    string processHash;         // IPFS hash
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
    uint256 recycleRate;        // percentage (0-100)
}
```

### Key Functions

#### `registerRecycler(address _recycler)`
Register a new recycler.

**Modifiers:** onlyOwner

---

#### `submitRecyclingRecord(uint256 _collectionId, MaterialType _material, uint256 _quantity, string _processHash)`
Submit a recycling record for verification.

**Requirements:**
- Recycler must be registered
- Quantity > 0
- Process hash required

**Emits:**
- `RecyclingSubmitted(uint256 id, uint256 collectionId, address recycler, MaterialType material, uint256 quantity, uint256 timestamp)`

---

#### `verifyRecyclingRecord(uint256 _recordId, bool _approved, string _notes)`
Verify a recycling record.

**Requirements:**
- Caller must be authorized verifier
- Record status must be Pending

**Logic:**
- If approved: Updates material stats, increments successful verifications
- If rejected: Increments failed verifications

**Emits:**
- `RecyclingVerified(uint256 id, address verifier, bool approved, uint256 timestamp)`
- `MaterialStatsUpdated(MaterialType material, uint256 totalQuantity, uint256 totalVerified)` (if approved)

---

#### `getRecyclingReward(uint256 _recordId) → uint256`
Get reward for approved recycling record.

**Formula:** quantity * rewardPerKg[material]

**Default Rewards:**
- Plastic: 0.03 tokens/kg
- Metal: 0.05 tokens/kg
- Glass: 0.02 tokens/kg
- Paper: 0.01 tokens/kg
- Organic: 0.01 tokens/kg
- Electronic: 0.10 tokens/kg

---

#### `getRecyclerStats(address _recycler) → Recycler`
Get recycler statistics.

---

#### `getMaterialStats(MaterialType _material) → RecycledMaterial`
Get material statistics including recycle rate.

---

## ReportingService Contract

Generates automated reports with environmental impact metrics.

### Key Functions

#### `generateMonthlyReport(uint256 _year, uint256 _month, uint256 _totalWasteCollected, uint256 _totalWasteVerified, uint256 _totalCollections, uint256 _totalRecycled, string _reportHash)`
Generate a monthly report.

**Requirements:**
- Month between 1-12
- Report hash required

**Calculates:**
- Recycling rate: (totalRecycled / totalWasteVerified) * 100
- Environmental impact

**Emits:**
- `MonthlyReportGenerated(uint256 year, uint256 month, uint256 totalCollected, uint256 totalRecycled, string reportHash, uint256 timestamp)`

---

#### `generateYearlyReport(uint256 _year, uint256 _totalWasteCollected, uint256 _totalWasteVerified, uint256 _totalCollections, uint256 _totalRecycled, string _reportHash)`
Generate a yearly report.

---

### Environmental Impact Constants

```solidity
uint256 CO2_PER_KG_RECYCLED = 3;      // 3 kg CO2 saved per kg recycled
uint256 WATER_PER_KG_RECYCLED = 10;   // 10L water saved per kg recycled
uint256 ENERGY_PER_KG_RECYCLED = 2;   // 2 kWh energy saved per kg recycled
```

---

## Deployment

### Local Deployment

```bash
npx hardhat run deploy.js --network localhost
```

### Testnet Deployment

```bash
npx hardhat run deploy.js --network sepolia
```

---

## Security Features

- **ReentrancyGuard**: Prevents reentrancy attacks
- **Access Control**: Owner-based permissions
- **Input Validation**: Checks on all public functions
- **OpenZeppelin Contracts**: Audited and battle-tested

---

## Gas Optimization

- Compiler optimization enabled
- Efficient data structures
- Minimal storage writes

---

**Contract Verification:** Use Etherscan for mainnet/testnet verification

```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS "constructor args"
```

---

**Last Updated:** January 2026
