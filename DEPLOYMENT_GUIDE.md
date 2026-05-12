# Deployment Guide

## 🚀 Production Deployment

This guide covers deploying the Movie Ticket Booking Platform to production.

---

## Frontend Deployment (Vercel)

### Step 1: Build the Application
```bash
cd frontend
npm run build
```

This creates an optimized production build in the `build/` folder.

### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
npm install -g vercel
vercel
```

**Option B: GitHub Integration**
1. Push code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Select your GitHub repository
5. Configure environment variables
6. Deploy

### Step 3: Configure Environment Variables
In Vercel dashboard:
- `REACT_APP_API_URL` - Production backend URL
- `REACT_APP_ML_API_URL` - Production ML API URL

### Example Production URLs
```
Frontend: https://moviebox.vercel.app
Backend: https://moviebox-api.herokuapp.com
ML API: https://moviebox-ml.herokuapp.com
```

---

## Backend Deployment (Heroku)

### Step 1: Install Heroku CLI
```bash
npm install -g heroku
heroku login
```

### Step 2: Create Heroku App
```bash
cd backend
heroku create moviebox-api
```

### Step 3: Configure Environment Variables
```bash
heroku config:set MONGODB_URI=<YOUR_MONGODB_ATLAS_URL>
heroku config:set JWT_SECRET=<YOUR_SECRET_KEY>
heroku config:set JWT_EXPIRE=7d
heroku config:set ML_API_URL=https://moviebox-ml.herokuapp.com
heroku config:set NODE_ENV=production
```

### Step 4: Deploy
```bash
git push heroku main
```

### Step 5: Check Logs
```bash
heroku logs --tail
```

---

## ML Model Deployment (Heroku)

### Step 1: Create Heroku App
```bash
cd ml-model
heroku create moviebox-ml
```

### Step 2: Configure Python Runtime
Create `runtime.txt`:
```
python-3.11.0
```

Create `Procfile`:
```
web: gunicorn app:app
```

### Step 3: Update Requirements
```bash
pip install gunicorn
pip freeze > requirements.txt
```

Add `gunicorn` to `requirements.txt`

### Step 4: Deploy
```bash
git push heroku main
```

---

## Database Setup (MongoDB Atlas)

### Step 1: Create Cluster
1. Go to https://www.mongodb.com/cloud/atlas
2. Create account/login
3. Create a new project
4. Create a cluster (M0 free tier)
5. Configure network access (allow 0.0.0.0)
6. Create database user

### Step 2: Get Connection String
```
mongodb+srv://username:password@cluster.mongodb.net/movie-booking-db?retryWrites=true&w=majority
```

### Step 3: Use in Environment Variables
Backend `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movie-booking-db
```

### Step 4: Seed Production Database
```bash
# From your local machine
MONGODB_URI="<production_url>" npm run seed
```

---

## DNS & Domain Configuration

### Option 1: Custom Domain (Vercel)
1. In Vercel dashboard
2. Project Settings → Domains
3. Add your custom domain
4. Update DNS records

### Option 2: SSL Certificate
- Vercel auto-provides SSL
- Keep HTTPS enabled
- Update API URLs to HTTPS

---

## Performance Optimization

### Frontend
```bash
# Code splitting
npm run build  # Analyzes bundle size

# Image optimization
# Use next/image or similar

# Caching headers
# Set Cache-Control headers
```

### Backend
```javascript
// Enable compression
app.use(compression());

// Caching
app.use(express.static('public', {
  maxAge: '1d'
}));

// Database indexing
// Already configured in models
```

### ML Model
- Use joblib for model caching
- Implement request caching
- Pre-load models on startup

---

## Monitoring & Logging

### Heroku Monitoring
```bash
heroku metrics
heroku open  # View app URL
```

### Application Logging
```bash
heroku logs --tail
heroku logs --source app
```

### Error Tracking (Sentry)
```javascript
// In backend/server.js
const Sentry = require("@sentry/node");
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

---

## Security Checklist

- [ ] Enable HTTPS
- [ ] Use strong JWT secret
- [ ] Set secure cookie flags
- [ ] Enable CORS properly
- [ ] Rate limit API
- [ ] Validate all inputs
- [ ] Use environment variables
- [ ] Enable database authentication
- [ ] Regular security updates
- [ ] Implement API keys (if needed)

---

## Database Backup

### MongoDB Atlas Automatic Backups
- Enabled by default
- 7-day retention (free tier)
- Point-in-time restore available

### Manual Backup
```bash
# Backup
mongodump --uri "mongodb+srv://username:password@cluster.mongodb.net/movie-booking-db"

# Restore
mongorestore --uri "mongodb+srv://username:password@cluster.mongodb.net/movie-booking-db" dump/
```

---

## CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: moviebox-api
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
```

---

## Scaling Considerations

### Load Balancing
- Heroku auto-scales dynos
- MongoDB Atlas handles sharding

### Caching Layer
- Implement Redis for:
  - User sessions
  - Movie recommendations
  - ML model outputs

### CDN
- Use CloudFlare for:
  - Static asset caching
  - DDoS protection
  - Performance

### Database Optimization
```javascript
// Create indices for frequently queried fields
show.index({ movieId: 1, startTime: 1 });
booking.index({ userId: 1, createdAt: -1 });
user.index({ email: 1 });
```

---

## Troubleshooting Deployment

### Heroku Build Fails
```bash
# Check buildpack
heroku buildpacks
heroku buildpacks:set heroku/nodejs

# Clear cache
heroku builds:cache:purge
```

### MongoDB Connection Issues
```bash
# Check connection string
echo $MONGODB_URI

# Verify network access
# Add IP to MongoDB Atlas whitelist
```

### Environment Variables Not Loading
```bash
# List variables
heroku config

# Set variable
heroku config:set KEY=value

# Remove variable
heroku config:unset KEY
```

---

## Cost Estimation (Monthly)

| Service | Tier | Cost |
|---------|------|------|
| Vercel | Free | $0 |
| Heroku | Eco | $7 |
| MongoDB | M0 | Free |
| Domain | Custom | $12 |
| **Total** | | **$19/month** |

---

## Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] API responds with correct data
- [ ] User registration/login works
- [ ] Booking flow complete
- [ ] Payments process
- [ ] Admin panel accessible
- [ ] ML recommendations work
- [ ] Database backups scheduled
- [ ] Monitoring setup
- [ ] Logging enabled
- [ ] SSL certificate valid
- [ ] Custom domain pointing correctly

---

## Maintenance

### Regular Tasks
- Monitor error logs
- Check disk usage
- Update dependencies
- Backup database
- Review performance metrics

### Update Dependencies
```bash
# Frontend
npm update
npm audit fix

# Backend
npm update
npm audit fix

# ML Model
pip list --outdated
pip install --upgrade <package>
```

---

## Support & Resources

- [Vercel Docs](https://vercel.com/docs)
- [Heroku Docs](https://devcenter.heroku.com)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [GitHub Actions](https://github.com/features/actions)

---

**For setup help, see SETUP_INSTRUCTIONS.md**
**For API details, see API_DOCUMENTATION.md**
