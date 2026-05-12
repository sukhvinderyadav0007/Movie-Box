# Movie Ticket Booking Platform with Machine Learning

A complete, production-ready web application for booking movie tickets with integrated machine learning features for recommendations, demand prediction, and dynamic pricing.

## 🎯 Project Overview

This project implements a full-stack movie ticket booking platform with:

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Machine Learning**: Python + Flask with Scikit-learn
- **Authentication**: JWT-based

### Key Features

- User authentication and profiles
- Browse movies with filtering and search
- Interactive seat selection
- Real-time booking confirmation
- QR code generation for tickets
- ML-based movie recommendations
- Demand prediction
- Dynamic pricing based on occupancy
- Admin dashboard with analytics
- Email notifications (mock)

## 📋 System Requirements

- Node.js v14+ and npm
- Python 3.8+
- MongoDB (local or Atlas)
- Git

## 📂 Project Structure

```
Movie-Ticket-Plateform/
├── frontend/                 # React.js application
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API calls
│   │   ├── context/         # React context (Auth)
│   │   ├── styles/          # CSS and Tailwind
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.example
├── backend/                  # Express.js API
│   ├── models/              # MongoDB models (User, Movie, Show, Booking)
│   ├── routes/              # API routes
│   ├── controllers/         # Business logic
│   ├── middleware/          # JWT auth, error handling
│   ├── utils/               # Helper functions
│   ├── data/                # Sample data
│   ├── scripts/             # Database seeding
│   ├── server.js            # Main server file
│   ├── package.json
│   └── .env.example
└── ml-model/                # Python Flask ML API
    ├── models/              # ML model implementations
    ├── data/                # Training data
    ├── app.py               # Flask API
    ├── train.py             # Training script
    ├── requirements.txt
    └── .env.example
```

## 🚀 Quick Start

### 1. Clone and Setup Repository

```bash
cd Movie-Ticket-Plateform
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB connection string
# Default: mongodb://localhost:27017/movie-booking-db
```

**Backend .env Configuration:**
```env
MONGODB_URI=mongodb://localhost:27017/movie-booking-db
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
ML_API_URL=http://localhost:5000
PORT=5001
NODE_ENV=development
```

#### Start MongoDB

**Local MongoDB:**
```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Or use MongoDB Atlas:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
```

#### Seed Database with Sample Movies

```bash
npm run seed
```

#### Start Backend Server

```bash
npm run dev
```

Server will run on `http://localhost:5001`

### 3. ML Model Setup

```bash
cd ml-model

# Install Python dependencies
pip install -r requirements.txt

# Train models (optional - models have defaults)
python train.py

# Start ML API
python app.py
```

ML API will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Frontend .env Configuration:**
```env
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_ML_API_URL=http://localhost:5000
```

#### Start Frontend Development Server

```bash
npm start
```

App will open at `http://localhost:3000`

## 📡 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Movie Routes
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie details
- `GET /api/movies/search?query=` - Search movies
- `POST /api/movies` - Create movie (Admin)
- `PUT /api/movies/:id` - Update movie (Admin)
- `DELETE /api/movies/:id` - Delete movie (Admin)

### Show Routes
- `GET /api/shows` - Get all shows
- `GET /api/shows/movie/:movieId` - Get shows by movie
- `GET /api/shows/:id` - Get show details
- `POST /api/shows` - Create show (Admin)
- `PUT /api/shows/:id` - Update show (Admin)
- `DELETE /api/shows/:id` - Delete show (Admin)

### Booking Routes
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/confirm` - Confirm booking
- `DELETE /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings/user/bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get booking details
- `GET /api/bookings/recommendations` - Get recommendations

