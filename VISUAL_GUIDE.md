# 🎨 RocketWheel - Visual Guide & User Flows

## 📱 User Interface Layouts

### 1. Customer Discovery Page
```
┌─────────────────────────────────────────────┐
│  RocketWheel Vendors                        │
│  [Vendor Login] [Admin Login]               │
├─────────────────────────────────────────────┤
│                                             │
│  RESTAURANTS                                │
│  ┌──────────┬──────────┬──────────┐        │
│  │ Pizza    │ Biryani  │ Fast     │        │
│  │ Palace   │ House    │ Food     │        │
│  │ [Menu]   │ [Menu]   │ [Menu]   │        │
│  └──────────┴──────────┴──────────┘        │
│                                             │
│  GROCERY                                    │
│  ┌──────────┬──────────┬──────────┐        │
│  │ Fresh    │ Organic  │ Mart     │        │
│  │ Store    │ World    │ Plus     │        │
│  │ [Menu]   │ [Menu]   │ [Menu]   │        │
│  └──────────┴──────────┴──────────┘        │
│                                             │
└─────────────────────────────────────────────┘
```

### 2. Vendor Menu Page (Customer View)
```
┌─────────────────────────────────────────────┐
│ [RocketWheel Banner Image]                  │
├─────────────────────────────────────────────┤
│ Pizza Palace | Restaurant | 123 Main St     │
├─────────────────────────────────────────────┤
│ MENU                                  │CART │
│                                      │────│
│ [Margherita Pizza]  ₹299 [ADD]      │ 2× │
│ [Pepperoni Pizza]   ₹349 [ADD]      │ 1× │
│ [Garlic Bread]      ₹99  [ADD]      │ 1× │
│ [Coke 250ml]        ₹49  [ADD]      │────│
│ [Fanta 250ml]       ₹49  [ADD]      │TOT:│
│                                      │₹737 │
│                                      │────│
│                                      │[Name]
│                                      │[Phone]
│                                      │[Address]
│                                      │[ORDER]
│                                      └────
```

### 3. Admin Dashboard
```
┌─────────────────────────────────────────────┐
│  Admin Dashboard        [LOGOUT]            │
├──────────┬──────────┬───────────┬─────────┤
│ Vendors  │ Delivery │  Banner   │ Central │
│          │  Boys    │           │ Number  │
├─────────────────────────────────────────────┤
│ VENDORS                                     │
│ ┌───────────────────────────────────────┐   │
│ │ Pizza Palace | PENDING | [APPROVE]    │   │
│ │ [REJECT]                              │   │
│ ├───────────────────────────────────────┤   │
│ │ Burger Hut   | APPROVED | [DISABLE]   │   │
│ └───────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

### 4. Vendor Dashboard
```
┌─────────────────────────────────────────────┐
│  Pizza Palace Dashboard     [LOGOUT]        │
│  Restaurant | 123 Main St                   │
├──────────┬──────────┬─────────┤
│ Products │ Bulk     │   QR    │
│          │ Upload   │  Code   │
├─────────────────────────────────────────────┤
│ ADD PRODUCT                                 │
│ [Name] [Price] [Image] [ADD]               │
│                                             │
│ YOUR PRODUCTS                               │
│ ┌────────────────────────────────────────┐  │
│ │ Margherita Pizza | ₹299 | [Image]      │  │
│ │ Garlic Bread     | ₹99  | [Image]      │  │
│ │ Coke 250ml       | ₹49  | No image     │  │
│ └────────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🔄 User Flow Diagrams

### Customer Ordering Flow
```
START
  ↓
OPEN APP → http://localhost:3000
  ↓
CHOOSE METHOD
  ├─ SCAN VENDOR QR → /menu/{vendorId}
  │  └─ See that vendor's menu
  │
  └─ SCAN GLOBAL QR → /vendors
     └─ Browse all vendors by category
       └─ Click vendor → /menu/{vendorId}
        └─ See that vendor's menu
  ↓
BROWSE PRODUCTS
  ├─ View vendor info (name, address, category)
  ├─ See promotional banner (if set)
  └─ See all products with prices
  ↓
ADD TO CART
  ├─ Click [ADD TO CART] on products
  ├─ Quantities accumulate in right panel
  └─ Cart shows: items, qty, subtotals
  ↓
CHECKOUT
  ├─ Enter: Name, Phone, Address
  └─ Click [ORDER VIA ROCKETWHEEL]
  ↓
WHATSAPP
  ├─ Pre-filled message opens
  ├─ Message includes: Order ID, vendor, items, total, address
  └─ Customer sends to delivery boy
  ↓
END
```

