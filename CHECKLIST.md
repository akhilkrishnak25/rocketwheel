# 🚀 RocketWheel - Pre-Launch Checklist

## ✅ System Setup Complete

All files have been created and configured. Follow this checklist to launch.

---

## 📋 Pre-Launch Checklist

### Prerequisites
- [ ] Node.js v14+ installed (`node --version`)
- [ ] MongoDB installed and working (`mongosh`)
- [ ] PowerShell or Command Prompt available
- [ ] Git (optional, for version control)

### Configuration
- [ ] Backend `.env` file configured with:
  - [ ] MONGO_URI (default: mongodb://127.0.0.1:27017/rocketwheel)
  - [ ] PORT (default: 4000)
  - [ ] CLIENT_ORIGIN (default: http://localhost:3000)
  - [ ] JWT_SECRET (set to strong value)
  - [ ] CENTRAL_ROCKETWHEEL_PHONE (set to WhatsApp number)

- [ ] Frontend `.env.local` configured with:
  - [ ] REACT_APP_API_URL (default: http://localhost:4000)
  - [ ] REACT_APP_CENTRAL_PHONE (set to WhatsApp number)

---

## 🚀 Launch Steps

### Step 1: Verify MongoDB is Running
```powershell
mongosh
# Should connect successfully
# Type: exit
```

### Step 2: Install Dependencies (First Time Only)
```powershell
# Terminal 1 - Backend
cd C:\Users\prade\rocketwheel\backend
npm install

# Terminal 2 - Frontend
cd C:\Users\prade\rocketwheel\frontend
npm install
```

### Step 3: Start Backend Service
```powershell
# Terminal 1
cd C:\Users\prade\rocketwheel\backend
npm run dev

# Expected output:
# MongoDB connected
# Server running on port 4000
```

### Step 4: Start Frontend Service
```powershell
# Terminal 2
cd C:\Users\prade\rocketwheel\frontend
npm start

# Expected output:
# Compiled successfully!
# Local: http://localhost:3000
```

### Step 5: Open in Browser
```
http://localhost:3000
```

---

## 🧪 First-Time Testing Flow

### 1. Create Admin Account (2 min)
- Click "Admin Login" (top right)
- Enter any email (e.g., admin@example.com)
- Enter any password (e.g., password123)
- Click "Login"
- Admin account created automatically

### 2. Add Delivery Boy (1 min)
- Stay in Admin Dashboard
- Go to "Delivery Boys" tab
- Name: "RocketWheel Delivery"
- Phone: 919999999999
- Click "Add"

### 3. Set Central Delivery Number (1 min)
- Go to "Central Number" tab
- Phone: 919999999999
- Click "Save"

### 4. Upload Banner (Optional, 1 min)
- Go to "Banner" tab
- Title: "Welcome to RocketWheel"
- Upload any image
- Click "Upload"

### 5. Register as Vendor (2 min)
- Open incognito/private browser tab
- Go to http://localhost:3000
- Click "Vendor Login"
- Go to "Register" tab
- Fill:
  - Business Name: "Test Restaurant"
  - Email: vendor@test.com
  - Password: password123
  - Category: Restaurant
  - Address: 123 Main St
  - Phone: 9876543210
- Click "Register"
- Message: "Registered! Awaiting admin approval"

### 6. Approve Vendor (1 min)
- Go back to Admin tab
- Go to "Vendors" tab
- Click "Approve" button
- Status should change to "Approved"

### 7. Login as Vendor (1 min)
- Incognito tab
- Click "Vendor Login"
- Go to "Login" tab
- Email: vendor@test.com
- Password: password123
- Click "Login"
- Vendor Dashboard opens

### 8. Add Products (5 min)
- Go to "Products" tab
- Add Product 1:
  - Name: "Margherita Pizza"
  - Price: 299
  - Click "Add"
- Add Product 2:
  - Name: "Garlic Bread"
  - Price: 99
  - Click "Add"
- Add Product 3:
  - Name: "Coke 250ml"
  - Price: 49
  - Click "Add"

### 9. Download QR Code (1 min)
- Go to "QR Code" tab
- Click "Download QR Code"
- QR saves to Downloads folder

### 10. View Menu as Customer (2 min)
- Regular browser tab
- Go to http://localhost:3000
- You should see:
  - "RocketWheel Vendors" header
  - "Restaurant" category
  - "Test Restaurant" vendor
  - Click "Browse Menu"

### 11. Browse Menu & Add Items (3 min)
- See products: Margherita Pizza, Garlic Bread, Coke
- Click "Add to Cart" on each
- Right panel shows cart with items
- Total price calculates automatically

### 12. Place Order (2 min)
- In cart section, fill:
  - Your Name: "John Test"
  - Phone: 8765432109
  - Address: "123 Test Street"
- Click "Order via RocketWheel"
- WhatsApp link opens in new window with message:
  ```
  Hello RocketWheel,
  
  New Order Details:
  
  Order ID: RW-{timestamp}-{random}
  Vendor: Test Restaurant
  Category: Restaurant
  
  Items:
  
  * Margherita Pizza x1 = ₹299 x 1 = ₹299
  * Garlic Bread x1 = ₹99 x 1 = ₹99
  * Coke 250ml x1 = ₹49 x 1 = ₹49
  
  Total Amount: ₹447
  
  Customer Name: John Test
  Phone: 8765432109
  Address: 123 Test Street
  
  Please confirm delivery.
  ```
- Close window to return to menu

### 13. View Orders in Admin (1 min)
- Go back to Admin Dashboard
- Orders are saved in database
- Admin can view all orders

---

## ✅ All Tests Passed If

- [x] Admin login works
- [x] Vendor registration works
- [x] Vendor approval works
- [x] Vendor can add products
- [x] QR code downloads
- [x] Customer can view menu
- [x] Products appear correctly
- [x] Cart calculates total
- [x] WhatsApp message opens
- [x] Message is formatted correctly
- [x] Order is saved to database
- [x] Banner appears on menu page

---

## 🛠️ Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| **Backend won't start** | Check MongoDB is running, check port 4000 |
| **Frontend won't compile** | Delete node_modules, run npm install again |
| **Images won't upload** | Ensure /uploads folder exists, restart backend |
| **WhatsApp link doesn't open** | Check phone number format (919999999999) |
| **QR code won't download** | Check browser download settings |
| **Vendor can't login** | Ensure vendor is approved by admin |
| **Admin can't create account** | Check JWT_SECRET is set in .env |

See **SETUP.md** for detailed troubleshooting.

---

## 📞 Support Resources

| Issue | See File |
|-------|----------|
| **Setup problems** | SETUP.md |
| **API testing** | API_TESTING.md |
| **System design** | ARCHITECTURE.md |
| **Feature overview** | README.md |
| **Project summary** | SUMMARY.md |

---

## 🎯 Success Indicators

When everything is working:

1. **Backend Terminal** shows:
   ```
   MongoDB connected
   Server running on port 4000
   ```

2. **Frontend Terminal** shows:
   ```
   Compiled successfully!
   Local: http://localhost:3000
   ```

3. **Browser** shows:
   ```
   RocketWheel Vendors page with vendor cards
   ```

4. **Admin Dashboard** works:
   ```
   Can see pending vendors
   Can approve vendors
   Can manage delivery boys
   ```

5. **Vendor Dashboard** works:
   ```
   Can add products
   Can download QR
   Can see product list
   ```

6. **Customer Order** works:
   ```
   Can browse vendors
   Can view menu
   Can add to cart
   Can place order via WhatsApp
   ```

---

## 📊 Expected Timelines

| Task | Time |
|------|------|
| Install dependencies | 2-3 min |
| Start both servers | 1 min |
| Complete first test flow | 15 min |
| Familiar with system | 30 min |
| Ready for production testing | 1 hour |

---

## 🚀 You're Ready When

✅ Both backend and frontend are running
✅ Browser opens http://localhost:3000 without errors
✅ Admin login works
✅ Can create and approve vendors
✅ Can add products and download QR
✅ Can place orders via WhatsApp

---

## 📝 Notes

- **First Admin Login**: Takes 30 seconds to create account
- **Vendor Approval**: Admin must click approve in dashboard
- **Products**: Can be added one-by-one or bulk via Excel
- **QR Codes**: Generated on vendor approval
- **Orders**: Appear in admin dashboard after placement
- **WhatsApp**: Opens in default browser, doesn't actually send (needs WhatsApp Web)

---

## 🎉 Next Steps After Testing

1. ✅ Verify all features work locally
2. 📝 Review code in `/src` folders
3. 🔒 Change JWT_SECRET to production value
4. 🌐 Deploy backend to cloud (AWS, Heroku, Railway)
5. 📱 Deploy frontend to Vercel or Netlify
6. 🗄️ Switch to MongoDB Atlas (cloud database)
7. 📦 Use AWS S3 for image storage
8. 🔐 Enable SSL/HTTPS
9. 📊 Add monitoring & logging
10. 💳 Integrate payment system (optional)

---

**Status**: ✅ Ready to Launch

**Time to First Test**: ~5 minutes

**Happy Ordering! 🚀**
