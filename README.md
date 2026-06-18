# Waste-Management-System-dApp

# Waste Management System dApp

A blockchain-based waste management tracking system built with Ethereum, React, and Node.js. Features collection tracking, recycling verification, and automated reporting for complete transparency.

## 🌍 Features

- **Collection Tracking**: Track waste collection activities with location data and weight records
- **Recycling Verification**: Verify and monitor recycling processes with reward system
- **Automated Reporting**: Generate monthly and yearly reports with environmental impact metrics
- **Token Rewards**: ERC20-based reward system for successful collections and recycling
- **IPFS Integration**: Distributed storage for location and process documentation
- **Blockchain Transparency**: All activities recorded immutably on Ethereum

## 🏗️ Project Structure

```
waste-management-dapp/
├── contracts/              # Solidity smart contracts
│   ├── WasteToken.sol          # ERC20 token for rewards
│   ├── WasteCollection.sol      # Collection tracking contract
│   ├── RecyclingVerification.sol # Recycling verification contract
│   ├── ReportingService.sol     # Automated reporting contract
│   └── hardhat.config.js        # Hardhat configuration
├── backend/                # Node.js API server
│   ├── config/
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic
│   └── index.js            # Express server
├── frontend/               # React web application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/          # Zustand state management
│   │   └── App.jsx
│   └── package.json
└── docs/                   # Documentation
```

## 🛠️ Tech Stack

### Smart Contracts
- **Solidity 0.8.0**
- **OpenZeppelin Contracts**
- **Hardhat** (development framework)

### Backend
- **Node.js + Express.js**
- **MongoDB** (database)
- **ethers.js** (blockchain interaction)
- **IPFS** (distributed storage)

### Frontend
- **React 18**
- **TailwindCSS** (styling)
- **Zustand** (state management)
- **ethers.js** (Web3 integration)
- **Axios** (HTTP client)

## 📦 Installation

### Prerequisites
- Node.js >= 16.0.0
- MongoDB >= 4.4
- Hardhat
- MetaMask or similar Web3 wallet

### Smart Contracts Setup

```bash
cd contracts
npm install
npx hardhat compile
```

Deploy locally:
```bash
npx hardhat run deploy.js --network localhost
```

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your configuration
npm run dev
```

Required environment variables:
```
MONGODB_URI=mongodb://localhost:27017/waste-management
ETHEREUM_RPC_URL=http://localhost:8545
DEPLOYER_PRIVATE_KEY=your-private-key
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Update .env with contract addresses and API URL
npm start
```

The app will open at `http://localhost:3000`

## 🚀 Running the Application

1. **Start Hardhat Node** (in a terminal):
```bash
npx hardhat node
```

2. **Deploy Contracts** (in another terminal):
```bash
npx hardhat run contracts/deploy.js --network localhost
```

3. **Start Backend** (in another terminal):
```bash
cd backend
npm run dev
```

4. **Start Frontend** (in another terminal):
```bash
cd frontend
npm start
```

5. **Connect MetaMask** to localhost:8545 and import test accounts from Hardhat

## 📚 API Endpoints

### Collectors
- `POST /api/collectors/register` - Register a new collector
- `GET /api/collectors/:walletAddress` - Get collector profile
- `GET /api/collectors` - List all collectors
- `PUT /api/collectors/:walletAddress` - Update collector profile
- `GET /api/collectors/:walletAddress/stats` - Get collector statistics

### Collections
- `POST /api/collections/record` - Record waste collection
- `GET /api/collections` - Get all collections
- `GET /api/collections/:collectionId` - Get single collection
- `PUT /api/collections/:collectionId/verify` - Verify collection
- `GET /api/collections/stats/summary` - Get collection statistics

### Recycling
- `POST /api/recycling/submit` - Submit recycling record
- `GET /api/recycling` - Get all recycling records
- `PUT /api/recycling/:recordId/verify` - Verify recycling record
- `GET /api/recycling/stats/summary` - Get recycling statistics

## 📋 Smart Contract Features

### WasteToken (ERC20)
- Token minting for waste collection rewards
- Recycling reward tracking
- Reward claiming mechanism

### WasteCollection
- Record waste collection activities
- Multiple waste types support
- Collection verification system
- Reward calculation per waste type
- Collector registration and statistics

### RecyclingVerification
- Submit recycling records
- Verification approval/rejection
- Material type tracking
- Statistics per material
- Environmental impact calculation

### ReportingService
- Monthly and yearly report generation
- Environmental impact metrics
- Collection and recycling statistics
- IPFS hash storage for reports

## 🔐 Security Considerations

- Uses OpenZeppelin's audited contracts
- ReentrancyGuard on state-changing functions
- Input validation on all endpoints
- Private key management via environment variables
- CORS configuration for API
- Helmet middleware for HTTP security

## 📊 Environmental Impact Metrics

The system calculates:
- **CO2 Saved**: 3 kg per kg of material recycled
- **Water Saved**: 10 liters per kg of material recycled
- **Energy Saved**: 2 kWh per kg of material recycled

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For issues and questions, please open a GitHub issue.

---

**Made with ♻️ for a sustainable future**

