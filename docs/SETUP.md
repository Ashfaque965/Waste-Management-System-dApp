# Setup Guide

## Local Development Setup

### Step 1: Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install contract dependencies
cd ../contracts
npm install
```

### Step 2: Configure Environment Variables

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/waste-management
ETHEREUM_RPC_URL=http://localhost:8545
ETHEREUM_NETWORK=localhost
CHAIN_ID=31337
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env)
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ETHEREUM_RPC_URL=http://localhost:8545
REACT_APP_CHAIN_ID=31337
```

### Step 3: Start Local Blockchain

```bash
cd contracts
npx hardhat node
```

Keep this terminal running. It will provide test accounts with ETH.

### Step 4: Deploy Smart Contracts

In a new terminal:
```bash
cd contracts
npx hardhat run deploy.js --network localhost
```

This will output contract addresses. Update your `.env` files with these addresses.

### Step 5: Start Backend Server

```bash
cd backend
npm run dev
```

Backend will start on `http://localhost:5000`

### Step 6: Start Frontend Application

```bash
cd frontend
npm start
```

Frontend will start on `http://localhost:3000`

### Step 7: Configure MetaMask

1. Open MetaMask extension
2. Click network dropdown → Add Network
3. Fill in:
   - Network name: `Hardhat`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
4. Save and switch to Hardhat network
5. Import test account from Hardhat node output

## Database Setup

### MongoDB Installation

**Windows:**
```bash
# Download from https://www.mongodb.com/try/download/community
# Or use MongoDB Atlas (Cloud)
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

### Create Database

```bash
mongo
use waste-management
exit
```

## IPFS Setup (Optional)

For full functionality with distributed storage:

```bash
# Install IPFS
npm install -g ipfs

# Initialize
ipfs init

# Start daemon
ipfs daemon
```

IPFS will run on `http://localhost:5001`

## Troubleshooting

### Port Already in Use
- Backend (5000): Change PORT in `.env`
- Frontend (3000): Create `.env` with `PORT=3001`
- Hardhat (8545): Change in hardhat.config.js

### MetaMask Connection Issues
- Clear cache and reload
- Ensure RPC URL is correct
- Check network ID matches CHAIN_ID

### MongoDB Connection Error
- Verify MongoDB is running: `mongo --version`
- Check connection string in `.env`
- Ensure database exists

### Contract Deployment Fails
- Clear artifacts: `npx hardhat clean`
- Recompile: `npx hardhat compile`
- Redeploy: `npx hardhat run deploy.js --network localhost`

## Testing

### Run Backend Tests
```bash
cd backend
npm test
```

### Run Contract Tests
```bash
cd contracts
npx hardhat test
```

## Production Deployment

### Contract Deployment to Testnet (Sepolia)

1. Get Sepolia ETH from faucet
2. Update hardhat.config.js with testnet RPC
3. Deploy:
```bash
npx hardhat run deploy.js --network sepolia
```

### Backend Deployment

Options: Heroku, Railway, Render, DigitalOcean

```bash
# Example: Railway
railway link
railway up
```

### Frontend Deployment

Options: Vercel, Netlify, GitHub Pages

```bash
# Build
cd frontend
npm run build

# Deploy to Vercel
vercel --prod
```

## Support

For setup issues, check:
1. Node.js version (>= 16)
2. All `.env` files are configured
3. Ports are not in use
4. MongoDB is running
5. Hardhat node is running

---

**Happy building! 🚀**
