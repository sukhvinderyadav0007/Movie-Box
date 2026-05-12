# QUICK START GUIDE

## 🚀 Get Started in 15 Minutes

### Prerequisites
- Node.js v14+
- Python 3.8+
- MongoDB (local or Atlas)

---

## 1️⃣ Backend Setup (5 min)

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with MongoDB URI
npm run seed
npm run dev
```

✅ Backend running on `http://localhost:5001`

---

## 2️⃣ ML Model Setup (3 min)

```bash
cd ml-model
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python app.py
```

✅ ML API running on `http://localhost:5000`

---

## 3️⃣ Frontend Setup (5 min)

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

✅ Frontend running on `http://localhost:3000`

---

## 🧪 Test the Application

### 1. Register
- Go to `http://localhost:3000`
- Click "Sign Up"
- Create account with any details

### 2. Browse Movies
- View movies on homepage
- Search for movies
- Filter by genre

### 3. Book Tickets
- Click on movie
- Select show time
- Select seats
- Review booking summary

### 4. Make Payment
- Click "Proceed to Payment"
- Use test card: `4111 1111 1111 1111`
- Complete payment

### 5. View Ticket
- Go to "My Bookings"
- See your QR code
- View booking details

---

## 🔑 Test Accounts

No pre-made accounts - just register one!

To test admin features:
1. Register user with email: `admin@example.com`
2. In MongoDB, update: `db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })`
3. Login and visit `/admin` page

---

## 📂 Key Files

### Backend
- `server.js` - Main server
- `models/` - Database schemas
- `routes/` - API endpoints
- `controllers/` - Business logic

### Frontend
- `src/App.js` - Main app
- `src/pages/` - Page components
- `src/services/api.js` - API calls

### ML
- `app.py` - Flask server
- `models/` - ML algorithms

---

## 🔗 Important URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5001 |
| ML API | http://localhost:5000 |
| API Health | http://localhost:5001/api/health |
| ML Health | http://localhost:5000/api/health |

---

## 📝 Common Commands

```bash
# Start backend (in backend folder)
npm run dev

# Seed database
npm run seed

# Start ML API (in ml-model folder, with venv activated)
python app.py

# Start frontend (in frontend folder)
npm start

# Train ML models (optional)
python train.py
```

---

## ⚠️ Common Issues

### Port Already in Use
```bash
# Kill process on port 5001
# Windows: netstat -ano | findstr :5001 && taskkill /PID <PID> /F
# Mac/Linux: lsof -i :5001 && kill -9 <PID>
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in .env
- Use MongoDB Atlas if having local issues

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 Architecture Overview

```
User (Browser) 
    ↓
React Frontend (port 3000)
    ↓
Express Backend (port 5001)
    ↓
MongoDB (Database)

Machine Learning
    ↓
Flask API (port 5000)
    ↓
Scikit-learn Models
```

---

## 📊 What's Included

✅ **Complete Backend**
- User authentication with JWT
- Movie management
- Booking system
- Admin dashboard

✅ **Machine Learning**
- Movie recommendations
- Demand prediction
- Dynamic pricing

✅ **Modern Frontend**
- React with Tailwind CSS
- Responsive design
- Interactive UI
- QR code generation

✅ **Documentation**
- Setup guide
- API documentation
- Feature implementation
- Deployment guide

---

## 🚢 Next Steps

### Development
1. Explore the codebase
2. Modify styling (Tailwind)
3. Add more features
4. Implement real payment gateway

### Deployment
1. Build frontend: `npm run build`
2. Deploy frontend to Vercel
3. Deploy backend to Heroku
4. Deploy ML to Heroku

---

## 📚 Documentation Files

- **README.md** - Full project overview
- **SETUP_INSTRUCTIONS.md** - Detailed setup guide
- **API_DOCUMENTATION.md** - All API endpoints
- **FEATURES_IMPLEMENTATION.md** - Feature details
- **DEPLOYMENT_GUIDE.md** - Production deployment

---

## 💡 Tips

1. **Frontend Development**
   - Install React DevTools extension
   - Use browser DevTools for debugging
   - Check console for errors

2. **Backend Development**
   - Use MongoDB Compass for database inspection
   - Check terminal for server errors
   - Test APIs with Postman or curl

3. **ML Development**
   - ML models have good defaults
   - Train with custom data for better accuracy
   - Monitor Flask logs

---

## 🎬 Features Included

### User Features
- ✅ User registration & login
- ✅ Browse & search movies
- ✅ Interactive seat selection
- ✅ Book tickets
- ✅ Payment processing
- ✅ View booking history
- ✅ Get recommendations

### Admin Features
- ✅ Manage movies
- ✅ Manage shows
- ✅ View analytics
- ✅ Monitor bookings
- ✅ Manage users

### ML Features
- ✅ Personalized recommendations
- ✅ Demand prediction
- ✅ Dynamic pricing
- ✅ Occupancy forecasting

---

## 🆘 Need Help?

### Check Logs
- **Backend**: Check terminal running `npm run dev`
- **ML**: Check terminal running `python app.py`
- **Frontend**: Check browser console (F12)

### Verify Services
```bash
# Test backend
curl http://localhost:5001/api/health

# Test ML
curl http://localhost:5000/api/health

# Test MongoDB
mongosh mongodb://localhost:27017
```

### Check Files
- Database seeds in `backend/data/dummyMovies.js`
- Sample API calls in API documentation
- Configuration templates in `.env.example` files

---

## 🎓 Learning Path

1. **Frontend Basics**
   - Study React components
   - Understand Tailwind CSS
   - Learn React Router

2. **Backend Basics**
   - Understand Express routing
   - Learn MongoDB/Mongoose
   - Study JWT authentication

3. **ML Basics**
   - Learn collaborative filtering
   - Understand linear regression
   - Study scikit-learn

---

## 🔒 Security Notes

- ✅ Passwords hashed with bcrypt
- ✅ JWT token authentication
- ✅ Protected routes
- ✅ Input validation
- ✅ CORS enabled
- ⚠️ Change JWT secret in production
- ⚠️ Never commit .env file
- ⚠️ Use HTTPS in production

---

## 📈 Performance Tips

- Frontend: React lazy loading available
- Backend: Database indices configured
- ML: Model caching available
- Use MongoDB Atlas for production
- Enable CDN for static files

---

## 🚀 You're Ready!

Everything is set up and ready to go. Start with:
1. Frontend: http://localhost:3000
2. Register a new account
3. Browse movies
4. Book a ticket
5. Explore admin panel

**Happy Coding! 🎬🎟️**

---

For more details, see the respective documentation files.
