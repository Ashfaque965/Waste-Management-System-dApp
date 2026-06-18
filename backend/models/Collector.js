// backend/models/Collector.js
const mongoose = require('mongoose');

const collectorSchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^0x[a-fA-F0-9]{40}$/,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    location: {
      latitude: Number,
      longitude: Number,
      address: String,
    },
    phoneNumber: String,
    profileImage: String,
    totalWasteCollected: {
      type: Number,
      default: 0,
    },
    totalRewards: {
      type: Number,
      default: 0,
    },
    collectionCount: {
      type: Number,
      default: 0,
    },
    verificationScore: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    lastCollectionDate: Date,
    status: {
      type: String,
      enum: ['pending', 'verified', 'active', 'inactive'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Collector', collectorSchema);
