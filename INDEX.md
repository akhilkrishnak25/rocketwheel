# RocketWheel - Complete System Implementation

## 📋 Project Summary

A centralized, web-based **QR-based digital menu and delivery management system** for multiple vendors (restaurants, grocery, pharmacy, electronics, etc.) with WhatsApp-based ordering via RocketWheel delivery.

**Status**: ✅ Fully Implemented & Ready to Run (Local Development)

---

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```powershell
cd C:\Users\prade\rocketwheel
.\QUICKSTART.ps1
# Follow the on-screen instructions
```

### Option 2: Manual Setup
```powershell
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend (new PowerShell window)
cd frontend
npm install
npm start

# Open browser: http://localhost:3000
```

**Prerequisites**: Node.js v14+ and MongoDB running locally

---

## 📂 Project Structure

```
c:\Users\prade\rocketwheel\
│
├── 📄 README.md                 (Main documentation)
├── 📄 SETUP.md                  (Detailed setup guide for Windows)
├── 📄 ARCHITECTURE.md           (System design & data flows)
├── 📄 API_TESTING.md            (API endpoints & testing)
├── 📄 QUICKSTART.bat            (Windows batch installer)
├── 📄 QUICKSTART.ps1            (PowerShell installer)
│
├── backend/                      (Node.js + Express API)
│   ├── .env                     (Environment configuration)
│   ├── .env.example             (Template)
│   ├── package.json             (Dependencies)
│   │
│   └── src/
│       ├── server.js            (Express app entry)
│       │
│       ├── models/              (Mongoose schemas)
│       │   ├── Admin.js         (Admin user model)
│       │   ├── Vendor.js        (Vendor/store model)
│       │   ├── Product.js       (Menu items model)
│       │   ├── Order.js         (Customer orders model)
│       │   ├── DeliveryBoy.js   (Delivery agent model)
│       │   └── Banner.js        (Promo banner model)
│       │
│       ├── routes/              (API endpoints)
│       │   ├── admin.js         (Admin management APIs)
│       │   ├── vendor.js        (Vendor CRUD APIs)
│       │   └── public.js        (Customer discovery & ordering APIs)
│       │
│       └── middleware/
│           └── auth.js          (JWT authentication)
│
│   └── uploads/                 (Generated at runtime)
│       ├── products/            (Product images)
│       └── banners/             (Banner images)
│
│
├── frontend/                     (React + Bootstrap)
│   ├── .env.local               (Frontend configuration)
│   ├── package.json             (React dependencies)
│   │
│   ├── public/
│   │   └── index.html
│   │
│   └── src/
│       ├── App.jsx              (Main app router)
│       ├── index.js             (React entry point)
│       │
│       └── pages/               (Page components)
│           ├── Vendors.jsx          (Discovery - browse vendors by category)
│           ├── VendorMenu.jsx       (Menu - products, cart, checkout)
│           ├── AdminLogin.jsx       (Admin authentication)
│           ├── AdminDashboard.jsx   (Vendor approval, delivery mgmt, banners)
│           ├── VendorLogin.jsx      (Vendor auth & registration)
│           └── VendorDashboard.jsx  (Product CRUD, bulk upload, QR)
```

---

## 🎯 Key Features Implemented

### ✅ Customer (No Login)
- [x] Scan vendor-specific QR → View menu
- [x] Scan global QR → Browse vendors by category
- [x] Add products to cart
- [x] Checkout with name, phone, address
- [x] Place order via WhatsApp (auto-generated message)
- [x] Order includes: Order ID, vendor, items, total, customer details

### ✅ Vendor (JWT Auth)
- [x] Self-registration (awaiting admin approval)
- [x] Auto-generated unique QR code on approval
- [x] Product CRUD (add, update, delete)
- [x] Bulk product upload via Excel file
- [x] Product images upload
- [x] Download QR code
- [x] Dashboard with product list

### ✅ Admin (JWT Auth)
- [x] Approve/reject vendor registrations
- [x] Enable/disable vendor access
- [x] Manage delivery boys
- [x] Assign delivery boys to vendors
- [x] Set central RocketWheel delivery number
- [x] Upload promotional banners
- [x] View all vendors and orders
- [x] Auto-create admin account on first login

