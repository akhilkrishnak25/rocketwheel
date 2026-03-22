# Restaurant Photo Feature - Visual Guide

## 📸 Where Photos Appear

### 1. Restaurant Listing Page (Vendors.jsx)

```
┌─────────────────────────────────┐
│                                 │
│    Restaurant Photo             │
│    (or Blue Gradient)           │
│                                 │
├─────────────────────────────────┤
│  Restaurant Name                │
│  📍 Address                      │
│  📞 Phone                        │
│  ✅ Approved Badge              │
│                                 │
│     [View Menu Button]          │
└─────────────────────────────────┘
```

**Features:**
- 140px height header
- Full-width card
- Hover animation (lift effect)
- Blue gradient fallback if no photo
- Restaurant info below photo

---

### 2. Customer Menu Page (VendorMenu.jsx)

```
┌───────────────────────────────────────┐
│  ← Back    Restaurant Name            │
├───────────────────────────────────────┤
│                                       │
│    Restaurant Photo                   │
│    (or Blue Gradient)                 │
│                                       │
├───────────────────────────────────────┤
│  Category | Address | Phone           │
├───────────────────────────────────────┤
│  📋 Our Menu                          │
│  [Product Cards...]                   │
└───────────────────────────────────────┘
```

**Features:**
- 300px height display
- Full-width, top of page
- Professional appearance
- Restaurant details below
- Products listed further down

---

### 3. Vendor Dashboard (VendorDashboard.jsx)

```
TABS: [📦 Products] [📤 Bulk] [📱 QR] [🏪 Restaurant]

When Restaurant Tab Selected:
┌───────────────────────────────────────┐
│  🏪 Restaurant Photo & Details        │
├───────────────────────────────────────┤
│                                       │
│  📸 Restaurant Photo                  │
│  ┌─────────────────────────────────┐ │
│  │   [Current Photo Preview]       │ │
│  └─────────────────────────────────┘ │
│                                       │
│  [Choose File] [🚀 Upload Photo]    │
│                                       │
├───────────────────────────────────────┤
│  📋 Details                           │
│  Name: [Restaurant Name - Read-only]  │
│  Category: [Category - Read-only]     │
│  Address: [Address - Read-only]       │
│  Phone: [Phone - Read-only]           │
│                                       │
│  ℹ️ To edit, contact admin           │
└───────────────────────────────────────┘
```

**Features:**
- Photo preview if exists
- File input for new photo
- Upload button
- Restaurant details display
- Read-only fields for safety
- Helper text

---

## 🚀 Upload Flow Diagram

```
Vendor Dashboard
    │
    ├─ Login with token
    │
    ├─ Click Restaurant Tab
    │
    ├─ Select Photo File
    │       │
    │       ├─ Browser file dialog
    │       ├─ Select JPG/PNG/GIF
    │       └─ File stored in state
    │
    ├─ Click Upload Button
    │
    ├─ Form submitted
    │       │
    │       └─ POST /api/vendor/:id/photo
    │           ├─ Verify token
    │           ├─ Check vendor ownership
    │           ├─ Validate file type
    │           ├─ Save to /uploads/vendors/
    │           └─ Update database
    │
    ├─ Success Response
    │       │
    │       ├─ Display success message
    │       ├─ Show photo preview
    │       └─ Update component state
    │
    └─ Photo now visible:
        ├─ Vendor listing cards
        ├─ Menu page header
        └─ Dashboard preview
```

---

## 🎨 UI Component Details

### Upload Form

```
┌────────────────────────────────────────┐
│         📸 Restaurant Photo            │
│                                        │
│  Current Photo:                        │
│  ┌──────────────────────────────────┐ │
│  │  [Photo Preview or "No Photo"]   │ │
│  │  Max 300x200px display size      │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ Upload New Photo                 │ │
│  ├──────────────────────────────────┤ │
│  │ [📁 Choose File] [🚀 Upload]    │ │
│  ├──────────────────────────────────┤ │
│  │ 💡 JPG, PNG, GIF. Max 5MB.      │ │
│  │    Recommended: 800x600px        │ │
│  └──────────────────────────────────┘ │
└────────────────────────────────────────┘
```

### Restaurant Details

```
┌────────────────────────────────────────┐
│          📋 Details                    │
│                                        │
│  Name                                  │
│  ┌──────────────────────────────────┐ │
│  │ Restaurant Name (Disabled)       │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Category                              │
│  ┌──────────────────────────────────┐ │
│  │ Italian (Disabled)               │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Address                               │
│  ┌──────────────────────────────────┐ │
│  │ 123 Main St (Disabled)           │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Phone                                 │
│  ┌──────────────────────────────────┐ │
│  │ 555-1234 (Disabled)              │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ℹ️ To edit name, category, or       │
│     other details, please contact     │
│     the admin.                         │
└────────────────────────────────────────┘
```

