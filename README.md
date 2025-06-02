# EV Charging Station - Complete Setup Guide

## 📋 Table of Contents

1. 🌐 Live Application Links
2. 🚀 Local Development Setup
   - Prerequisites
   - Backend Setup (Node.js API)
   - Frontend Setup (Vue.js UI)
3. 🔑 API Documentation
   - Authentication Endpoints
   - Charging Station Endpoints

---

## 🌐 Live Application Links

- **Frontend (Live)**: https://charging-station-orpin.vercel.app/
- **Backend API (Live)**: https://charging-station-ckr1.onrender.com/

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git

### Backend Setup (Node.js API)

#### 1. Clone the Repository
```bash
git clone https://github.com/Prakash-Bandapalli/CRUD_EVO.git
cd charging-station
```

#### 2. Navigate to Backend Directory
```bash
cd backend
```

#### 3. Install Dependencies
```bash
npm install
```

#### 4. Create Backend Environment Variables
Create a `.env` file in the `charging-station/backend/` directory with the following content:

```env
# charging-station/backend/.env
PORT=5000
NODE_ENV=development

# Local MongoDB URI
MONGO_URI=mongodb://localhost:27017/ev_charger_db_local

# For MongoDB Atlas (replace with your credentials):
# MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority

# Generate a strong JWT secret (use: openssl rand -base64 32)
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long_replace_this

# JWT expiration
JWT_EXPIRES_IN=1d

# Frontend URL for CORS
FRONTEND_URL=http://localhost:8080
```

**⚠️ Important Configuration Notes:**
- Replace `your_super_secret_jwt_key_at_least_32_characters_long_replace_this` with a strong, random secret
- Update `MONGO_URI` if using MongoDB Atlas or different local settings
- Ensure `FRONTEND_URL` matches your Vue.js dev server port

#### 5. Start Backend Development Server
```bash
npm run dev
```

✅ Backend should be running at `http://localhost:5000`  
Look for "MongoDB Connected" message in the terminal.

---

### Frontend Setup (Vue.js UI)

#### 1. Navigate to Frontend Directory
**Open a new terminal window** (keep backend running) and navigate to frontend:

```bash
cd charging-station/frontend
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Create Frontend Environment Variables
Create a `.env.development` file in the `charging-station/frontend/` directory:

```env
# charging-station/frontend/.env.development

# For local development (backend running on localhost:5000)
VUE_APP_API_BASE_URL=http://localhost:5000/api

# Alternative: Use live backend for testing
# VUE_APP_API_BASE_URL=https://charging-station-ckr1.onrender.com/api
```

#### 4. Start Frontend Development Server
```bash
npm run serve
```

✅ Frontend will be available at `http://localhost:8080` or `http://localhost:8081`

---

## 🔑 API Documentation

### Base URLs
- **Local Development**: `http://localhost:5000/api`
- **Production**: `https://charging-station-ckr1.onrender.com/api`

All API routes are prefixed with `/api`.

---

### Authentication (`/auth`)

#### Register User
- **Endpoint**: `POST /api/auth/register`
- **Description**: Creates a new user account
- **Authentication**: None required
- **Request Body**:
```json
{
  "email": "newuser@example.com",
  "password": "password123"
}
```
- **Validation Rules**:
  - `email`: Valid email format, required
  - `password`: Minimum 6 characters, required
