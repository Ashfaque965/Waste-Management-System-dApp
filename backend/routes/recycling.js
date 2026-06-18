// backend/routes/recycling.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const RecyclingLog = require('../models/RecyclingLog');
const blockchainService = require('../services/blockchainService');
const ipfsService = require('../services/ipfsService');

/**
 * Submit a recycling record
 */
router.post(
  '/submit',
  [
    body('recyclerAddress').matches(/^0x[a-fA-F0-9]{40}$/),
    body('collectionId').isInt({ min: 1 }),
    body('materialType').isIn(['Plastic', 'Metal', 'Glass', 'Paper', 'Organic', 'Electronic']),
    body('quantity').isFloat({ min: 0.1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        recyclerAddress,
        collectionId,
        materialType,
        quantity,
        processDescription,
        images,
      } = req.body;

      // Upload process data to IPFS
      const processHash = await ipfsService.uploadProcessData(processDescription, images, {
        recyclerAddress,
      });

      // Submit to blockchain
      const blockchainTx = await blockchainService.submitRecyclingRecord(
        collectionId,
        materialType,
        quantity,
        processHash
      );

      // Save to database
      const recyclingLog = new RecyclingLog({
        recordId: blockchainTx.blockNumber,
        blockchainTxHash: blockchainTx.transactionHash,
        recyclerAddress: recyclerAddress.toLowerCase(),
        collectionId,
        materialType,
        quantity,
        processDescription,
        ipfsProcessHash: processHash,
        submissionTime: new Date(),
        verificationStatus: 'Pending',
      });

      await recyclingLog.save();

      res.status(201).json({
        message: 'Recycling record submitted successfully',
        data: {
          recyclingLog,
          blockchain: blockchainTx,
        },
      });
    } catch (error) {
      console.error('Error submitting recycling record:', error);
      res.status(500).json({ error: 'Failed to submit recycling record' });
    }
  }
);

/**
 * Get all recycling records
 */
router.get('/', async (req, res) => {
  try {
    const { recyclerAddress, status, materialType } = req.query;
    const query = {};

    if (recyclerAddress) query.recyclerAddress = recyclerAddress.toLowerCase();
    if (status) query.verificationStatus = status;
    if (materialType) query.materialType = materialType;

    const records = await RecyclingLog.find(query)
      .sort({ submissionTime: -1 })
      .limit(100);

    res.json(records);
  } catch (error) {
    console.error('Error fetching recycling records:', error);
    res.status(500).json({ error: 'Failed to fetch recycling records' });
  }
});

/**
 * Verify a recycling record
 */
router.put('/:recordId/verify', async (req, res) => {
  try {
    const { recordId } = req.params;
    const { approved, verifiedBy, notes } = req.body;

    // Update blockchain
    await blockchainService.verifyRecyclingRecord(parseInt(recordId), approved, notes);

    // Update database
    const recyclingLog = await RecyclingLog.findOneAndUpdate(
      { recordId: parseInt(recordId) },
      {
        verificationStatus: approved ? 'Approved' : 'Rejected',
        verifiedBy,
        verificationTime: new Date(),
        verificationNotes: notes,
      },
      { new: true }
    );

    if (!recyclingLog) {
      return res.status(404).json({ message: 'Recycling record not found' });
    }

    res.json({
      message: 'Recycling record verified successfully',
      recyclingLog,
    });
  } catch (error) {
    console.error('Error verifying recycling record:', error);
    res.status(500).json({ error: 'Failed to verify recycling record' });
  }
});

/**
 * Get recycling statistics
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await RecyclingLog.aggregate([
      {
        $match: { verificationStatus: 'Approved' },
      },
      {
        $group: {
          _id: '$materialType',
          totalQuantity: { $sum: '$quantity' },
          count: { $sum: 1 },
        },
      },
    ]);

    const totalStats = await RecyclingLog.aggregate([
      {
        $match: { verificationStatus: 'Approved' },
      },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: '$quantity' },
          totalRecords: { $sum: 1 },
          averageQuantity: { $avg: '$quantity' },
        },
      },
    ]);

    res.json({
      byMaterialType: stats,
      overall: totalStats[0] || {},
    });
  } catch (error) {
    console.error('Error fetching recycling statistics:', error);
    res.status(500).json({ error: 'Failed to fetch recycling statistics' });
  }
});

module.exports = router;