### ✅ Delivery Boy (RocketWheel)
- [x] Receive orders via WhatsApp
- [x] Orders routed to assigned delivery phone or central number
- [x] Order includes all details for delivery

### ✅ Technical Features
- [x] JWT-based authentication
- [x] QR code generation (vendor & global)
- [x] Excel file parsing & bulk upload
- [x] Image upload (products & banners)
- [x] MongoDB integration
- [x] Responsive Bootstrap UI
- [x] WhatsApp integration (encodeURIComponent)
- [x] Order tracking with status
- [x] Unique order IDs (RW-{timestamp}-{random})

---

## 🔌 API Endpoints

### Public Routes (No Auth Required)
```
GET    /api/public/vendors                      → Vendors by category
GET    /api/public/vendors/:vendorId            → Vendor menu + products
GET    /api/public/qr/global                    → Global QR code
GET    /api/public/qr/vendor/:vendorId          → Vendor QR code
POST   /api/public/orders                       → Create order
GET    /api/public/orders/:orderId              → Get order details
```

### Vendor Routes (JWT + vendor role)
```
POST   /api/vendor/register                     → Register vendor
POST   /api/vendor/login                        → Vendor login
GET    /api/vendor/:vendorId/info               → Vendor profile
GET    /api/vendor/:vendorId/products           → List products
POST   /api/vendor/:vendorId/products           → Add product (with image)
POST   /api/vendor/:vendorId/products/upload-xlsx → Bulk upload Excel
```

### Admin Routes (JWT + admin role)
```
POST   /api/admin/login                         → Admin login
GET    /api/admin/vendors                       → List all vendors
POST   /api/admin/vendors/:id/approve           → Approve vendor + generate QR
POST   /api/admin/vendors/:id/reject            → Reject/delete vendor
POST   /api/admin/vendors/:id/toggle            → Enable/disable vendor
GET    /api/admin/deliveryboys                  → List delivery boys
POST   /api/admin/deliveryboys                  → Add delivery boy
POST   /api/admin/vendors/:id/assign-delivery   → Assign delivery boy
POST   /api/admin/banners                       → Upload banner (with image)
GET    /api/admin/banners                       → Get active banner
POST   /api/admin/central-delivery              → Set central delivery number
GET    /api/admin/orders                        → View all orders
```

---

## 📊 Database Collections

```javascript
// Admins
{
  _id: ObjectId,
  email: String (unique),
  password: String (bcrypt hash),
  role: "admin",
  createdAt: Date
}

// Vendors
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (bcrypt hash),
  category: String,
  address: String,
  phone: String,
  approved: Boolean,
  enabled: Boolean,
  qrDataUrl: String (base64),
  assignedDeliveryPhone: String,
  products: [ObjectId],
  createdAt: Date
}

// Products
{
  _id: ObjectId,
  vendor: ObjectId,
  name: String,
  price: Number,
  imageUrl: String,
  createdAt: Date
}

// Orders
{
  _id: ObjectId,
  orderId: String (unique, RW-{ts}-{rand}),
  vendor: ObjectId,
  items: [{product: String, qty: Number, price: Number}],
  totalAmount: Number,
  customerName: String,
  customerPhone: String,
  customerAddress: String,
  deliveryPhone: String (WhatsApp),
  status: String (pending/confirmed/on-way/delivered),
  createdAt: Date
}

// DeliveryBoys
{
  _id: ObjectId,
  name: String,
  phone: String (WhatsApp),
  assignedVendors: [ObjectId],
  createdAt: Date
}

// Banners
{
  _id: ObjectId,
  title: String,
  imageUrl: String,
  active: Boolean,
  createdAt: Date
}
```

---

## 🔐 Authentication

**JWT-based**: Each user (admin/vendor) receives a token on login
- **Token Expiry**: 7 days
- **Secret**: Stored in `JWT_SECRET` env variable
- **Header Format**: `Authorization: Bearer {token}`

