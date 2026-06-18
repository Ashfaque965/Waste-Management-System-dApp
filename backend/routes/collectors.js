// backend/routes/collectors.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Collector = require('../models/Collector');
const blockchainService = require('../services/blockchainService');

/**
 * Register a new collector
 */
router.post(
  '/register',
  [
    body('walletAddress').matches(/^0x[a-fA-F0-9]{40}$/),
    body('name').notEmpty(),
    body('email').isEmail(),
    body('phoneNumber').optional(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { walletAddress, name, email, phoneNumber, location } = req.body;

      // Check if collector already exists
      const existingCollector = await Collector.findOne({
        $or: [{ walletAddress }, { email }],
      });

      if (existingCollector) {
        return res.status(400).json({ message: 'Collector already registered' });
      }

      const collector = new Collector({
        walletAddress,
        name,
        email,
        phoneNumber,
        location,
        status: 'pending',
      });

      await collector.save();

      res.status(201).json({
        message: 'Collector registered successfully',
        collector,
      });
    } catch (error) {
      console.error('Error registering collector:', error);
      res.status(500).json({ error: 'Failed to register collector' });
    }
  }
);

/**
 * Get collector details
 */
router.get('/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;

    const collector = await Collector.findOne({
      walletAddress: walletAddress.toLowerCase(),
    });

    if (!collector) {
      return res.status(404).json({ message: 'Collector not found' });
    }

    // Get blockchain data
    let blockchainData = {};
    try {
      blockchainData = await blockchainService.getCollectorDetails(walletAddress);
    } catch (error) {
      console.warn('Could not fetch blockchain data:', error.message);
    }

    res.json({
      ...collector.toObject(),
      blockchain: blockchainData,
    });
  } catch (error) {
    console.error('Error fetching collector:', error);
    res.status(500).json({ error: 'Failed to fetch collector' });
  }
});

/**
 * Get all collectors
 */
router.get('/', async (req, res) => {
  try {
    const { status, isActive } = req.query;
    const query = {};

    if (status) query.status = status;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const collectors = await Collector.find(query)
      .sort({ registrationDate: -1 })
      .limit(100);

    res.json(collectors);
  } catch (error) {
    console.error('Error fetching collectors:', error);
    res.status(500).json({ error: 'Failed to fetch collectors' });
  }
});

/**
 * Update collector profile
 */
router.put('/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { name, email, phoneNumber, location, profileImage } = req.body;

    const collector = await Collector.findOneAndUpdate(
      { walletAddress: walletAddress.toLowerCase() },
      {
        name,
        email,
        phoneNumber,
        location,
        profileImage,
      },
      { new: true }
    );

    if (!collector) {
      return res.status(404).json({ message: 'Collector not found' });
    }

    res.json({
      message: 'Collector updated successfully',
      collector,
    });
  } catch (error) {
    console.error('Error updating collector:', error);
    res.status(500).json({ error: 'Failed to update collector' });
  }
});

/**
 * Get collector statistics
 */
router.get('/:walletAddress/stats', async (req, res) => {
  try {
    const { walletAddress } = req.params;

    const collector = await Collector.findOne({
      walletAddress: walletAddress.toLowerCase(),
    });

    if (!collector) {
      return res.status(404).json({ message: 'Collector not found' });
    }

    res.json({
      totalWasteCollected: collector.totalWasteCollected,
      totalRewards: collector.totalRewards,
      collectionCount: collector.collectionCount,
      verificationScore: collector.verificationScore,
      status: collector.status,
    });
  } catch (error) {
    console.error('Error fetching collector stats:', error);
    res.status(500).json({ error: 'Failed to fetch collector stats' });
  }
});

module.exports = router;
