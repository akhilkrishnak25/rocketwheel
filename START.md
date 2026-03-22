# 🚀 RocketWheel - Startup Instructions

## Prerequisites Verification

Before starting, ensure:
1. ✅ Node.js installed (`node --version`)
2. ✅ MongoDB running (`mongosh`)
3. ✅ Ports 4000 and 3000 are free

## Starting the Application

### Step 1: Start MongoDB (Required)
```powershell
# Open PowerShell and run:
mongosh

# You should see connection successful message
# Keep this window open
# Type 'exit' to close
```

### Step 2: Start Backend Server (Terminal 1)
```powershell
cd C:\Users\prade\rocketwheel\backend
npm run dev

# Expected output:
# MongoDB connected
# Server running on port 4000
```

**Keep this terminal open - backend is now running**

### Step 3: Start Frontend Server (Terminal 2)
```powershell
cd C:\Users\prade\rocketwheel\frontend
npm start

# Expected output:
# Compiled successfully!
# Local: http://localhost:3000
# (Browser should auto-open)
```

**Keep this terminal open - frontend is now running**

## Access the Application

Once both are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Admin Login**: http://localhost:3000/admin/login
- **Vendor Login**: http://localhost:3000/vendor/login

## Troubleshooting

**Port 4000 already in use?**
```powershell
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

**Port 3000 already in use?**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
# Or React will ask to use port 3001
```

**MongoDB not running?**
```powershell
mongosh  # Should connect
# Or start service: net start MongoDB
```

**Module not found error?**
```powershell
# Backend
cd backend
rm -r node_modules
npm install
npm run dev

# Frontend
cd frontend
rm -r node_modules
npm install
npm start
```

## First Test Flow

Once running, in browser at http://localhost:3000:

1. Click "Admin Login"
2. Enter any email and password (auto-creates account)
3. Add delivery boy in dashboard
4. Set central RocketWheel number
5. Return and click "Vendor Login" → "Register"
6. Fill vendor registration form
7. Go back to admin, approve vendor
8. Vendor can now add products and download QR
9. Return to home, browse vendors, and test ordering

## System Running Status

✅ Ready when you see:
- Backend: "Server running on port 4000"
- Frontend: "Compiled successfully!" + browser opens

🎉 **Application is live!**
