# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently, the API uses wallet-based authentication. Include the wallet address in requests.

---

## Collectors Endpoints

### Register Collector
```
POST /collectors/register
```

**Request Body:**
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc0e7dEf58e979",
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "1234567890",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "New York, NY"
  }
}
```

**Response:**
```json
{
  "message": "Collector registered successfully",
  "collector": { ... }
}
```

---

### Get Collector Profile
```
GET /collectors/:walletAddress
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc0e7dEf58e979",
  "name": "John Doe",
  "email": "john@example.com",
  "totalWasteCollected": 150.5,
  "totalRewards": 1500,
  "collectionCount": 10,
  "verificationScore": 95,
  "status": "active",
  "blockchain": {
    "wallet": "0x742d35Cc6634C0532925a3b844Bc0e7dEf58e979",
    "totalCollected": "150.5",
    "totalRewards": "1500",
    "collectionCount": "10"
  }
}
```

---

### Get All Collectors
```
GET /collectors?status=active&isActive=true
```

**Query Parameters:**
- `status`: pending, verified, active, inactive
- `isActive`: true, false

---

### Update Collector Profile
```
PUT /collectors/:walletAddress
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "email": "newemail@example.com",
  "phoneNumber": "0987654321",
  "profileImage": "ipfs://QmXxxx"
}
```

---

### Get Collector Statistics
```
GET /collectors/:walletAddress/stats
```

**Response:**
```json
{
  "totalWasteCollected": 150.5,
  "totalRewards": 1500,
  "collectionCount": 10,
  "verificationScore": 95,
  "status": "active"
}
```

---

## Collections Endpoints

### Record Waste Collection
```
POST /collections/record
```

**Request Body:**
```json
{
  "collectorAddress": "0x742d35Cc6634C0532925a3b844Bc0e7dEf58e979",
  "wasteType": "Plastic",
  "weight": 25.5,
  "latitude": 40.7128,
  "longitude": -74.0060,
  "address": "Collection Point 1, NYC"
}
```

**Response:**
```json
{
  "message": "Waste collection recorded successfully",
  "data": {
    "collectionLog": { ... },
    "blockchain": {
      "transactionHash": "0x123...",
      "blockNumber": 15,
      "gasUsed": "123456"
    }
  }
}
```

---

### Get All Collections
```
GET /collections?collectorAddress=0x742d35Cc6634C0532925a3b844Bc0e7dEf58e979&status=Verified&wasteType=Plastic
```

**Query Parameters:**
- `collectorAddress`: Filter by collector
- `status`: Pending, InProgress, Completed, Verified
- `wasteType`: Organic, Plastic, Metal, Glass, Paper, Electronic, Hazardous, Mixed

---

### Get Single Collection
```
GET /collections/:collectionId
```

---

### Verify Collection
```
PUT /collections/:collectionId/verify
```

**Request Body:**
```json
{
  "verifiedBy": "0x...",
  "notes": "Verified and approved"
}
```

---

### Get Collection Statistics
```
GET /collections/stats/summary
```

**Response:**
```json
{
  "byWasteType": [
    {
      "_id": "Plastic",
      "totalWeight": 150,
      "count": 10
    },
    {
      "_id": "Metal",
      "totalWeight": 85,
      "count": 5
    }
  ],
  "overall": {
    "totalWeight": 450,
    "totalCollections": 20,
    "averageWeight": 22.5
  }
}
```

---

## Recycling Endpoints

### Submit Recycling Record
```
POST /recycling/submit
```

**Request Body:**
```json
{
  "recyclerAddress": "0x742d35Cc6634C0532925a3b844Bc0e7dEf58e979",
  "collectionId": 1,
  "materialType": "Plastic",
  "quantity": 25.5,
  "processDescription": "Material sorted and processed",
  "images": ["ipfs://hash1", "ipfs://hash2"]
}
```

---

### Get All Recycling Records
```
GET /recycling?recyclerAddress=0x...&status=Approved&materialType=Plastic
```

**Query Parameters:**
- `recyclerAddress`: Filter by recycler
- `status`: Pending, Approved, Rejected, Disputed
- `materialType`: Plastic, Metal, Glass, Paper, Organic, Electronic

---

### Verify Recycling Record
```
PUT /recycling/:recordId/verify
```

**Request Body:**
```json
{
  "approved": true,
  "verifiedBy": "0x...",
  "notes": "Material properly processed"
}
```

---

### Get Recycling Statistics
```
GET /recycling/stats/summary
```

---

## Error Responses

### 400 Bad Request
```json
{
  "errors": [
    {
      "msg": "Invalid email",
      "param": "email"
    }
  ]
}
```

### 404 Not Found
```json
{
  "message": "Collector not found"
}
```

### 500 Server Error
```json
{
  "error": "Failed to record collection"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Server Error |

---

## Rate Limiting

Currently no rate limiting. Consider implementing in production.

## CORS

Configured for `http://localhost:3000` in development.

Update `CORS_ORIGIN` in `.env` for production.

---

**Last Updated:** January 2026
