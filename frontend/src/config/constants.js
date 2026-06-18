// frontend/src/config/constants.js
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const ETHEREUM_CONFIG = {
  RPC_URL: process.env.REACT_APP_ETHEREUM_RPC_URL || 'http://localhost:8545',
  CHAIN_ID: parseInt(process.env.REACT_APP_CHAIN_ID || '31337'),
  NETWORK_NAME: process.env.REACT_APP_ETHEREUM_NETWORK || 'localhost',
};

export const CONTRACT_ADDRESSES = {
  WASTE_TOKEN: process.env.REACT_APP_WASTE_TOKEN_ADDRESS,
  WASTE_COLLECTION: process.env.REACT_APP_WASTE_COLLECTION_ADDRESS,
  RECYCLING_VERIFICATION: process.env.REACT_APP_RECYCLING_VERIFICATION_ADDRESS,
  REPORTING_SERVICE: process.env.REACT_APP_REPORTING_SERVICE_ADDRESS,
};

export const WASTE_TYPES = [
  'Organic',
  'Plastic',
  'Metal',
  'Glass',
  'Paper',
  'Electronic',
  'Hazardous',
  'Mixed',
];

export const MATERIAL_TYPES = ['Plastic', 'Metal', 'Glass', 'Paper', 'Organic', 'Electronic'];

export const COLLECTION_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'InProgress',
  COMPLETED: 'Completed',
  VERIFIED: 'Verified',
};

export const VERIFICATION_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  DISPUTED: 'Disputed',
};
