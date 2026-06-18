// frontend/src/services/web3Service.js
import { ethers } from 'ethers';
import { ETHEREUM_CONFIG } from '../config/constants';

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.account = null;
  }

  /**
   * Initialize Web3 with MetaMask or other wallet provider
   */
  async initializeWeb3() {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask or another Web3 wallet provider');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      this.account = accounts[0];

      // Create provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      return {
        account: this.account,
        provider: this.provider,
      };
    } catch (error) {
      console.error('Failed to initialize Web3:', error);
      throw error;
    }
  }

  /**
   * Get current account
   */
  async getAccount() {
    if (this.signer) {
      return await this.signer.getAddress();
    }
    return null;
  }

  /**
   * Get account balance
   */
  async getBalance() {
    if (!this.provider || !this.account) {
      throw new Error('Web3 not initialized');
    }
    const balance = await this.provider.getBalance(this.account);
    return ethers.formatEther(balance);
  }

  /**
   * Sign a message
   */
  async signMessage(message) {
    if (!this.signer) {
      throw new Error('Signer not available');
    }
    return await this.signer.signMessage(message);
  }

  /**
   * Watch for account changes
   */
  onAccountChange(callback) {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        this.account = accounts[0];
        callback(this.account);
      });
    }
  }

  /**
   * Watch for network changes
   */
  onNetworkChange(callback) {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (chainId) => {
        callback(parseInt(chainId, 16));
      });
    }
  }

  /**
   * Get network info
   */
  async getNetworkInfo() {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    const network = await this.provider.getNetwork();
    return {
      name: network.name,
      chainId: network.chainId,
    };
  }

  /**
   * Check if chain is correct
   */
  async isCorrectChain() {
    const network = await this.getNetworkInfo();
    return network.chainId === ETHEREUM_CONFIG.CHAIN_ID;
  }

  /**
   * Switch to correct chain
   */
  async switchToCorrectChain() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${ETHEREUM_CONFIG.CHAIN_ID.toString(16)}` }],
      });
    } catch (error) {
      console.error('Failed to switch chain:', error);
      throw error;
    }
  }
}

export default new Web3Service();
