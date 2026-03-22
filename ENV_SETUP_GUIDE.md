# Environment Variables - Setup Guide

## Overview
This guide explains how to properly configure environment variables for the RocketWheel application.

## Files to Configure

### 1. Backend Configuration: `backend/.env`

```properties
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/rocketwheel?retryWrites=true&w=majority

# Server Port
PORT=4000

# Frontend Origin (CORS)
CLIENT_ORIGIN=http://localhost:3000

# JWT Secret (change in production)
JWT_SECRET=changeme-in-production-use-strong-key

# RocketWheel Central WhatsApp Number (for order notifications)
# Format: country_code + phone_number
# Example (India): 919876543210
# Important: Use a VALID WhatsApp number, not a placeholder
CENTRAL_ROCKETWHEEL_PHONE=919876543210
```

### 2. Frontend Configuration: `frontend/.env.local`

```env
# API Server URL
REACT_APP_API_URL=http://localhost:4000

# Central WhatsApp Number (fallback for vendors without assigned numbers)
# Format: country_code + phone_number
# Example (India): 919876543210
# MUST MATCH backend .env CENTRAL_ROCKETWHEEL_PHONE
REACT_APP_CENTRAL_PHONE=919876543210
```

## Environment Variables Explained

### MONGO_URI
- **Purpose**: MongoDB connection string for database
- **Format**: `mongodb+srv://username:password@cluster.host/dbname?retryWrites=true&w=majority`
- **Source**: MongoDB Atlas connection string
- **Security**: ⚠️ Contains credentials, never commit to git

### PORT
- **Purpose**: Backend server port
- **Default**: 4000
- **For Development**: 4000
- **For Production**: 8080 or 80 (depending on deployment)

### CLIENT_ORIGIN
- **Purpose**: Frontend URL for CORS (Cross-Origin Resource Sharing)
- **Development**: `http://localhost:3000`
- **Production**: `https://yourdomain.com`
- **Purpose**: Allows frontend to communicate with backend

### JWT_SECRET
- **Purpose**: Secret key for JWT token generation
- **⚠️ SECURITY**: 
  - Change in production to a long, random string
  - Example: `openssl rand -base64 32`
  - Never use default/placeholder values in production
  - Keep completely secret

### CENTRAL_ROCKETWHEEL_PHONE
- **Purpose**: Fallback WhatsApp number for order notifications
- **Format**: Country code + phone number
- **Examples**:
  - India: `919876543210` (country code 91 + 10 digits)
  - USA: `12025551234` (country code 1 + 10 digits)
  - UK: `442071234567` (country code 44 + 9-10 digits)
- **⚠️ IMPORTANT**: Use VALID WhatsApp number, not placeholder
- **Usage**: When vendor has no phone number set
- **Must Match**: Frontend `REACT_APP_CENTRAL_PHONE` should be identical

### REACT_APP_API_URL
- **Purpose**: Backend API endpoint URL
- **Development**: `http://localhost:4000`
- **Production**: `https://api.yourdomain.com`
- **Note**: Used by frontend to make API calls

### REACT_APP_CENTRAL_PHONE
- **Purpose**: Same as backend's `CENTRAL_ROCKETWHEEL_PHONE`
- **Synchronization**: MUST be identical in both `.env` files
- **Visibility**: Frontend needs this for WhatsApp integration

## Setup Instructions

### Step 1: Copy Environment Templates
```bash
# Backend
copy backend\.env.example backend\.env

# Frontend (if .env.local doesn't exist)
copy frontend\.env.example frontend\.env.local
```

### Step 2: Update Database Connection
Edit `backend/.env`:
- Get MongoDB URI from MongoDB Atlas
- Update `MONGO_URI` with your connection string

### Step 3: Update WhatsApp Numbers
Both files need WhatsApp configuration:

**backend/.env:**
```properties
CENTRAL_ROCKETWHEEL_PHONE=919876543210
```

**frontend/.env.local:**
```env
REACT_APP_CENTRAL_PHONE=919876543210
```

