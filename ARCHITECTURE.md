# RocketWheel System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    ROCKETWHEEL SYSTEM (2026)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐         ┌──────────────────┐               │
│  │  FRONTEND APPS  │         │   BACKEND API    │               │
│  │ (React, Port 3K)│◄────────│(Node/Exp, Port 4K)               │
│  └────────┬────────┘         └────────┬─────────┘               │
│           │                           │                         │
│     ┌─────┴──────────┬────────┬───────┴────┐                    │
│     │                │        │            │                    │
│  Customer        Vendor     Admin      Delivery Boy             │
│  (No Login)      (JWT)       (JWT)      (WhatsApp)              │
│     │                │        │            │                    │
│  Scan QR ──────────────────────┐          │                    │
│     │                │        │ │          │                    │
│     └──────────┐     │    ┌───▼┴───────────┤                    │
│                │     │    │                │                    │
│           ┌────▼─────▼────▼────────────────▼─┐                 │
│           │      MONGODB DATABASE             │                 │
│           │  ┌──────────────────────────┐    │                 │
│           │  │ Collections:             │    │                 │
│           │  ├─ admins                  │    │                 │
│           │  ├─ vendors                 │    │                 │
│           │  ├─ products                │    │                 │
│           │  ├─ orders                  │    │                 │
│           │  ├─ deliveryboys            │    │                 │
│           │  ├─ banners                 │    │                 │
│           │  └─ categories              │    │                 │
│           └────────────────────────────────┘                   │
│                                                                   │
│  ┌─────────────────────────────────────────────────┐            │
│  │  STORAGE                                        │            │
│  ├─ /uploads/products/  (product images)          │            │
│  ├─ /uploads/banners/   (promotional images)      │            │
│  └─ QR codes (data URLs in DB)                    │            │
│                                                                   │
│  ┌─────────────────────────────────────────────────┐            │
│  │  EXTERNAL INTEGRATION                          │            │
│  ├─ WhatsApp (api.whatsapp.com/send)              │            │
│  │   └─ For order delivery & notifications        │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow - Customer Ordering

```
┌──────────────┐
│  Customer    │
│ (No Account) │
└──────┬───────┘
       │
       ├─ SCAN VENDOR QR CODE
       │  └─> /menu/{vendorId}
       │
       └─ SCAN GLOBAL QR CODE
          └─> /vendors (Discovery Page)
              │
              └─> Select Category & Vendor
                 └─> /menu/{vendorId}
                    │
                    ├─> Fetch Vendor (GET /api/public/vendors/{id})
                    ├─> Fetch Products (included above)
                    ├─> Fetch Banner (included above)
                    │
                    └─> ADD TO CART
                       └─> CHECKOUT
                          │
                          ├─ Enter Name, Phone, Address
                          ├─ Build Order Details
                          ├─ POST /api/public/orders (Save order to DB)
                          │
                          └─> OPEN WhatsApp
                             └─> api.whatsapp.com/send?phone={delivery_number}&text={encoded_message}
                                 │
                                 └─> Delivery Boy Receives Order
                                    ├─ Confirms delivery
                                    ├─ Picks up from vendor
                                    └─> Delivers to customer
```

## Data Flow - Vendor Registration & Approval

```
┌──────────────┐
│   VENDOR     │
└──────┬───────┘
       │
       ├─ REGISTER
       │  └─> POST /api/vendor/register
       │     ├─ Email, Password, Business Info
       │     ├─ Stored in DB with approved=false
       │     └─> Vendor Status: PENDING
       │
       ├─ WAIT FOR ADMIN APPROVAL
       │  └─> Admin sees pending vendors
       │     └─> GET /api/admin/vendors
       │
       ├─ ADMIN APPROVES
       │  └─> POST /api/admin/vendors/{id}/approve
       │     ├─ Generate QR Code (qrcode library)
       │     ├─ QR links to /menu/{vendorId}
       │     ├─ Save QRDataUrl in Vendor document
       │     └─> Vendor Status: APPROVED
       │
       └─ VENDOR LOGIN
          └─> POST /api/vendor/login
             ├─ Verify email + password (bcrypt)
             ├─ Check approved=true (else 403)
             ├─ Generate JWT token
             │
             └─> VENDOR DASHBOARD
                ├─ View QR Code (GET /api/public/qr/vendor/{id})
                ├─ Add Products
                │  └─> POST /api/vendor/{id}/products (with image)
                ├─ Bulk Upload via Excel
                │  └─> POST /api/vendor/{id}/products/upload-xlsx
                └─ Manage inventory
```

## Data Flow - Admin Management