- **Success Response** (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "683b1c802d01a181b35ab2b4",
    "email": "rizwan@gmail.com",
    "createdAt": "2025-05-31T15:13:04.959Z",
    "updatedAt": "2025-05-31T15:13:04.959Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4M2IxYzgwMmQwMWExODFiMzVhYjJiNCIsImlhdCI6MTc0ODcwNDM4NSwiZXhwIjoxNzQ4NzkwNzg1fQ.7A--bSrKtup_b71MWScGvldkjMgIZntvdvOA_PPdI54"
}
```
- **Error Responses**:
  - `400 Bad Request`: Missing fields, invalid email, short password, email already exists
  - `500 Internal Server Error`: Server error

#### Login User
- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticates user and returns JWT token
- **Authentication**: None required
- **Request Body**:
```json
{
  "email": "existinguser@example.com",
  "password": "password123"
}
```
- **Success Response** (200 OK):
```json
{
  "success": true,
  "message": "User logged in successfully",
  "user": {
    "_id": "6838985eb2c70658e55b8fce",
    "email": "prakash@gmail.com",
    "createdAt": "2025-05-29T17:24:46.847Z",
    "updatedAt": "2025-05-29T17:24:46.847Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Mzg5ODVlYjJjNzA2NThlNTViOGZjZSIsImlhdCI6MTc0ODcwNDI1MCwiZXhwIjoxNzQ4NzkwNjUwfQ.2HHKxYV944YYpFJdU57qgNLhUjek3Kiwe6xhzoXijZc"
}
```
- **Error Responses**:
  - `400 Bad Request`: Missing email or password
  - `401 Unauthorized`: Invalid credentials
  - `500 Internal Server Error`: Server error

---

### Charging Stations (`/stations`)

**🔐 Authentication Required**: All `/stations` endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### Get All Charging Stations
- **Endpoint**: `GET /api/stations`
- **Description**: Retrieves all charging stations
- **Authentication**: Required (Bearer Token)
- **Success Response** (200 OK):
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "station_id_1",
      "name": "Downtown Charger",
      "location": {
        "coordinates": [-122.4194, 37.7749],
        "address": "123 Main St, San Francisco, CA"
      },
      "status": "Active",
      "powerOutput": 50,
      "connectorType": "Type 2 (Mennekes)",
      "createdBy": {
        "email": "user@example.com"
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Create New Charging Station
- **Endpoint**: `POST /api/stations`
- **Description**: Creates a new charging station
- **Authentication**: Required (Bearer Token)
- **Request Body**:
```json
{
  "name": "My New Charger",
  "location": {
    "coordinates": [-122.4194, 37.7749],
    "address": "123 Main St, Anytown, USA"
  },
  "status": "Active",
  "powerOutput": 22,
  "connectorType": "Type 2 (Mennekes)"
}
```
- **Validation Rules**:
  - `name`: String, required, max 100 characters
  - `location.coordinates`: Array [longitude, latitude], required
    - Longitude: -180 to 180
    - Latitude: -90 to 90
  - `location.address`: String, optional
  - `status`: Required, must be one of: "Active", "Inactive", "Under Maintenance", "Coming Soon"
  - `powerOutput`: Number, required, positive value (minimum 0.1)
  - `connectorType`: String, required
- **Success Response** (201 Created): Created station object
- **Error Responses**:
  - `400 Bad Request`: Missing/invalid fields, validation errors
  - `401 Unauthorized`: Invalid or missing token
  - `500 Internal Server Error`: Server error

#### Get Specific Charging Station
- **Endpoint**: `GET /api/stations/:id`
- **Description**: Retrieves a single charging station by ID
- **Authentication**: Required (Bearer Token)
- **Parameters**: `id` - Station ID (MongoDB ObjectId)
- **Success Response** (200 OK): Single station object
- **Error Responses**:
  - `404 Not Found`: Station not found or invalid ID format
  - `401 Unauthorized`: Invalid or missing token

#### Update Charging Station
- **Endpoint**: `PUT /api/stations/:id`
- **Description**: Updates an existing charging station
- **Authentication**: Required (Bearer Token)
- **Parameters**: `id` - Station ID (MongoDB ObjectId)
- **Request Body**: Same schema as create (partial updates allowed)
- **Note**: Any authenticated user can update any station
- **Success Response** (200 OK): Updated station object
- **Error Responses**:
  - `404 Not Found`: Station not found
  - `400 Bad Request`: Validation errors
  - `401 Unauthorized`: Invalid or missing token

#### Delete Charging Station
- **Endpoint**: `DELETE /api/stations/:id`
- **Description**: Deletes a charging station
- **Authentication**: Required (Bearer Token)
- **Parameters**: `id` - Station ID (MongoDB ObjectId)
- **Note**: Any authenticated user can delete any station
- **Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Charging station deleted successfully",
  "data": {}
}
```
- **Error Responses**:
  - `404 Not Found`: Station not found
  - `401 Unauthorized`: Invalid or missing token

#### Key Data Structure: Charging Station

```json
{
  "_id": "mongodb_object_id",
  "name": "Station Name",
  "location": {
    "type": "Point",
    "coordinates": [longitude, latitude],
    "address": "Optional street address"
  },
  "status": "Active | Inactive | Under Maintenance | Coming Soon",
  "powerOutput": 50.5,
  "connectorType": "Type 2 (Mennekes)",
  "createdBy": {
    "_id": "user_id",
    "email": "creator@example.com"
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
