// backend/models/WasteCollectionLog.js
const mongoose = require('mongoose');

const wasteCollectionLogSchema = new mongoose.Schema(
  {
    collectionId: {
      type: Number,
      required: true,
      unique: true,
    },
    blockchainTxHash: {
      type: String,
      required: true,
      unique: true,
    },
    collectorAddress: {
      type: String,
      required: true,
      lowercase: true,
    },
    wasteType: {
      type: String,
      enum: ['Organic', 'Plastic', 'Metal', 'Glass', 'Paper', 'Electronic', 'Hazardous', 'Mixed'],
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    location: {
      latitude: Number,
      longitude: Number,
      address: String,
      ipfsHash: String,
    },
    timestamp: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'InProgress', 'Completed', 'Verified'],
      default: 'Pending',
    },
    verifiedBy: String,
    verificationTime: Date,
    notes: String,
    imageUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('WasteCollectionLog', wasteCollectionLogSchema);