```
┌────────┐
│ ADMIN  │
└───┬────┘
    │
    ├─ LOGIN
    │  └─> POST /api/admin/login
    │     ├─ First login auto-creates account
    │     ├─ Generate JWT token
    │     └─> ADMIN DASHBOARD
    │
    ├─ MANAGE VENDORS
    │  ├─ View all vendors (GET /api/admin/vendors)
    │  ├─ Approve vendor (POST /api/admin/vendors/{id}/approve)
    │  │  └─> Generate QR code
    │  ├─ Reject vendor (POST /api/admin/vendors/{id}/reject)
    │  └─ Enable/Disable (POST /api/admin/vendors/{id}/toggle)
    │
    ├─ MANAGE DELIVERY BOYS
    │  ├─ Add delivery boy (POST /api/admin/deliveryboys)
    │  ├─ View all (GET /api/admin/deliveryboys)
    │  └─ Assign to vendor (POST /api/admin/vendors/{id}/assign-delivery)
    │
    ├─ UPLOAD BANNERS
    │  └─> POST /api/admin/banners (with image)
    │     ├─ Stored in /uploads/banners/
    │     ├─ Displayed on all vendor menu pages
    │     └─ Only one active banner at a time
    │
    ├─ SET CENTRAL DELIVERY NUMBER
    │  └─> POST /api/admin/central-delivery
    │     ├─ Used for all vendors without assigned delivery boy
    │     └─ Orders routed to central RocketWheel number
    │
    └─ VIEW ORDERS
       └─> GET /api/admin/orders
          └─ See all orders, statuses, customer details
```

## Authentication & Authorization

```
┌────────────────────────────────────────┐
│        JWT TOKEN SYSTEM                │
├────────────────────────────────────────┤
│                                        │
│  USER LOGIN (email + password)         │
│       ↓                                │
│  Verify credentials (bcrypt)           │
│       ↓                                │
│  Generate JWT Token                    │
│  ├─ Payload: { id, role }             │
│  ├─ Secret: JWT_SECRET (env var)      │
│  └─ Expires: 7 days                   │
│       ↓                                │
│  CLIENT stores in localStorage        │
│       ↓                                │
│  API REQUESTS use header:              │
│  Authorization: Bearer {token}         │
│       ↓                                │
│  MIDDLEWARE verifies token             │
│  ├─ Decode with secret                │
│  ├─ Check expiration                  │
│  ├─ Extract role (admin/vendor)       │
│  └─ Attach user to request            │
│       ↓                                │
│  ROUTE HANDLER                         │
│  ├─ Checks authorization              │
│  ├─ Performs action                   │
│  └─ Returns response                  │
│                                        │
└────────────────────────────────────────┘

ROLES:
├─ admin   → Can manage vendors, delivery boys, banners
├─ vendor  → Can manage own products
└─ user    → No auth needed for ordering
```

## Database Schema

```
┌─────────────────────────────────────────────────────────┐
│ admins                                                  │
├─────────────────────────────────────────────────────────┤
│ _id: ObjectId                                           │
│ email: String (unique)                                  │
│ password: String (hashed with bcrypt)                   │
│ role: "admin"                                           │
│ createdAt: Date                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ vendors                                                 │
├─────────────────────────────────────────────────────────┤
│ _id: ObjectId (vendorId)                                │
│ name: String                                            │
│ email: String (unique)                                  │
│ password: String (hashed)                               │
│ category: String (Restaurant, Grocery, etc.)            │
│ address: String                                         │
│ phone: String                                           │
│ approved: Boolean (default: false)                      │
│ enabled: Boolean (default: true)                        │
│ qrDataUrl: String (base64 QR image)                     │
│ assignedDeliveryPhone: String (or null for central)     │
│ products: [ObjectId] (array of product IDs)             │
│ createdAt: Date                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ products                                                │
├─────────────────────────────────────────────────────────┤
│ _id: ObjectId                                           │
│ vendor: ObjectId (ref: Vendor)                          │
│ name: String                                            │
│ price: Number                                           │
│ imageUrl: String (path to /uploads/products/)           │
│ createdAt: Date                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ orders                                                  │
├─────────────────────────────────────────────────────────┤
│ _id: ObjectId                                           │
│ orderId: String (unique, e.g., RW-{ts}-{random})       │
│ vendor: ObjectId (ref: Vendor)                          │
│ items: [{                                               │
│   product: String (name)                                │
│   qty: Number                                           │
│   price: Number                                         │
│ }]                                                      │
│ totalAmount: Number                                     │
│ customerName: String                                    │
│ customerPhone: String                                   │
│ customerAddress: String                                 │
│ deliveryPhone: String (WhatsApp number)                 │
│ status: String (pending/confirmed/on-way/delivered)    │
│ createdAt: Date                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ deliveryboys                                            │
├─────────────────────────────────────────────────────────┤
│ _id: ObjectId                                           │
│ name: String                                            │
│ phone: String (WhatsApp number)                         │
│ assignedVendors: [ObjectId] (array of vendor IDs)       │
│ createdAt: Date                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ banners                                                 │
├─────────────────────────────────────────────────────────┤
│ _id: ObjectId                                           │
│ title: String                                           │
│ imageUrl: String (path to /uploads/banners/)            │
│ active: Boolean (only one active at a time)             │
│ createdAt: Date                                         │
└─────────────────────────────────────────────────────────┘
```

## API Routes Summary