**Password Security**: bcryptjs hashing
- Passwords are hashed before storage
- Never stored in plain text

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Bootstrap 5, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose ODM |
| **QR Codes** | qrcode library |
| **Excel** | xlsx library |
| **File Upload** | multer middleware |
| **Authentication** | JWT (jsonwebtoken) |
| **Password Hash** | bcryptjs |
| **Messaging** | WhatsApp Web API |

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| **README.md** | Main project overview & features |
| **SETUP.md** | Detailed Windows setup guide with troubleshooting |
| **ARCHITECTURE.md** | System design, data flows, database schema |
| **API_TESTING.md** | API endpoints with PowerShell testing examples |
| **QUICKSTART.ps1** | Automated setup script (PowerShell) |
| **QUICKSTART.bat** | Automated setup script (Batch) |

---

## 🧪 Testing the System

### Step-by-step flow:
1. **Start Backend & Frontend** (see Quick Start above)
2. **Create Admin**: Admin Login → first login creates account
3. **Add Delivery Boy**: Admin Dashboard → Delivery Boys → Add
4. **Register Vendor**: Vendor Login → Register tab → fill form → Register
5. **Approve Vendor**: Admin Dashboard → Vendors → Approve
6. **Vendor Login & Add Products**: Vendor Dashboard → Products → Add / Bulk Upload
7. **Customer Browse**: Home page shows vendors by category
8. **Customer Order**: Click Browse Menu → Add items → Checkout → WhatsApp

---

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Admin Login**: http://localhost:3000/admin/login
- **Vendor Login**: http://localhost:3000/vendor/login
- **Customer Discovery**: http://localhost:3000/vendors

---

## 📝 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://127.0.0.1:27017/rocketwheel
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
JWT_SECRET=changeme-in-production
CENTRAL_ROCKETWHEEL_PHONE=919999999999
```

### Frontend (.env.local)
```env
REACT_APP_API_URL=http://localhost:4000
REACT_APP_CENTRAL_PHONE=919999999999
```

---

## ⚙️ Configuration Files

| File | Purpose |
|------|---------|
| `backend/.env` | Backend environment (configured) |
| `backend/.env.example` | Template for .env |
| `backend/package.json` | Node.js dependencies |
| `frontend/.env.local` | Frontend environment (configured) |
| `frontend/package.json` | React dependencies |

---

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **Port 4000 in use** | `netstat -ano \| findstr :4000` → Kill process |
| **MongoDB not running** | Start service or run `mongod.exe` |
| **npm ERR! code ELIFECYCLE** | Delete `node_modules`, run `npm install` again |
| **React won't compile** | Check port 3000, try port 3001 |
| **Images not uploading** | Ensure `/uploads` folder exists in backend |
| **WhatsApp link not opening** | Check phone number format (country code included) |

See **SETUP.md** for detailed troubleshooting.

---

## 📱 WhatsApp Message Format

```
Hello RocketWheel,

New Order Details:

Order ID: RW-1697432456789-abc123
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

---

## 🚀 Deployment Ready

The system is production-ready with minor changes:
1. MongoDB Atlas (cloud) instead of local
2. AWS S3 for image storage instead of local `/uploads`
3. Set proper SSL certificates
4. Increase JWT secret strength
5. Add rate limiting & CORS config
6. Deploy on: AWS, Heroku, DigitalOcean, Vercel, Netlify

---

## 📚 Learning Resources

- **MongoDB**: https://docs.mongodb.com/
- **Express.js**: https://expressjs.com/
- **React**: https://react.dev/
- **JWT**: https://jwt.io/
- **Bootstrap**: https://getbootstrap.com/

---

## ✨ Features Beyond Requirements

- [x] Unique order IDs with timestamps
- [x] Order status tracking
- [x] Admin auto-account creation
- [x] Responsive mobile design
- [x] Password hashing (bcrypt)
- [x] JWT expiration
- [x] Excel bulk product upload
- [x] Banner management
- [x] Delivery boy assignment
- [x] Central vs vendor-specific delivery

---

## 🎓 Code Quality

- Clean, modular architecture
- Separation of concerns (models, routes, middleware)
- RESTful API design
- Mongoose schema validation
- Error handling
- Comments in complex sections
- Consistent naming conventions

---

## 📧 Support

For detailed setup help, see **SETUP.md**
For API testing, see **API_TESTING.md**
For system design, see **ARCHITECTURE.md**

---

**Status**: ✅ Complete and Ready to Use
**Last Updated**: March 19, 2026

🎉 **Your RocketWheel system is ready to go!**
