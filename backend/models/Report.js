// backend/models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reportType: {
      type: String,
      enum: ['monthly', 'yearly', 'custom'],
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
    },
    totalWasteCollected: {
      type: Number,
      required: true,
    },
    totalWasteVerified: {
      type: Number,
      required: true,
    },
    totalCollections: {
      type: Number,
      required: true,
    },
    totalRecycled: {
      type: Number,
      required: true,
    },
    recyclingRate: {
      type: Number,
    },
    wasteBreakdown: {
      organic: Number,
      plastic: Number,
      metal: Number,
      glass: Number,
      paper: Number,
      electronic: Number,
      hazardous: Number,
    },
    environmentalImpact: {
      co2Saved: Number,
      waterSaved: Number,
      energySaved: Number,
    },
    topCollectors: [
      {
        address: String,
        name: String,
        wasteCollected: Number,
      },
    ],
    topRecyclers: [
      {
        address: String,
        name: String,
        materialRecycled: Number,
      },
    ],
    reportHash: String,
    ipfsHash: String,
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    generatedBy: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
