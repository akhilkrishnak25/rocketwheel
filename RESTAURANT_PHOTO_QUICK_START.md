# Restaurant Photo Feature - Quick Reference

## 🎯 What's New

Restaurants can now upload and display their photos:
- ✅ Upload in Dashboard → Restaurant tab
- ✅ Shows on restaurant listing page
- ✅ Shows on customer menu page

## 📱 For Restaurant Owners

### How to Upload Photo

1. Login to Dashboard
2. Click "🏪 Restaurant" tab
3. Scroll to "📸 Restaurant Photo"
4. Click "Choose File"
5. Select your restaurant photo
6. Click "🚀 Upload Photo"

### Photo Guidelines
- **Format**: JPG, PNG, GIF
- **Size**: Max 5MB
- **Dimensions**: 800x600px recommended
- **Quality**: Clear, well-lit photo

## 👨‍💻 For Developers

### Database Field
```javascript
// Vendor schema
photo: { type: String }  // e.g., "/uploads/vendors/filename.jpg"
```

### API Endpoint
```javascript
POST /api/vendor/:vendorId/photo
- Requires: Bearer token
- Body: multipart/form-data with "photo" field
- Returns: Updated vendor object
```

### Display Photo
```javascript
// React component
<img src={`${API}${vendor.photo}`} alt="Restaurant" />
```

## 📍 Where Photos Appear

1. **Vendors Page** (Restaurant Listing)
   - In card header (140px height)
   - Fallback: Blue gradient + fork emoji

2. **Menu Page** (Customer View)
   - Below banner (or top if no banner)
   - Full-width, 300px height
   - Shows restaurant image to customers

3. **Dashboard** (Vendor View)
   - Restaurant tab
   - Shows current photo if exists

## 🔧 Technical Details

### File Upload
- Storage: `/uploads/vendors/`
- Middleware: `multer` (file upload)
- Auth: `vendorAuth` (vendor-only access)

### File Path
```
/uploads/vendors/{generated-filename}.{extension}
```

### Response Example
```json
{
  "success": true,
  "vendor": {
    "_id": "...",
    "name": "Restaurant Name",
    "photo": "/uploads/vendors/1234567890-abc123.jpg",
    ...
  }
}
```

## 📋 Code Locations

| Feature | File | Lines |
|---------|------|-------|
| Photo field | `backend/src/models/Vendor.js` | 12 |
| Upload endpoint | `backend/src/routes/vendor.js` | 108-127 |
| Dashboard UI | `frontend/src/pages/VendorDashboard.jsx` | 459-540 |
| Card display | `frontend/src/pages/Vendors.jsx` | 275-295 |
| Menu display | `frontend/src/pages/VendorMenu.jsx` | 163-172 |

## ✨ Features

### Upload Section
- Photo preview (if exists)
- File input with image filter
- Upload button
- Helper text with guidelines
- Success/error messages

### Display Section
- Restaurant details (read-only)
- Name, category, address, phone
- Visual organization
- Professional styling

### Card Display
- Photo background on card header
- Overlay for contrast
- Smooth transitions
- Responsive design

## 🚀 Testing

### Quick Test
1. Login as vendor
2. Go to Dashboard → Restaurant tab
3. Select and upload a photo
4. Verify it shows in preview
5. Go to vendor listing - see photo in card
6. Click card to view menu - see photo at top

### API Test
```bash
curl -X POST http://localhost:4000/api/vendor/{id}/photo \
  -H "Authorization: Bearer {token}" \
  -F "photo=@image.jpg"
```

## 🐛 Common Issues

| Problem | Fix |
|---------|-----|
| Upload fails | Check file format, size, token |
| Photo not showing | Verify path in DB, API URL correct |
| Wrong dimensions | Use recommended 800x600px |
| Cache issue | Clear browser cache (Ctrl+Shift+Del) |

## 🔐 Security

- ✅ Authorization required
- ✅ Vendor can only upload their photo
- ✅ File type validation (images only)
- ✅ Secure storage (not in git)
- ✅ No sensitive data exposure

## 📊 File Structure

```
backend/
├── uploads/vendors/     (photo storage)
│   ├── 123-abc.jpg
│   ├── 456-def.png
│   └── ...
└── src/
    ├── models/Vendor.js (photo field)
    └── routes/vendor.js (photo endpoint)

frontend/src/pages/
├── VendorDashboard.jsx  (upload UI)
├── Vendors.jsx          (card display)
└── VendorMenu.jsx       (menu display)
```

## 💡 Tips

1. **Best Photos**
   - Well-lit front view of restaurant
   - Shows exterior/interior clearly
   - High quality, not blurry
   - Landscape orientation

2. **Avoid**
   - Food photos (use product photos instead)
   - People in photos (privacy)
   - Very small/large file sizes
   - Watermarked images

3. **Re-upload**
   - Upload new photo to replace old one
   - Old file still stored but not used
   - Can upload anytime

## 🎯 Success Criteria

Feature is working if:
- ✅ Vendors can upload photos
- ✅ Photos display on listing
- ✅ Photos display on menu
- ✅ Fallback works (no photo)
- ✅ No errors in console
- ✅ Photos persist after refresh

## 📞 Support

For issues:
1. Check file format (JPG, PNG, GIF)
2. Verify authorization token
3. Check browser console for errors
4. Verify uploads directory exists
5. Check server logs for errors

---

**Quick Start**: Dashboard → Restaurant Tab → Upload Photo ✨

