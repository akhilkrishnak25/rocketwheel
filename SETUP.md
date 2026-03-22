# RocketWheel - Complete Setup Guide (Windows PowerShell)

## Prerequisites

1. **MongoDB** - Install and run locally
   - Download: https://www.mongodb.com/try/download/community
   - After install, MongoDB should run as a service on `mongodb://127.0.0.1:27017`
   - Test: Open PowerShell and run `mongosh` to verify connection

2. **Node.js** - v14 or higher
   - Download: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

3. **Git** (optional, already cloned)

## Step 1: Start MongoDB

```powershell
# If MongoDB is installed as Windows service, it should auto-start
# To verify it's running, open another PowerShell and test:
mongosh
# Should show: mongosh 1.x.x
# Type: exit
```

If MongoDB doesn't auto-start:
```powershell
# Run MongoDB server (pick one based on your install location):
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
# Keep this terminal open; don't close it
```

## Step 2: Backend Setup

Open a **new PowerShell terminal** and run:

```powershell
cd C:\Users\prade\rocketwheel\backend

# Install dependencies
npm install

# Start backend server (with auto-reload via nodemon)
npm run dev

# Expected output:
# MongoDB connected
# Server running on port 4000
```

**Keep this terminal open.** Backend is now listening on `http://localhost:4000`

## Step 3: Frontend Setup

Open a **new PowerShell terminal** and run:

```powershell
cd C:\Users\prade\rocketwheel\frontend

# Install dependencies
npm install

# Start React development server
npm start

# This will auto-open http://localhost:3000 in your browser
# Expected output:
# Compiled successfully!
# Local: http://localhost:3000
```

## Step 4: Test the System

### 1. Customer Flow (Public)
- Open http://localhost:3000
- You'll see "RocketWheel Vendors" discovery page
- (Currently empty because no vendors are approved yet)

### 2. Create Admin Account
- Click "Admin Login" button (top right)
- Enter any email and password (e.g., admin@example.com / password123)
- First login auto-creates the admin account
- You're now in Admin Dashboard

### 3. Admin: Add Delivery Boy
- Go to "Delivery Boys" tab
- Add a delivery boy:
  - Name: "John (RocketWheel)"
  - Phone: 919999999999 (must be valid WhatsApp number format)
- Click "Add"

### 4. Admin: Set Central Delivery Number
- Go to "Central Number" tab
- Enter: 919999999999
- Click "Save"

### 5. Admin: Upload Banner (Optional)
- Go to "Banner" tab
- Title: "RocketWheel Promo"
- Select any image file
- Click "Upload"

### 6. Vendor: Register
- Open http://localhost:3000 in a **new incognito/private browser tab**
- Click "Vendor Login" button
- Switch to "Register" tab
- Fill in:
  - Business Name: "Pizza Palace"
  - Email: vendor1@example.com
  - Password: password123
  - Category: "Restaurant"
  - Address: "123 Main St"
  - Phone: 9876543210
- Click "Register"
- You'll see: "Registered! Awaiting admin approval..."

### 7. Admin: Approve Vendor
- Go back to Admin tab (first browser)
- Go to "Vendors" tab
- Click "Approve" button next to "Pizza Palace"
- Status changes to "Approved"

### 8. Vendor: Login & Add Products
- Go back to Vendor tab (private browser)
- Click "Login" tab
- Login with vendor1@example.com / password123
- Now you're in Vendor Dashboard

#### Add Single Product:
- Go to "Products" tab
- Enter:
  - Product Name: "Margherita Pizza"
  - Price: 299
  - Select an image file (optional)
- Click "Add"
- Repeat for more products

#### Bulk Upload via Excel:
1. Create Excel file with columns: **name** and **price**
   ```
   name              | price
   Pepperoni Pizza   | 349
   BBQ Pizza         | 399
   Garlic Bread      | 99
   ```
2. Save as `.xlsx`
3. Go to "Bulk Upload" tab
4. Select file and click "Upload"

### 9. Vendor: Download QR Code
- Go to "QR Code" tab
- Click "Download QR Code"
- Save the PNG file

### 10. Customer: Scan QR & Order
- Open http://localhost:3000 again (regular browser, not vendor session)
- Click "Browse Menu" under any approved vendor
  OR
- Scan the QR code with phone camera (links to `/menu/{vendorId}`)