### Admin Routes
- `GET /api/admin/analytics` - Get dashboard analytics
- `GET /api/admin/booking-analytics` - Get booking analytics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/bookings` - Get all bookings
- `GET /api/admin/shows` - Get all shows
- `PUT /api/admin/users/:userId/role` - Update user role
- `DELETE /api/admin/users/:userId` - Delete user

### ML API Endpoints
- `GET /api/health` - Health check
- `POST /recommend` - Get movie recommendations
- `POST /predict-demand` - Predict demand
- `POST /dynamic-price` - Calculate dynamic price
- `GET /analytics` - Get ML model analytics

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User registers/logs in
2. Backend generates JWT token
3. Token stored in localStorage
4. Token included in all API requests
5. Backend validates token

**Admin Access:**
- Create an admin user directly in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## 🤖 Machine Learning Features

### 1. Movie Recommendations
- **Algorithm**: Collaborative Filtering
- **Input**: User booking history
- **Output**: List of recommended movie IDs
- **Endpoint**: `POST /recommend`

### 2. Demand Prediction
- **Algorithm**: Linear Regression
- **Input**: Date, time, movie popularity
- **Output**: Predicted demand percentage (0-100)
- **Endpoint**: `POST /predict-demand`

### 3. Dynamic Pricing
- **Algorithm**: Rule-based pricing
- **Input**: Predicted demand, base price
- **Output**: Dynamic price
- **Tiers**:
  - Demand > 80%: +30% price
  - Demand > 60%: +15% price
  - Demand > 40%: Base price
  - Demand > 20%: -10% price
  - Demand < 20%: -20% price
- **Endpoint**: `POST /dynamic-price`

## 🧪 Testing Credentials

### Test User Account
```
Email: user@example.com
Password: password123
```

### Test Admin Account
```
Email: admin@example.com
Password: admin123
```

## 📊 Sample Data

The database comes pre-seeded with:
- **8 Movies** (Now showing and upcoming)
- **Sample Shows** (Multiple timeslots)
- **Sample Users** (Test accounts)

## 🎨 UI Features

### Pages
- **Home Page**: Browse and search movies, recommendations
- **Movie Details**: Full movie information and available shows
- **Booking Page**: Interactive seat selection
- **Payment Page**: Mock payment processing
- **My Bookings**: View ticket QR codes and booking history
- **Profile**: Update user information
- **Admin Dashboard**: Analytics and management

### Components
- Responsive movie cards
- Interactive seat selection grid
- Payment form
- QR code generation
- Alert notifications
- Loading states

## 🚢 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy 'build' folder to Vercel
```

### Backend (Heroku)
```bash
git push heroku main
```

### ML Model (Heroku/AWS)
```bash
git push heroku main
```

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/movie-booking-db
JWT_SECRET=your_super_secret_jwt_key_12345
JWT_EXPIRE=7d
ML_API_URL=http://localhost:5000
PORT=5001
NODE_ENV=development
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_ML_API_URL=http://localhost:5000
```

### ML Model (.env)
```env
FLASK_ENV=development
FLASK_DEBUG=True
```

## 📝 Key Code Highlights

### JWT Middleware (Backend)
```javascript
// middleware/auth.js
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.userId = decoded.id;
  req.userRole = decoded.role;
  next();
};
```

### API Service (Frontend)
```javascript
// services/api.js
export const bookingAPI = {
  createBooking: (data) => api.post('/bookings', data),
  confirmBooking: (id) => api.put(`/bookings/${id}/confirm`),
  getUserBookings: () => api.get('/bookings/user/bookings'),
};
```

### React Context Auth (Frontend)
```javascript
// context/AuthContext.js
export const useAuth = () => {
  const context = useContext(AuthContext);
  return context; // { user, token, login, logout, isAuthenticated }
};
```

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
```bash
# Check if MongoDB is running
mongod

# Or use MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://...
```

**Port Already in Use**
```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5001
kill -9 <PID>
```

### Frontend Issues

**Port 3000 Already in Use**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or run on different port
PORT=3001 npm start
```

**Module Not Found**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### ML API Issues

**Python Import Errors**
```bash
pip install -r requirements.txt --upgrade
```

**Flask Port Conflict**
```python
# In app.py, change port
if __name__ == '__main__':
    app.run(port=5001)  # Use different port
```

## 📚 Technologies Used

### Frontend
- React.js 18
- React Router v6
- Axios
- Tailwind CSS
- React Icons
- QR Code

### Backend
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- BCryptjs
- Nodemailer
- Axios

### ML
- Flask
- Scikit-learn
- Pandas
- NumPy
- Joblib

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 Support

For issues and questions, please create an issue in the repository.

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com/manual)
- [Scikit-learn](https://scikit-learn.org)
- [Tailwind CSS](https://tailwindcss.com)

---

**Happy Coding! 🎬🎟️**
