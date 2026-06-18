// backend/routes/collections.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const WasteCollectionLog = require('../models/WasteCollectionLog');
const blockchainService = require('../services/blockchainService');
const ipfsService = require('../services/ipfsService');

/**
 * Record a waste collection
 */
router.post(
  '/record',
  [
    body('collectorAddress').matches(/^0x[a-fA-F0-9]{40}$/),
    body('wasteType').isIn([
      'Organic',
      'Plastic',
      'Metal',
      'Glass',
      'Paper',
      'Electronic',
      'Hazardous',
      'Mixed',
    ]),
    body('weight').isFloat({ min: 0.1 }),
    body('latitude').isFloat(),
    body('longitude').isFloat(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { collectorAddress, wasteType, weight, latitude, longitude, address } = req.body;

      // Upload location to IPFS
      const locationHash = await ipfsService.uploadLocationData(
        latitude,
        longitude,
        address,
        { collectorAddress }
      );

      // Record on blockchain
      const blockchainTx = await blockchainService.recordWasteCollection(
        collectorAddress,
        wasteType,
        weight,
        locationHash
      );

      // Save to database
      const collectionLog = new WasteCollectionLog({
        collectionId: blockchainTx.blockNumber,
        blockchainTxHash: blockchainTx.transactionHash,
        collectorAddress: collectorAddress.toLowerCase(),
        wasteType,
        weight,
        location: {
          latitude,
          longitude,
          address,
          ipfsHash: locationHash,
        },
        timestamp: new Date(),
        status: 'Pending',
      });

      await collectionLog.save();

      res.status(201).json({
        message: 'Waste collection recorded successfully',
        data: {
          collectionLog,
          blockchain: blockchainTx,
        },
      });
    } catch (error) {
      console.error('Error recording collection:', error);
      res.status(500).json({ error: 'Failed to record collection' });
    }
  }
);

/**
 * Get all collections
 */
router.get('/', async (req, res) => {
  try {
    const { collectorAddress, status, wasteType } = req.query;
    const query = {};

    if (collectorAddress) query.collectorAddress = collectorAddress.toLowerCase();
    if (status) query.status = status;
    if (wasteType) query.wasteType = wasteType;

    const collections = await WasteCollectionLog.find(query)
      .sort({ timestamp: -1 })
      .limit(100);

    res.json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

/**
 * Get single collection
 */
router.get('/:collectionId', async (req, res) => {
  try {
    const { collectionId } = req.params;

    const collection = await WasteCollectionLog.findOne({
      collectionId: parseInt(collectionId),
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.json(collection);
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({ error: 'Failed to fetch collection' });
  }
});

/**
 * Verify a collection
 */
router.put('/:collectionId/verify', async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { verifiedBy, notes } = req.body;

    // Update blockchain
    await blockchainService.verifyWasteCollection(parseInt(collectionId));

    // Update database
    const collection = await WasteCollectionLog.findOneAndUpdate(
      { collectionId: parseInt(collectionId) },
      {
        status: 'Verified',
        verifiedBy,
        verificationTime: new Date(),
        notes,
      },
      { new: true }
    );

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.json({
      message: 'Collection verified successfully',
      collection,
    });
  } catch (error) {
    console.error('Error verifying collection:', error);
    res.status(500).json({ error: 'Failed to verify collection' });
  }
});

/**
 * Get collection statistics
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await WasteCollectionLog.aggregate([
      {
        $group: {
          _id: '$wasteType',
          totalWeight: { $sum: '$weight' },
          count: { $sum: 1 },
        },
      },
    ]);

    const totalStats = await WasteCollectionLog.aggregate([
      {
        $group: {
          _id: null,
          totalWeight: { $sum: '$weight' },
          totalCollections: { $sum: 1 },
          averageWeight: { $avg: '$weight' },
        },
      },
    ]);

    res.json({
      byWasteType: stats,
      overall: totalStats[0] || {},
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
