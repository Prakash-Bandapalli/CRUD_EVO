# EV Charging Station - Complete Setup Guide

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
git clone https://github.com/Prakash-Bandapalli/charging-station.git
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
