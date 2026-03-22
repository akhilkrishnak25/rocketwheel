# RocketWheel - QR-Based Digital Menu & Delivery Management System

A centralized web-based platform for managing multi-vendor menus and WhatsApp-based ordering via RocketWheel delivery.

## Features

### Admin
- Approve/reject vendor registrations
- Enable/disable vendor access
- Manage delivery boys
- Assign delivery boys to vendors
- Upload advertisement banners
- Manage vendor categories
- View all orders and system data

### Vendor
- Self-registration (awaiting admin approval)
- Auto-generated unique QR code on approval
- Product CRUD (add, update, delete)
- Bulk product upload via Excel
- Product images support
- Product management dashboard

### Delivery Boy (RocketWheel)
- Receive orders via WhatsApp
- Delivery tracking through order status
- Centralized or per-vendor assignment

### Customer (User)
- No login required
- Scan vendor-specific QR → view vendor menu
- Scan global QR → browse all vendors by category
- Add to cart, checkout
- Place order via WhatsApp (includes order ID, items, total, address)

## Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose)
- **Frontend**: React + Bootstrap
- **QR Generation**: qrcode
- **Excel Parsing**: xlsx
- **Image Upload**: multer
- **Authentication**: JWT

## Project Structure

```
backend/
├── src/
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Vendor.js
│   │   ├── Product.js
│   │   ├── DeliveryBoy.js
│   │   ├── Banner.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── vendor.js
│   │   └── public.js
│   ├── middleware/
│   │   └── auth.js
│   └── server.js
├── uploads/
├── package.json
└── .env

frontend/
├── public/
├── src/
│   ├── pages/
│   │   ├── AdminLogin.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── VendorLogin.jsx
│   │   ├── VendorDashboard.jsx
│   │   ├── Vendors.jsx (Discovery)
│   │   └── VendorMenu.jsx
│   ├── App.jsx
│   ├── index.js
│   └── ...
└── package.json
```

## Prerequisites

- Node.js (v14+)
- MongoDB running locally (mongodb://127.0.0.1:27017)
- npm or yarn

## Setup & Run

### 1. Backend Setup (PowerShell)

```powershell
cd backend
copy .env.example .env
# Edit .env if needed (set your CENTRAL_ROCKETWHEEL_PHONE)
npm install
npm run dev
# Server runs on http://localhost:4000
```

### 2. Frontend Setup (PowerShell, new terminal)

```powershell
cd frontend
npm install
npm start
# Frontend runs on http://localhost:3000
```

## Default Admin Login

To create/login as admin:
- **Email**: admin@example.com
- **Password**: any-password (first login auto-creates with this password)

> Change password in production.

## API Endpoints

### Public Routes (no auth)
- `GET /api/public/vendors` - Get vendors grouped by category
- `GET /api/public/vendors/:vendorId` - Get vendor menu with products
- `GET /api/public/qr/global` - Generate global QR (links to /vendors)
- `GET /api/public/qr/vendor/:vendorId` - Generate vendor-specific QR
- `POST /api/public/orders` - Create order from cart

### Vendor Routes (require JWT)
- `POST /api/vendor/register` - Register new vendor
- `POST /api/vendor/login` - Vendor login
- `GET /api/vendor/:vendorId/info` - Get vendor info
- `GET /api/vendor/:vendorId/products` - List vendor products
- `POST /api/vendor/:vendorId/products` - Add product with image
- `POST /api/vendor/:vendorId/products/upload-xlsx` - Bulk upload via Excel

### Admin Routes (require JWT + admin role)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/vendors` - List all vendors
- `POST /api/admin/vendors/:id/approve` - Approve vendor (generates QR)
- `POST /api/admin/vendors/:id/reject` - Reject vendor
- `POST /api/admin/vendors/:id/toggle` - Enable/disable vendor
- `GET /api/admin/deliveryboys` - List delivery boys
- `POST /api/admin/deliveryboys` - Add delivery boy
- `POST /api/admin/vendors/:id/assign-delivery` - Assign delivery boy to vendor
- `POST /api/admin/banners` - Upload banner image
- `GET /api/admin/banners` - Get active banner
- `POST /api/admin/central-delivery` - Set central RocketWheel number
- `GET /api/admin/orders` - View all orders

## User Flow

### Customer Journey
1. **Scan Vendor QR** → `/menu/{vendorId}`
   - See vendor menu, products, banner
   - Add to cart
   - Enter name, phone, address
   - Click "Order via RocketWheel"
   - WhatsApp message opens with order details

2. **Scan Global QR** → `/vendors`
   - Browse vendors by category
   - Click vendor → `/menu/{vendorId}`

### Vendor Journey
1. Register at `/vendor/login`
2. Wait for admin approval
3. Login to `/vendor/dashboard`
4. Add products (one-by-one or bulk Excel)
5. Download QR code
6. Share QR with customers

### Admin Journey
1. Login at `/admin/login`
2. Approve pending vendors
3. Manage delivery boys
4. Upload banners
5. Set central RocketWheel number
6. View orders

## WhatsApp Message Format

```
Hello RocketWheel,

New Order Details:

Order ID: RW-{timestamp}-{random}
Vendor: {Vendor Name}
Category: {Category Name}

Items:

* {Item Name} x{Qty} = ₹{Price} x {Qty} = ₹{Item Total}

Total Amount: ₹{Total}

Customer Name: {Customer Name}
Phone: {Customer Phone}
Address: {Customer Address}

Please confirm delivery.
```

## Excel Bulk Upload Format

Create an Excel file with columns:
| name | price |
|------|-------|
| Item 1 | 100 |
| Item 2 | 250 |

Headers are case-insensitive.

## Environment Variables

**Backend (.env)**
```
MONGO_URI=mongodb://127.0.0.1:27017/rocketwheel
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
JWT_SECRET=your-secret-key
CENTRAL_ROCKETWHEEL_PHONE=919XXXXXXXXX
```

**Frontend (.env.local, optional)**
```
REACT_APP_API_URL=http://localhost:4000
REACT_APP_CENTRAL_PHONE=919XXXXXXXXX
```

## Future Enhancements

- Payment integration (Razorpay, Stripe)
- Real-time order tracking
- Ratings and reviews
- Analytics dashboard
- SMS notifications
- Mobile app (React Native)
- Push notifications
- Delivery charge calculation
- Multiple language support

## License

MIT
