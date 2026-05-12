# Setup Instructions - Complete Guide

## Prerequisites

Before starting, ensure you have:
- **Node.js** v14 or higher ([download](https://nodejs.org/))
- **Python** 3.8 or higher ([download](https://www.python.org/))
- **MongoDB** installed locally or MongoDB Atlas account ([signup](https://www.mongodb.com/cloud/atlas))
- **Git** for version control ([download](https://git-scm.com/))

## Step-by-Step Setup

### Part 1: Backend Setup (Node.js + Express + MongoDB)

#### 1.1 Navigate to backend directory
```bash
cd backend
```

#### 1.2 Install dependencies
```bash
npm install
```

Expected packages to be installed:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- dotenv
- axios
- And others...

#### 1.3 Setup MongoDB

**Option A: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/movie-booking-db`

**Option B: Local MongoDB**
```bash
# Windows (if installed via installer)
# MongoDB starts as service

# macOS (using Homebrew)
brew install mongodb-community
brew services start mongodb-community

# Linux (Ubuntu/Debian)
sudo apt-get install -y mongodb
sudo systemctl start mongod
```

#### 1.4 Create .env file
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/movie-booking-db
JWT_SECRET=your_super_secret_key_min_32_chars_!!!
JWT_EXPIRE=7d
ML_API_URL=http://localhost:5000
PORT=5001
NODE_ENV=development
```

#### 1.5 Seed database with sample movies
```bash
npm run seed
```

You should see: `Database seeded successfully!`

#### 1.6 Start backend server
```bash
npm run dev
```

Expected output:
```
Server running on port 5001
MongoDB connected
```

**Backend is now running on**: `http://localhost:5001`

---

### Part 2: ML Model Setup (Python + Flask)

#### 2.1 Navigate to ml-model directory
```bash
cd ml-model
```

#### 2.2 Create Python virtual environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### 2.3 Install Python dependencies
```bash
pip install -r requirements.txt
```

This will install:
- Flask
- Flask-CORS
- NumPy
- Pandas
- Scikit-learn
- Joblib

#### 2.4 (Optional) Train ML models
```bash
python train.py
```

This creates trained models in `models/` directory. Models have fallback defaults, so this is optional.

#### 2.5 Start ML API
```bash
python app.py
```

Expected output:
```
 * Running on http://127.0.0.1:5000
```

**ML API is now running on**: `http://localhost:5000`

---

### Part 3: Frontend Setup (React + Tailwind CSS)

#### 3.1 Navigate to frontend directory
```bash
cd frontend
```

#### 3.2 Install dependencies
```bash
npm install
```

This will install:
- react
- react-router-dom
- axios
- tailwindcss
- And others...

#### 3.3 Create .env file
```bash
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_ML_API_URL=http://localhost:5000
```

#### 3.4 Start React development server
```bash
npm start
```

The app will automatically open at `http://localhost:3000`

---

## Verification Checklist

### ✅ Backend Verification
```bash
# Test backend health endpoint
curl http://localhost:5001/api/health
```

Expected response:
```json
{"status":"Server is running"}
```

### ✅ ML API Verification
```bash
# Test ML API health endpoint
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"ML API is running"}
```

### ✅ Frontend Verification
- Browser should open automatically at `http://localhost:3000`
- Homepage should load with movies

---

## Testing the Application

### 1. Register a New User
1. Click "Sign Up" on navbar
2. Fill in details:
   - Name: John Doe
   - Email: john@example.com
   - Password: Test@123
3. Click "Sign Up"

### 2. Browse Movies
1. You'll be redirected to home page
2. See "Now Showing" movies
3. Try searching for a movie
4. Try filtering by genre

### 3. Book a Movie
1. Click on any movie card
2. Select a show time
3. Select seats (visual grid)
4. Review booking summary
5. Click "Proceed to Payment"

### 4. Payment
1. Fill mock payment details:
   - Card Number: 4111 1111 1111 1111
   - Expiry: 12/25
   - CVV: 123
   - Name: Any name
2. Click "Pay Now"
3. You'll get booking confirmation with QR code

### 5. View Bookings
1. Click "My Bookings" in navbar
2. See all your bookings
3. View QR code
4. Option to cancel

### 6. Admin Dashboard
1. Create admin account in MongoDB:
   ```bash
   # In MongoDB compass or atlas
   db.users.updateOne(
     { email: "john@example.com" },
     { $set: { role: "admin" } }
   )
   ```
2. Login with that account
3. Click "Admin" in navbar
4. View analytics and bookings

---

## Useful Commands

### Start All Services (in separate terminals)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - ML Model:**
```bash
cd ml-model
# Activate venv first
python app.py
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm start
```

### Database Commands

**MongoDB - Connect to local database:**
```bash
mongosh
# Then use:
use movie-booking-db
db.movies.find()
db.users.find()
```

**MongoDB Atlas - Use compass or online IDE:**
1. Get connection string from MongoDB Atlas
2. Use MongoDB Compass GUI
3. Or use MongoDB Atlas Web IDE

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
# Creates optimized build in 'build' folder
```

**Backend:**
```bash
# Ready as-is, just set NODE_ENV=production
NODE_ENV=production npm start
```

---

## Common Issues & Solutions

### Issue: Port 5001 already in use
```bash
# Find process using port
# Windows:
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5001
kill -9 <PID>
```

### Issue: MongoDB connection error
```bash
# Check if MongoDB is running
# If using local:
mongod

# If using Atlas, verify connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

### Issue: Module not found errors
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Python venv not activated
```bash
# Windows:
cd ml-model
venv\Scripts\activate

# Mac/Linux:
cd ml-model
source venv/bin/activate
```

### Issue: CORS errors in frontend
- Ensure backend is running on port 5001
- Check CORS is enabled in backend: `app.use(cors())`
- Verify API URL in frontend .env

---

## Environment Variables Summary

### Backend (.env)
```env
MONGODB_URI=<your_mongodb_connection>
JWT_SECRET=<min_32_chars_secret_key>
JWT_EXPIRE=7d
ML_API_URL=http://localhost:5000
PORT=5001
NODE_ENV=development
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your_email>
SMTP_PASS=<your_app_password>
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_ML_API_URL=http://localhost:5000
```

### ML Model (.env) - Optional
```env
FLASK_ENV=development
FLASK_DEBUG=True
```

---

## Next Steps

1. **Customize**: Modify colors in Tailwind config
2. **Add Features**: Extend with additional functionality
3. **Deploy**: Deploy to production (Heroku, Vercel, AWS)
4. **Integrate**: Connect real payment gateway
5. **Enhance**: Improve ML models with real data

---

## Support

If you encounter issues:
1. Check console errors (Browser DevTools)
2. Check terminal output
3. Verify all services are running
4. Check .env files are correctly set
5. Ensure MongoDB is connected

**Happy Coding! 🚀**