You'll see:
- Vendor banner (if uploaded)
- Products list
- Add to cart functionality

#### Place an Order:
- Click "Add to Cart" on products
- Right side shows cart with items
- Enter:
  - Your Name: "John Doe"
  - Phone: 8765432109
  - Address: "456 Oak St"
- Click "Order via RocketWheel"
- WhatsApp link opens with pre-filled message:
  ```
  Hello RocketWheel,
  
  New Order Details:
  
  Order ID: RW-{timestamp}-{random}
  Vendor: Pizza Palace
  Category: Restaurant
  
  Items:
  
  * Margherita Pizza x2 = ₹299 x 2 = ₹598
  * Garlic Bread x1 = ₹99 x 1 = ₹99
  
  Total Amount: ₹697
  
  Customer Name: John Doe
  Phone: 8765432109
  Address: 456 Oak St
  
  Please confirm delivery.
  ```

### 11. View Orders (Admin)
- Admin Dashboard → "Vendors" tab
- Scroll down to see all orders (once placed)

## Common Issues & Fixes

### MongoDB Not Running
```powershell
# Check if MongoDB service is running:
Get-Service | Where-Object {$_.Name -like "*mongo*"}

# If not running, start it:
Start-Service MongoDB

# Or manually run mongod:
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
```

### Port 4000 Already in Use
```powershell
# Find process on port 4000:
netstat -ano | findstr :4000

# Kill process (replace PID):
taskkill /PID <PID> /F

# Then restart backend: npm run dev
```

### Port 3000 Already in Use
```powershell
# React will ask: "Port 3000 is in use. Would you like to run on port 3001 instead?"
# Press Y to accept
```

### "Cannot find module" Error
```powershell
# Delete node_modules and reinstall:
rm -r node_modules
npm install
npm run dev  # or npm start
```

### Image/Banner Upload Not Working
- Ensure `/uploads` folder exists in backend root
- Frontend sends file via `multipart/form-data`
- Backend stores in `/uploads/{type}/` folders

## Directory Structure After Setup

```
C:\Users\prade\rocketwheel\
├── backend/
│   ├── uploads/
│   │   ├── products/       (product images)
│   │   └── banners/        (banner images)
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── server.js
│   ├── .env                (configured)
│   ├── package.json
│   └── node_modules/       (after npm install)
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── .env.local          (configured)
│   ├── package.json
│   └── node_modules/       (after npm install)
└── README.md
```

## Database Structure

After running the system, MongoDB will have:
```
rocketwheel/
├── admins          (email, password hash)
├── vendors         (name, email, approved, products array)
├── products        (name, price, vendor ID, image)
├── orders          (order ID, vendor, items, customer, status)
├── deliveryboys    (name, phone, assigned vendors)
└── banners         (title, image URL, active flag)
```

## Environment Variables

**backend/.env:**
```
MONGO_URI=mongodb://127.0.0.1:27017/rocketwheel
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
JWT_SECRET=changeme-in-production-use-strong-key
CENTRAL_ROCKETWHEEL_PHONE=919999999999
```

**frontend/.env.local:**
```
REACT_APP_API_URL=http://localhost:4000
REACT_APP_CENTRAL_PHONE=919999999999
```

Update `CENTRAL_ROCKETWHEEL_PHONE` with your actual RocketWheel WhatsApp number (format: country code + 10 digits, e.g., 919876543210).

## Production Deployment

For production, you'll need:
1. **Hosting**: AWS, DigitalOcean, Heroku, Vercel, etc.
2. **MongoDB Atlas**: Cloud MongoDB (not local)
3. **SSL Certificate**: Let's Encrypt or AWS ACM
4. **Domain**: Your domain name
5. **Environment Variables**: Set in hosting platform
6. **Image Storage**: AWS S3 or similar (instead of local `/uploads`)

## Support & Debugging

1. **Check logs**: Look at terminal output for errors
2. **Network tab**: Browser DevTools → Network tab to see API calls
3. **Backend logs**: Check what requests are being received
4. **Database**: Use `mongosh` to inspect data:
   ```powershell
   mongosh
   > use rocketwheel
   > db.vendors.find()
   ```

## You're All Set! 🚀

Your RocketWheel system is now fully operational. Start with the customer flow above, then explore admin and vendor features.

Happy ordering!
