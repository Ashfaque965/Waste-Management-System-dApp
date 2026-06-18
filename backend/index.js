// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const env = require('./config/environment');
const blockchainService = require('./services/blockchainService');

// Import routes
const collectorRoutes = require('./routes/collectors');
const collectionRoutes = require('./routes/collections');
const recyclingRoutes = require('./routes/recycling');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose
  .connect(env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Initialize blockchain service
blockchainService
  .initialize(env.DEPLOYER_PRIVATE_KEY)
  .catch((error) => {
    console.error('Failed to initialize blockchain service:', error);
  });

// Routes
app.use('/api/collectors', collectorRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/recycling', recyclingRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Start server
const PORT = env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
});

module.exports = app;
