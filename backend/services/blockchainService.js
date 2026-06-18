// backend/services/blockchainService.js
const { ethers } = require('ethers');
const env = require('../config/environment');

class BlockchainService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(env.ETHEREUM_RPC_URL);
    this.signer = null;
    this.contracts = {};
  }

  /**
   * Initialize blockchain connection and contracts
   */
  async initialize(privateKey) {
    try {
      this.signer = new ethers.Wallet(privateKey, this.provider);
      console.log('Blockchain service initialized');
    } catch (error) {
      console.error('Failed to initialize blockchain service:', error);
      throw error;
    }
  }

  /**
   * Record waste collection on blockchain
   */
  async recordWasteCollection(collectorAddress, wasteType, weight, locationHash) {
    try {
      if (!this.signer) {
        throw new Error('Blockchain service not initialized');
      }

      // Call smart contract to record collection
      const tx = await this.contracts.wasteCollection.recordCollection(
        wasteType,
        ethers.parseUnits(weight.toString(), 'wei'),
        locationHash
      );

      const receipt = await tx.wait();
      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
      };
    } catch (error) {
      console.error('Error recording waste collection:', error);
      throw error;
    }
  }

  /**
   * Verify waste collection
   */
  async verifyWasteCollection(collectionId) {
    try {
      if (!this.signer) {
        throw new Error('Blockchain service not initialized');
      }

      const tx = await this.contracts.wasteCollection.verifyCollection(collectionId);
      const receipt = await tx.wait();

      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
      };
    } catch (error) {
      console.error('Error verifying waste collection:', error);
      throw error;
    }
  }

  /**
   * Submit recycling record
   */
  async submitRecyclingRecord(collectionId, materialType, quantity, processHash) {
    try {
      if (!this.signer) {
        throw new Error('Blockchain service not initialized');
      }

      const tx = await this.contracts.recyclingVerification.submitRecyclingRecord(
        collectionId,
        materialType,
        ethers.parseUnits(quantity.toString(), 'wei'),
        processHash
      );

      const receipt = await tx.wait();
      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
      };
    } catch (error) {
      console.error('Error submitting recycling record:', error);
      throw error;
    }
  }

  /**
   * Verify recycling record
   */
  async verifyRecyclingRecord(recordId, approved, notes) {
    try {
      if (!this.signer) {
        throw new Error('Blockchain service not initialized');
      }

      const tx = await this.contracts.recyclingVerification.verifyRecyclingRecord(
        recordId,
        approved,
        notes
      );

      const receipt = await tx.wait();
      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
      };
    } catch (error) {
      console.error('Error verifying recycling record:', error);
      throw error;
    }
  }

  /**
   * Get collector details from blockchain
   */
  async getCollectorDetails(address) {
    try {
      const collector = await this.contracts.wasteCollection.getCollector(address);
      return {
        wallet: collector.wallet,
        totalCollected: ethers.formatUnits(collector.totalCollected, 'wei'),
        totalRewards: ethers.formatUnits(collector.totalRewards, 'wei'),
        collectionCount: collector.collectionCount.toString(),
        isActive: collector.isActive,
      };
    } catch (error) {
      console.error('Error fetching collector details:', error);
      throw error;
    }
  }

  /**
   * Get collection record from blockchain
   */
  async getCollectionRecord(collectionId) {
    try {
      const record = await this.contracts.wasteCollection.getCollection(collectionId);
      return {
        id: record.id.toString(),
        collector: record.collector,
        wasteType: record.wasteType,
        weight: ethers.formatUnits(record.weight, 'wei'),
        timestamp: new Date(record.timestamp * 1000),
        status: record.status,
        locationHash: record.locationHash,
      };
    } catch (error) {
      console.error('Error fetching collection record:', error);
      throw error;
    }
  }

  /**
   * Get account balance
   */
  async getBalance(address) {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }

  /**
   * Get transaction receipt
   */
  async getTransactionReceipt(txHash) {
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);
      return receipt;
    } catch (error) {
      console.error('Error fetching transaction receipt:', error);
      throw error;
    }
  }
}

module.exports = new BlockchainService();