### Vendor Setup Flow
```
START
  ↓
REGISTER → /vendor/login → "Register" tab
  ├─ Fill: Name, Email, Password, Category, Address, Phone
  └─ Status: PENDING APPROVAL
  ↓
WAIT FOR ADMIN → Admin approves in dashboard
  └─ Status: APPROVED → QR generated
  ↓
LOGIN → /vendor/login → "Login" tab
  ├─ Email, Password
  └─ Vendor Dashboard opens
  ↓
ADD PRODUCTS
  ├─ One-by-one: Tab "Products" → Add Product → Fill form
  │  └─ Name, Price, Optional Image
  │
  └─ Bulk Upload: Tab "Bulk Upload" → Upload Excel
     └─ Excel format: name, price columns
  ↓
DOWNLOAD QR CODE → Tab "QR Code" → [Download QR Code]
  ├─ Save PNG file
  └─ Print & display in shop
  ↓
CUSTOMERS SCAN → See your menu & order
  ↓
END
```

### Admin Management Flow
```
START
  ↓
LOGIN → /admin/login → any email/password
  └─ Auto-creates admin account on first login
  ↓
APPROVE VENDORS
  ├─ Tab: Vendors
  ├─ See pending vendors
  ├─ Click [APPROVE] → QR auto-generated
  └─ Vendor gets email confirmation (optional)
  ↓
ADD DELIVERY BOYS
  ├─ Tab: Delivery Boys
  ├─ Fill: Name, WhatsApp Phone
  └─ [ADD]
  ↓
ASSIGN DELIVERY → Each vendor gets a delivery boy
  ├─ Vendors with assigned boy → Orders to that boy's phone
  └─ Vendors without assignment → Orders to central number
  ↓
UPLOAD BANNER
  ├─ Tab: Banner
  ├─ Upload promotional image
  └─ Appears on all vendor menu pages
  ↓
SET CENTRAL NUMBER
  ├─ Tab: Central Number
  ├─ Enter RocketWheel WhatsApp number
  └─ Used for vendors without assigned delivery boy
  ↓
MONITOR ORDERS
  ├─ View all customer orders in database
  ├─ See order status: pending, confirmed, on-way, delivered
  └─ Track vendor performance
  ↓
END
```

---

## 🗂️ Page Navigation Map

```
                   ┌─ /admin/login
                   │
                   └─ /admin/dashboard
                      ├─ Vendors (Approve/Reject)
                      ├─ Delivery Boys (Add/Assign)
                      ├─ Banners (Upload)
                      └─ Central Number (Set)
                   
                   ┌─ /vendor/login
                   │  ├─ Login tab
                   │  └─ Register tab
                   │
                   └─ /vendor/dashboard
                      ├─ Products (CRUD)
                      ├─ Bulk Upload (Excel)
                      └─ QR Code (Download)

    ┌──────────────────────────────────────┐
    │     http://localhost:3000            │
    ├──────────────────────────────────────┤
    │                                      │
    │ / → Vendors page (Discovery)        │
    │ /vendors → Same as /                │
    │ /menu/:vendorId → Menu + Cart       │
    │ /vendor/login → Vendor Auth         │
    │ /vendor/dashboard → Vendor Panel    │
    │ /admin/login → Admin Auth           │
    │ /admin/dashboard → Admin Panel      │
    │                                      │
    └──────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
┌──────────────────┐
│    CUSTOMER      │
│   (No Account)   │
└────────┬─────────┘
         │
         ├─ Scan QR / Browse
         │
         ▼
    ┌─────────────────────────────────────┐
    │   FRONTEND (React)                  │
    ├─ Vendors.jsx (Discovery)           │
    ├─ VendorMenu.jsx (Menu + Cart)      │
    └─────────────────────────────────────┘
         │
         ├─ Axios HTTP Requests
         │
         ▼
    ┌─────────────────────────────────────┐
    │   BACKEND API (Express)             │
    ├─ /api/public/vendors               │
    ├─ /api/public/vendors/{id}          │
    ├─ /api/public/orders                │
    └─────────────────────────────────────┘
         │
         ▼
    ┌─────────────────────────────────────┐
    │   DATABASE (MongoDB)                │
    ├─ vendors collection                │
    ├─ products collection               │
    ├─ orders collection                 │
    └─────────────────────────────────────┘
         │
         ▼
    ┌─────────────────────────────────────┐
    │   WhatsApp API                      │
    ├─ Send order message                │
    ├─ Delivery boy receives             │
    └─────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
USER
  │
  ├─ LOGIN
  │  └─ POST /api/admin/login (or /api/vendor/login)
  │     │
  │     ├─ Verify email & password (bcryptjs)
  │     └─ Generate JWT token
  │
  ▼
TOKEN
  ├─ Stored in localStorage
  └─ Added to all API requests
     Authorization: Bearer {token}
       │
       ▼
  PROTECTED ROUTE
    ├─ Middleware verifies token
    ├─ Extracts user info
    ├─ Checks role (admin/vendor)
    └─ Allows/denies access
       │
       ├─ Allowed → Execute API
       └─ Denied → 403 Forbidden
```