```
PUBLIC ROUTES (No Auth)
├─ GET  /api/public/vendors              → Get vendors grouped by category
├─ GET  /api/public/vendors/{id}         → Get vendor menu + products
├─ GET  /api/public/qr/global            → Get global QR code image
├─ GET  /api/public/qr/vendor/{id}       → Get vendor QR code image
└─ POST /api/public/orders               → Create order from cart

VENDOR ROUTES (JWT Required)
├─ POST /api/vendor/register             → Register new vendor
├─ POST /api/vendor/login                → Login vendor
├─ GET  /api/vendor/{id}/info            → Get vendor profile
├─ GET  /api/vendor/{id}/products        → List vendor products
├─ POST /api/vendor/{id}/products        → Add product (with image)
└─ POST /api/vendor/{id}/products/upload-xlsx → Bulk upload via Excel

ADMIN ROUTES (JWT + Admin Role Required)
├─ POST /api/admin/login                 → Admin login
├─ GET  /api/admin/vendors               → List all vendors
├─ POST /api/admin/vendors/{id}/approve  → Approve vendor + generate QR
├─ POST /api/admin/vendors/{id}/reject   → Reject vendor
├─ POST /api/admin/vendors/{id}/toggle   → Enable/disable vendor
├─ GET  /api/admin/deliveryboys          → List delivery boys
├─ POST /api/admin/deliveryboys          → Add delivery boy
├─ POST /api/admin/vendors/{id}/assign-delivery → Assign delivery boy
├─ POST /api/admin/banners               → Upload banner image
├─ GET  /api/admin/banners               → Get active banner
├─ POST /api/admin/central-delivery      → Set central delivery number
└─ GET  /api/admin/orders                → View all orders
```

## Technology Stack Details

```
BACKEND
├─ Node.js v14+ (JavaScript runtime)
├─ Express.js (Web framework)
├─ MongoDB (NoSQL database)
├─ Mongoose (ODM for MongoDB)
├─ JWT (jsonwebtoken) - Authentication
├─ bcryptjs - Password hashing
├─ qrcode - QR code generation
├─ xlsx - Excel file parsing
├─ multer - File upload middleware
└─ dotenv - Environment variables

FRONTEND
├─ React v18 (UI library)
├─ Bootstrap v5 (CSS framework)
├─ axios - HTTP client
├─ react-router-dom - Routing
└─ localStorage - Client-side data persistence

EXTERNAL SERVICES
├─ WhatsApp Web API (api.whatsapp.com)
└─ MongoDB Atlas (optional for production)
```

## Deployment Architecture (Production)

```
┌──────────────────────────────────────────────────────────┐
│                    PRODUCTION SETUP                      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  CDN / Frontend Hosting                        │   │
│  ├─ Vercel / Netlify / AWS CloudFront            │   │
│  ├─ React build output                           │   │
│  └─ Serves: rocketwheel.com                      │   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  API Server (Dockerized)                       │   │
│  ├─ AWS EC2 / DigitalOcean / Heroku              │   │
│  ├─ Node.js + Express running                     │   │
│  ├─ SSL/TLS (Let's Encrypt)                       │   │
│  └─ Load Balancer (optional)                      │   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Database                                       │   │
│  ├─ MongoDB Atlas (Cloud MongoDB)                 │   │
│  ├─ Replicated & Backed up                        │   │
│  └─ Auto-scaling                                  │   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  File Storage                                   │   │
│  ├─ AWS S3 or Google Cloud Storage                │   │
│  ├─ Stores: Product images, Banners, QR codes     │   │
│  └─ CloudFront for CDN                            │   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Monitoring & Logging                          │   │
│  ├─ Sentry (Error tracking)                       │   │
│  ├─ CloudWatch (AWS)                              │   │
│  └─ New Relic (Performance)                       │   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Security                                       │   │
│  ├─ SSL/TLS Certificate                           │   │
│  ├─ DDoS Protection (Cloudflare)                  │   │
│  ├─ API Rate Limiting                             │   │
│  ├─ CORS Configured                               │   │
│  └─ Environment Variables (Secrets Manager)       │   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Scalability Considerations

1. **Database**: Use MongoDB Atlas with sharding for large data
2. **File Storage**: AWS S3 + CloudFront for images
3. **API**: Implement caching (Redis), CDN, load balancing
4. **Frontend**: Serve from Vercel/Netlify with edge caching
5. **Real-time**: Consider Socket.io for live order updates
6. **Payment**: Integrate Razorpay or Stripe for future
7. **Analytics**: Add tracking for vendor performance, user behavior
8. **Mobile**: Build React Native or Flutter apps

## Security Checklist

- ✅ Password hashing (bcryptjs)
- ✅ JWT token authentication
- ✅ Rate limiting (implement in production)
- ✅ CORS enabled
- ✅ Input validation
- ✅ SQL injection protection (MongoDB, no SQL)
- ⚠️ HTTPS/SSL (implement in production)
- ⚠️ Environment variables (never commit secrets)
- ⚠️ Admin key rotation (use auth instead of API key)
- ⚠️ Sanitize user inputs (implement DOMPurify in React)
