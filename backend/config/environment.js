// backend/config/environment.js
require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/waste-management',
  
  // Blockchain
  ETHEREUM_RPC_URL: process.env.ETHEREUM_RPC_URL || 'http://localhost:8545',
  ETHEREUM_NETWORK: process.env.ETHEREUM_NETWORK || 'localhost',
  CHAIN_ID: process.env.CHAIN_ID || 31337,
  
  // Smart Contracts
  WASTE_TOKEN_ADDRESS: process.env.WASTE_TOKEN_ADDRESS,
  WASTE_COLLECTION_ADDRESS: process.env.WASTE_COLLECTION_ADDRESS,
  RECYCLING_VERIFICATION_ADDRESS: process.env.RECYCLING_VERIFICATION_ADDRESS,
  REPORTING_SERVICE_ADDRESS: process.env.REPORTING_SERVICE_ADDRESS,
  
  // Private Keys (use environment variables)
  DEPLOYER_PRIVATE_KEY: process.env.DEPLOYER_PRIVATE_KEY,
  
  // API Keys
  IPFS_API_URL: process.env.IPFS_API_URL || 'http://localhost:5001',
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // JWT Secret
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
};