---

## 🎯 Component Tree (React)

```
App
├─ Router
│  ├─ /
│  │  └─ Vendors (Discovery page)
│  │     └─ [Vendor Cards]
│  │
│  ├─ /menu/{vendorId}
│  │  └─ VendorMenu
│  │     ├─ [Banner Image]
│  │     ├─ [Product List]
│  │     └─ [Cart Panel]
│  │
│  ├─ /admin/login
│  │  └─ AdminLogin
│  │
│  ├─ /admin/dashboard
│  │  └─ AdminDashboard
│  │     ├─ [Vendors Tab]
│  │     ├─ [Delivery Boys Tab]
│  │     ├─ [Banner Tab]
│  │     └─ [Central Number Tab]
│  │
│  ├─ /vendor/login
│  │  └─ VendorLogin
│  │     ├─ [Login Tab]
│  │     └─ [Register Tab]
│  │
│  └─ /vendor/dashboard
│     └─ VendorDashboard
│        ├─ [Products Tab]
│        ├─ [Bulk Upload Tab]
│        └─ [QR Code Tab]
```

---

## 🔄 State Management (localStorage)

```
CLIENT (localStorage)
├─ adminToken → JWT from admin login
├─ vendorToken → JWT from vendor login
└─ vendorId → Vendor's MongoDB ObjectId

SERVER
├─ MongoDB collections
│  ├─ admin documents
│  ├─ vendor documents
│  ├─ product documents
│  ├─ order documents
│  ├─ deliveryboy documents
│  └─ banner documents
└─ File storage
   ├─ /uploads/products/
   └─ /uploads/banners/
```

---

## 📈 Request-Response Cycle

```
CUSTOMER ORDER
┌──────────────────────┐
│  Customer enters:    │
│  - Products & qty    │
│  - Name, phone, addr │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Frontend builds:    │
│  - Order object      │
│  - Encoded message   │
└──────┬───────────────┘
       │
       ├─ POST /api/public/orders
       │  {
       │    vendorId,
       │    items: [{...}],
       │    totalAmount,
       │    customerName,
       │    customerPhone,
       │    customerAddress
       │  }
       │
       ▼
┌──────────────────────┐
│  Backend:            │
│  - Validates data    │
│  - Creates Order doc │
│  - Saves to MongoDB  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Response:           │
│  {                   │
│    success: true,    │
│    orderId: "RW-..." │
│  }                   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Frontend:           │
│  - Opens WhatsApp    │
│  - Pre-fills message │
│  - Includes order ID │
└──────────────────────┘
```

---

## 🎨 Color Scheme (Bootstrap)

```
PRIMARY (Blue)      → Buttons, Links, Active states
SUCCESS (Green)     → Approve, Add, Success messages
DANGER (Red)        → Reject, Delete, Error messages
WARNING (Yellow)    → Alerts, Warnings, Updates
INFO (Light Blue)   → Information, Help text
DARK (Black)        → Text, Backgrounds
LIGHT (Gray)        → Backgrounds, Borders
```

---

## 📱 Responsive Breakpoints

```
Mobile (xs)     < 576px   → Single column
Tablet (sm)     576-768px → 2 columns
Laptop (md)     768-992px → 3 columns
Desktop (lg)    992-1200px → 4 columns
Large (xl)      > 1200px  → 4+ columns
```

---

## ✨ Visual Summary

🎯 **Simple, Clean Interface**
- Customer: Browse → Add → Order
- Vendor: Register → Add Products → Share QR
- Admin: Approve → Manage → Monitor

📱 **Mobile Responsive**
- Works on phones, tablets, laptops
- Touch-friendly buttons
- Bootstrap responsive grid

🎨 **Consistent Design**
- Bootstrap components
- Color-coded actions
- Clear typography

🚀 **Fast & Snappy**
- React component loading
- Smooth transitions
- Instant cart updates