⚠️ **Make sure these match!**

### Step 4: Validate Configuration
```bash
# Backend - check MongoDB connection
npm run dev

# Frontend - check API connectivity
npm start
```

## Common Issues & Solutions

### Issue: MongoError - Connection Failed
**Solution**: 
1. Check MongoDB URI is correct
2. Verify IP whitelist in MongoDB Atlas includes your computer
3. Check MONGO_URI has correct credentials

### Issue: CORS Error
**Solution**:
1. Update `CLIENT_ORIGIN` to match your frontend URL
2. For development: use `http://localhost:3000`
3. For production: use `https://yourdomain.com`

### Issue: WhatsApp doesn't open
**Solution**:
1. Check phone number format (no spaces, dashes, or special chars)
2. Verify number is WhatsApp-enabled (you own it)
3. Test manually: `https://api.whatsapp.com/send?phone=919876543210`

### Issue: Placeholder number still used
**Solution**:
1. Check `CENTRAL_ROCKETWHEEL_PHONE` is set correctly in both files
2. Restart frontend dev server
3. Check browser console for actual number being used

## Production Deployment

Before deploying to production:

### Security Checklist
- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Use secure MongoDB connection string
- [ ] Update `CLIENT_ORIGIN` to production domain
- [ ] Update `REACT_APP_API_URL` to production API URL
- [ ] Use valid business WhatsApp number for `CENTRAL_ROCKETWHEEL_PHONE`
- [ ] Store `.env` files securely (never in git)
- [ ] Use environment variables on hosting platform

### Environment Variables on Hosting Platforms

#### Heroku
```bash
heroku config:set MONGO_URI="mongodb+srv://..."
heroku config:set JWT_SECRET="your-secret"
heroku config:set CENTRAL_ROCKETWHEEL_PHONE="919876543210"
```

#### AWS/Docker/Linux
Create `.env` file in production environment:
```bash
# Securely set environment variables
export MONGO_URI="mongodb+srv://..."
export JWT_SECRET="your-secret"
export CENTRAL_ROCKETWHEEL_PHONE="919876543210"

# Start application
npm start
```

#### Vercel (Frontend Hosting)
```bash
# In Vercel Dashboard:
# Settings → Environment Variables
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_CENTRAL_PHONE=919876543210
```

## Environment Variable Types

### Development
- Backend `.env` - local development settings
- Frontend `.env.local` - local development settings
- Can use test phone numbers and localhost URLs

### Staging
- `.env.staging` - staging environment settings
- Use test database and staging API URLs
- Can use test WhatsApp numbers

### Production
- `.env.production` - production environment settings
- Use production database and API URLs
- Use real WhatsApp numbers and secure credentials

## Additional Notes

### .env File Location
- `backend/.env` - in backend root directory
- `frontend/.env.local` - in frontend root directory

### Git Ignore
Never commit `.env` files:
```bash
# .gitignore should contain:
.env
.env.local
.env.*.local
```

### Variable Access
- **Backend (Node.js)**: Use `process.env.VARIABLE_NAME`
- **Frontend (React)**: Use `process.env.REACT_APP_VARIABLE_NAME`
  - ⚠️ Frontend can only access variables prefixed with `REACT_APP_`

### Changing Variables
- Stop the development server
- Update `.env` file
- Restart the development server
- Clear browser cache if needed (for frontend)

## Testing Configuration

```bash
# Test backend connection
cd backend
npm run dev
# Should see: "Connected to MongoDB" and "Server running on port 4000"

# Test frontend connection
cd frontend
npm start
# Should see: "Compiled successfully" and page loads without CORS errors

# Test WhatsApp integration
# Open vendor menu and try to place an order
# Should open WhatsApp Web with correct number
```

## Support

For configuration issues:
1. Check this guide for your specific issue
2. Review error messages in console
3. Verify all variables are set correctly
4. Ensure variable values match between backend and frontend
5. Restart servers after making changes

