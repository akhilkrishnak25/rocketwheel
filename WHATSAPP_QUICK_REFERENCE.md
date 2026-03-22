# WhatsApp Integration - Quick Reference

## Current Implementation

### WhatsApp Number Flow
```
Customer Places Order
    ↓
VendorMenu.jsx loads vendor data via useEffect
    ↓
WhatsApp number selected (priority: delivery phone > vendor phone > central phone)
    ↓
Stored in `whatsappNumber` state
    ↓
User clicks "Order Now via WhatsApp"
    ↓
placeOrder() validates whatsappNumber exists
    ↓
Order saved to database
    ↓
WhatsApp Web link opened with order message
    ↓
✅ Order flow complete
```

## Key Components

### 1. WhatsApp Number Selection (useEffect)
```javascript
const selectedPhone = res.data.vendor?.assignedDeliveryPhone 
                    || res.data.vendor?.phone 
                    || process.env.REACT_APP_CENTRAL_PHONE;
```
**Location:** `frontend/src/pages/VendorMenu.jsx:17-35`

### 2. Order Validation
```javascript
if (!whatsappNumber) {
  alert('Unable to place order: No valid WhatsApp number available.');
  return;
}
```
**Location:** `frontend/src/pages/VendorMenu.jsx:71-76`

### 3. WhatsApp Link Generation
```javascript
const phone = whatsappNumber || process.env.REACT_APP_CENTRAL_PHONE;
const link = `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`;
window.open(link, '_blank');
```
**Location:** `frontend/src/pages/VendorMenu.jsx:91-94`

## Configuration

### Environment Variables
```env
# backend/.env
CENTRAL_ROCKETWHEEL_PHONE=919876543210

# frontend/.env.local
REACT_APP_CENTRAL_PHONE=919876543210
```

### Database (Vendor Document)
```javascript
{
  _id: ObjectId,
  name: "Restaurant Name",
  phone: "919876543210",        // Vendor's WhatsApp number
  assignedDeliveryPhone: "919999999999", // Delivery person's WhatsApp (optional)
  // ... other fields
}
```

## Phone Number Format

Valid formats:
- **India (91)**: `919876543210` (country code + 10 digits, no spaces/dashes)
- **US (1)**: `12025551234` (country code + 10 digits)
- **UK (44)**: `442071234567` (country code + 9-10 digits)

Invalid formats (will not work):
- `+91 98765 43210` (contains spaces)
- `91-98765-43210` (contains dashes)
- `919876543210-` (extra characters)
- `(91) 98765 43210` (contains parentheses)

## Testing

### Manual Test
```
1. Open: https://api.whatsapp.com/send?phone=919876543210&text=test
2. If WhatsApp Web opens → number is valid
3. If error → number format is wrong
```

### App Test Flow
```
1. Ensure vendor has valid phone number
2. Add items to cart
3. Fill customer details
4. Click "Order Now via WhatsApp"
5. Verify WhatsApp Web opens with order message
6. Check phone number is correct in WhatsApp chat
```

## Troubleshooting

| Symptom | Check |
|---------|-------|
| WhatsApp doesn't open | Phone format (no spaces/dashes), number is WhatsApp-enabled |
| Wrong number in order | Vendor `phone` field, `assignedDeliveryPhone` field |
| "No valid WhatsApp" error | Vendor has no phone, central phone not configured |
| Order goes to placeholder | Check `.env` files for hardcoded numbers |

## Related Files

| File | Purpose |
|------|---------|
| `frontend/src/pages/VendorMenu.jsx` | WhatsApp number selection & order flow |
| `frontend/.env.local` | Central WhatsApp number for frontend |
| `backend/.env` | Central WhatsApp number for backend |
| `backend/src/models/Vendor.js` | Vendor schema with phone fields |
| `frontend/src/pages/AdminDashboard.jsx` | Admin vendor management |

## Admin Panel Setup

To set vendor WhatsApp numbers:

1. **Admin Dashboard** → **Manage Vendors** → **Edit Vendor**
2. Update "Phone" field with vendor's WhatsApp number
3. (Optional) Assign delivery partner with their WhatsApp number
4. Click Save

## Database Update (if needed)

Update existing vendors with valid WhatsApp numbers:

```javascript
db.vendors.updateMany(
  { phone: { $in: [null, "", "919999999999"] } },
  { $set: { phone: "919876543210" } }
)
```

## Security Notes

⚠️ **DO NOT:**
- Hardcode WhatsApp numbers in source code
- Commit `.env` files with real numbers to git
- Use placeholder numbers in production
- Share business WhatsApp numbers in logs

✅ **DO:**
- Use environment variables for all phone numbers
- Store numbers in secure `.env` files
- Use real validated numbers in production
- Log order integrations securely with numbers masked

## Performance Considerations

- WhatsApp number is fetched once when vendor page loads
- Stored in state to avoid recalculation
- No additional API calls for number selection
- Instant WhatsApp Web opening (no server-side processing)