---

## 📱 Responsive Behavior

### Desktop (>992px)
```
Card Layout: Grid with 3-4 columns
Photo Height: 140px (cards), 300px (menu)
Layout: Full-width, max-container
Spacing: Generous, comfortable
```

### Tablet (600-992px)
```
Card Layout: Grid with 2-3 columns
Photo Height: 120px (cards), 250px (menu)
Layout: Full-width with padding
Spacing: Medium
```

### Mobile (<600px)
```
Card Layout: Single column, full-width
Photo Height: 100px (cards), 200px (menu)
Layout: Full-width, edge-to-edge
Spacing: Compact
```

---

## 🎯 Color Scheme

```
Primary Blue: #1E40AF
Light Blue: #EFF6FF
Success Green: #10B981
Error Red: #EF4444
Text Dark: #212529
Text Muted: #6c757d
Background: #F8FAFC
Card BG: White
Border: #CBD5E1
```

---

## 🔄 State Management

### VendorDashboard States

```javascript
State: vendorPhoto
├─ Initial: null
├─ On File Select: File object
├─ On Upload Success: null (cleared)
└─ Display: File preview

State: vendor
├─ Loaded from: GET /api/vendor/:id/info
├─ Contains: photo URL
└─ Updated on: Upload success

State: success/error
├─ On Upload: Display message
├─ Duration: Auto-dismiss (5s)
└─ Content: User-friendly text
```

---

## 🔐 Authorization Flow

```
User Action: Upload Photo
    │
    ├─ Token Check
    │   └─ Authorization header present?
    │       ├─ Yes → Continue
    │       └─ No → Error 401
    │
    ├─ Vendor Ownership Check
    │   └─ Token vendor ID = Request vendor ID?
    │       ├─ Yes → Continue
    │       └─ No → Error 403
    │
    ├─ File Validation
    │   └─ File exists and is image?
    │       ├─ Yes → Continue
    │       └─ No → Error 400
    │
    ├─ Save File
    │   └─ Write to /uploads/vendors/
    │       ├─ Success → Continue
    │       └─ Fail → Error 500
    │
    ├─ Update Database
    │   └─ Set vendor.photo = new_path
    │       ├─ Success → Return 200
    │       └─ Fail → Error 500
    │
    └─ Response
        ├─ Frontend: Display success
        ├─ Display: Show new photo
        └─ Navigation: Ready for next action
```

---

## 📊 File Storage Structure

```
backend/
└── uploads/
    ├── banners/
    │   ├── banner1.jpg
    │   └── banner2.png
    │
    ├── products/
    │   ├── product1.jpg
    │   ├── product2.png
    │   └── product3.gif
    │
    └── vendors/  ← Restaurant Photos Here
        ├── 1234567890-restaurant1.jpg
        ├── 1234567891-restaurant2.png
        ├── 1234567892-restaurant3.jpg
        └── ...
```

---

## 🔄 Update Cycle

```
Day 1: Vendor uploads photo
    │
    ├─ Photo saved to /uploads/vendors/
    ├─ Path stored in database
    │
    ├─ Customer sees it on listing
    ├─ Customer sees it on menu
    └─ Vendor sees preview

Day 2: Vendor uploads new photo
    │
    ├─ Old photo remains on disk (could be cleaned)
    ├─ Path in database updated
    │
    ├─ All pages show new photo
    ├─ Old file no longer referenced
    └─ Frontend caches invalidated
```

---

## 💡 Key Design Decisions

| Decision | Reason |
|----------|--------|
| Single photo per vendor | Simple UX, focused presentation |
| Fallback gradient | Professional look without photo |
| 140px card height | Balance visibility and layout |
| 300px menu height | Good visibility for customers |
| Read-only details | Prevent accidental changes |
| Success messages | Confirm action completion |
| File type validation | Security, prevent bad files |
| Responsive design | Mobile-first approach |
| No image optimization | Handled by future enhancement |
| Relative paths in DB | Easy server migration |

---

## ✨ Visual Hierarchy

```
Dashboard View:
1. Header (Restaurant name, logout)
2. Tabs (Products, Bulk, QR, Restaurant)
3. Restaurant Photo Section (Large)
4. Restaurant Details Section (Below)

Listing View:
1. Search bar
2. Category header
3. Restaurant cards (Photo prominent)
4. Card info below photo

Menu View:
1. Header with back button
2. Restaurant photo (Large)
3. Restaurant info
4. Product list
5. Cart sidebar
```

---

## 🎯 Summary

The restaurant photo feature provides:
- ✅ Professional appearance
- ✅ Easy vendor management
- ✅ Enhanced customer experience
- ✅ Responsive design
- ✅ Graceful fallbacks
- ✅ Clear visual hierarchy
- ✅ Secure implementation
- ✅ Smooth user flow

**Ready for deployment!** 🚀

