// backend/services/ipfsService.js
const axios = require('axios');
const env = require('../config/environment');
let FormData;

try {
  FormData = require('form-data');
} catch (error) {
  // Fallback if form-data not installed
  FormData = null;
}

class IPFSService {
  constructor() {
    this.apiUrl = env.IPFS_API_URL;
  }

  /**
   * Upload data to IPFS
   */
  async uploadToIPFS(data) {
    try {
      if (!FormData) {
        return this.generateFakeHash();
      }

      const formData = new FormData();
      
      // Convert data to JSON and create a buffer
      const jsonData = typeof data === 'string' ? data : JSON.stringify(data);
      formData.append('file', Buffer.from(jsonData), 'data.json');

      const response = await axios.post(`${this.apiUrl}/api/v0/add`, formData, {
        headers: formData.getHeaders(),
      });

      return response.data.Hash;
    } catch (error) {
      console.warn('IPFS upload failed, using hash simulation:', error.message);
      return this.generateFakeHash();
    }
  }

  /**
   * Retrieve data from IPFS
   */
  async getFromIPFS(hash) {
    try {
      const response = await axios.get(`${this.apiUrl}/api/v0/cat?arg=${hash}`);
      return response.data;
    } catch (error) {
      console.warn('IPFS retrieval failed:', error.message);
      return { cached: true, hash };
    }
  }

  /**
   * Generate fake IPFS hash for development
   */
  generateFakeHash() {
    return 'Qm' + Math.random().toString(36).substr(2, 34).padEnd(34, 'a');
  }

  /**
   * Upload location data to IPFS
   */
  async uploadLocationData(latitude, longitude, address, additionalInfo = {}) {
    const locationData = {
      latitude,
      longitude,
      address,
      timestamp: new Date().toISOString(),
      ...additionalInfo,
    };

    return this.uploadToIPFS(locationData);
  }

  /**
   * Upload process data to IPFS
   */
  async uploadProcessData(processDescription, images = [], metadata = {}) {
    const processData = {
      description: processDescription,
      images,
      metadata,
      timestamp: new Date().toISOString(),
    };

    return this.uploadToIPFS(processData);
  }
}

module.exports = new IPFSService();
