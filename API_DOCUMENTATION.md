# API Documentation

## Base URLs
- **Backend API**: `http://localhost:5001/api`
- **ML API**: `http://localhost:5000`

## Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

---

## 🔐 Auth Endpoints

### POST /auth/register
Register a new user

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1 (555) 000-0000"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### POST /auth/login
Login user

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### GET /auth/me
Get current user (Protected)

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (555) 000-0000",
    "role": "user",
    "bookingHistory": ["booking_id1", "booking_id2"],
    "createdAt": "2024-05-01T10:00:00Z"
  }
}
```

---

### PUT /auth/profile
Update user profile (Protected)

**Request:**
```json
{
  "name": "Jane Doe",
  "phone": "+1 (555) 111-1111"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

## 🎬 Movie Endpoints

### GET /movies
Get all movies

**Query Parameters:**
- `status` (optional): 'now-showing', 'upcoming', 'archived'
- `genre` (optional): 'Action', 'Comedy', etc.
- `language` (optional): 'English', 'Hindi', etc.

**Example:** `/movies?status=now-showing&genre=Action`

**Response (200):**
```json
{
  "success": true,
  "count": 8,
  "movies": [
    {
      "_id": "movie_id",
      "title": "The Dark Knight",
      "description": "...",
      "genre": ["Action", "Crime"],
      "duration": 152,
      "rating": 9.0,
      "releaseDate": "2024-01-15T00:00:00Z",
      "posterUrl": "https://...",
      "language": "English",
      "status": "now-showing",
      "popularity": 95,
      "totalBookings": 250
    }
  ]
}
```

---

### GET /movies/:id
Get single movie

**Response (200):**
```json
{
  "success": true,
  "movie": { ... }
}
```

---

### GET /movies/search
Search movies

**Query Parameters:**
- `query` (required): Search term

**Example:** `/movies/search?query=dark`

**Response (200):**
```json
{
  "success": true,
  "count": 1,
  "movies": [ ... ]
}
```

---

### POST /movies
Create movie (Admin only)

**Request:**
```json
{
  "title": "New Movie",
  "description": "...",
  "genre": ["Action"],
  "duration": 150,
  "releaseDate": "2024-06-01",
  "posterUrl": "https://...",
  "language": "English",
  "status": "upcoming"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Movie created successfully",
  "movie": { ... }
}
```

---

### PUT /movies/:id
Update movie (Admin only)

**Request:** (Same as POST, partial fields allowed)

---

### DELETE /movies/:id
Delete movie (Admin only)

**Response (200):**
```json
{
  "success": true,
  "message": "Movie deleted successfully"
}
```

---

## 🎪 Show Endpoints

### GET /shows
Get all shows

**Response (200):**
```json
{
  "success": true,
  "count": 20,
  "shows": [
    {
      "_id": "show_id",
      "movieId": { ... },
      "startTime": "2024-05-15T18:00:00Z",
      "endTime": "2024-05-15T19:52:00Z",
      "screen": "1",
      "basePrice": 150,
      "dynamicPrice": 195,
      "totalSeats": 100,
      "availableSeats": 45,
      "occupancyRate": 55.0,
      "bookedSeats": [
        {
          "seatNumber": "A1",
          "bookedBy": "user_id",
          "bookingId": "booking_id"
        }
      ]
    }
  ]
}
```

---

### GET /shows/movie/:movieId
Get shows for a specific movie

---

### POST /shows
Create show (Admin only)

**Request:**
```json
{
  "movieId": "movie_id",
  "startTime": "2024-05-15T18:00:00Z",
  "endTime": "2024-05-15T19:52:00Z",
  "screen": "1",
  "basePrice": 150,
  "totalSeats": 100
}
```

---

## 🎟️ Booking Endpoints

### POST /bookings
Create booking (Protected)

**Request:**
```json
{
  "showId": "show_id",
  "seats": ["A1", "A2", "B1"],
  "numberOfTickets": 3,
  "pricePerTicket": 195
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "booking": {
    "_id": "booking_id",
    "userId": "user_id",
    "movieId": "movie_id",
    "showId": "show_id",
    "seats": ["A1", "A2", "B1"],
    "numberOfTickets": 3,
    "totalPrice": 585,
    "pricePerTicket": 195,
    "status": "pending",
    "paymentStatus": "pending",
    "qrCode": "base64_encoded_qr",
    "bookingReference": "BK16835927103423",
    "movieTitle": "The Dark Knight",
    "showTime": "2024-05-15T18:00:00Z",
    "screenNumber": "1"
  }
}
```

---

### PUT /bookings/:id/confirm
Confirm booking - Mark as confirmed after payment (Protected)

**Response (200):**
```json
{
  "success": true,
  "message": "Booking confirmed successfully",
  "booking": { ...with status: "confirmed" }
}
```

---

### DELETE /bookings/:id/cancel
Cancel booking (Protected)

**Response (200):**
```json
{
  "success": true,
  "message": "Booking cancelled successfully"
}
```

---

### GET /bookings/user/bookings
Get user's bookings (Protected)

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "bookings": [ ... ]
}
```

---

### GET /bookings/:id
Get booking details (Protected)

---

### GET /bookings/recommendations
Get movie recommendations (Protected)

**Response (200):**
```json
{
  "success": true,
  "recommendations": [
    {
      "_id": "movie_id",
      "title": "Inception",
      "genre": ["Sci-Fi", "Action"],
      ...
    }
  ]
}
```

---

## 👨‍💼 Admin Endpoints

All admin endpoints require admin role. Base: `/api/admin`

### GET /admin/analytics
Get dashboard analytics

**Response (200):**
```json
{
  "success": true,
  "analytics": {
    "totalUsers": 125,
    "totalMovies": 8,
    "totalBookings": 342,
    "confirmedBookings": 298,
    "totalRevenue": 51300,
    "topMovies": [ ... ],
    "recentBookings": [ ... ]
  }
}
```

---

### GET /admin/booking-analytics
Get booking analytics

**Response (200):**
```json
{
  "success": true,
  "analytics": {
    "bookingsByStatus": [
      { "_id": "confirmed", "count": 298 },
      { "_id": "pending", "count": 44 }
    ],
    "bookingsByPaymentStatus": [
      { "_id": "completed", "count": 298 },
      { "_id": "pending", "count": 44 }
    ],
    "dailyBookings": [ ... ]
  }
}
```

---

### GET /admin/users
Get all users

---

### GET /admin/bookings
Get all bookings

**Query Parameters:**
- `status`: Filter by booking status
- `paymentStatus`: Filter by payment status

---

### GET /admin/shows
Get all shows

---

### PUT /admin/users/:userId/role
Update user role

**Request:**
```json
{
  "role": "admin"
}
```

---

### DELETE /admin/users/:userId
Delete user

---

## 🤖 ML API Endpoints

### GET /api/health
Health check

**Response (200):**
```json
{
  "status": "ML API is running"
}
```

---

### POST /recommend
Get movie recommendations

**Request:**
```json
{
  "user_id": "user_123",
  "user_history": ["mov_001", "mov_002"]
}
```

**Response (200):**
```json
{
  "success": true,
  "user_id": "user_123",
  "recommended_movie_ids": ["mov_003", "mov_004"],
  "recommended_movies": [
    { "movie_id": "mov_003", "score": 0.85 }
  ]
}
```

---

### POST /predict-demand
Predict show demand

**Request:**
```json
{
  "movie_id": "mov_001",
  "show_date": "2024-05-15",
  "show_time": "18:00"
}
```

**Response (200):**
```json
{
  "success": true,
  "movie_id": "mov_001",
  "show_date": "2024-05-15",
  "show_time": "18:00",
  "predicted_demand": 75.5,
  "demand_level": "High",
  "confidence": 0.85
}
```

---

### POST /dynamic-price
Calculate dynamic price

**Request:**
```json
{
  "demand": 75.5,
  "base_price": 150
}
```

**Response (200):**
```json
{
  "success": true,
  "demand": 75.5,
  "base_price": 150,
  "dynamic_price": 172.5,
  "price_change": 22.5,
  "percent_change": 15.0,
  "demand_level": "High"
}
```

---

### GET /analytics
Get ML model analytics

**Response (200):**
```json
{
  "success": true,
  "models": {
    "recommendation": {
      "status": "active",
      "algorithm": "Collaborative Filtering",
      "trained": true
    },
    "demand_prediction": {
      "status": "active",
      "algorithm": "Linear Regression",
      "trained": true
    },
    "dynamic_pricing": {
      "status": "active",
      "algorithm": "Demand-based Pricing",
      "trained": true
    }
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid token" or "No token provided"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Admin role required."
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal Server Error",
  "error": { ... }
}
```

---

## Rate Limiting & Best Practices

- No rate limiting implemented (for development)
- Always include `Content-Type: application/json` for POST/PUT requests
- Token expires in 7 days
- Passwords are hashed using bcrypt
- QR codes are base64 encoded

---

**For more information, see the main README.md file.**
