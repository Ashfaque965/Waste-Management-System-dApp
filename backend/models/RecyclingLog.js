// backend/models/RecyclingLog.js
const mongoose = require('mongoose');

const recyclingLogSchema = new mongoose.Schema(
  {
    recordId: {
      type: Number,
      required: true,
      unique: true,
    },
    blockchainTxHash: {
      type: String,
      required: true,
      unique: true,
    },
    recyclerAddress: {
      type: String,
      required: true,
      lowercase: true,
    },
    collectionId: {
      type: Number,
      required: true,
    },
    materialType: {
      type: String,
      enum: ['Plastic', 'Metal', 'Glass', 'Paper', 'Organic', 'Electronic'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    processDescription: String,
    ipfsProcessHash: String,
    submissionTime: {
      type: Date,
      required: true,
    },
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Disputed'],
      default: 'Pending',
    },
    verifiedBy: String,
    verificationTime: Date,
    verificationNotes: String,
    reward: Number,
    environmentalImpact: {
      co2Saved: Number,
      waterSaved: Number,
      energySaved: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RecyclingLog', recyclingLogSchema);
