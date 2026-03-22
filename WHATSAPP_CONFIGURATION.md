# WhatsApp Configuration Guide

## Overview
The RocketWheel app requires valid WhatsApp numbers for the order flow. Numbers must be in international format: `country_code + phone_number` (e.g., `919876543210` for India).

## WhatsApp Number Priority

The app follows this priority order for WhatsApp numbers:

1. **Vendor's Assigned Delivery Phone** (`assignedDeliveryPhone` in vendor document)
   - Used when delivery person is assigned to a vendor
   - Set in Vendor Dashboard or Admin Panel

2. **Vendor's Own Phone** (`phone` field in vendor document)
   - Used if no delivery person is assigned
   - Set during vendor registration or in Vendor Dashboard

3. **Central RocketWheel Phone** (fallback)
   - Used only if vendor has no phone numbers set
   - Configured via `CENTRAL_ROCKETWHEEL_PHONE` environment variable

## Configuration Steps

### 1. Backend Configuration

Edit `backend/.env`:

```properties
# Use the actual business WhatsApp number
CENTRAL_ROCKETWHEEL_PHONE=919876543210
```

**Important**: Replace `919876543210` with your actual WhatsApp number.

### 2. Frontend Configuration

Edit `frontend/.env.local`:

```env
REACT_APP_API_URL=http://localhost:4000
REACT_APP_CENTRAL_PHONE=919876543210
```

**Important**: Replace `919876543210` with your actual WhatsApp number (same as backend).

### 3. Vendor Setup

In the **Admin Dashboard**:

1. Navigate to **Manage Vendors**
2. Select a vendor to edit
3. Ensure the vendor has a phone number set
4. (Optional) If using delivery partners, assign a delivery person with their WhatsApp number

In the **Vendor Dashboard**:

1. Vendor can update their own phone number
2. View assigned delivery phone if a delivery partner is assigned

## Testing WhatsApp Number Configuration

### Test with Valid Number Format

Valid WhatsApp number formats:
- India: `91` + 10-digit number (e.g., `919876543210`)
- US: `1` + 10-digit number (e.g., `12025551234`)
- UK: `44` + 9-10 digit number (e.g., `442071234567`)

### Verify WhatsApp Access

To verify a number is valid:

1. Manually open: `https://api.whatsapp.com/send?phone=919876543210&text=test`
2. If WhatsApp Web opens, the number is valid
3. If error, the number format is incorrect or not WhatsApp-enabled

### Example Testing Flow

1. Create a vendor with phone: `919876543210`
2. Place an order through the menu
3. Verify WhatsApp Web opens with correct number
4. Check order message is properly formatted

## Troubleshooting

| Issue | Solution |
|-------|----------|
| WhatsApp doesn't open | Verify number format (country code + digits, no spaces/dashes) |
| Wrong number in order | Check vendor `phone` and `assignedDeliveryPhone` in database |
| Hardcoded 919999999999 used | Update `.env` files and ensure vendor has valid phone |
| Order not sent to WhatsApp | Validate number is WhatsApp-enabled and in correct format |

## Security Notes

- ⚠️ **Never hardcode phone numbers** in code (except for testing)
- Store all WhatsApp numbers in:
  - Environment variables (backend/frontend `.env` files)
  - Vendor database records
- Use proper access controls in Admin Dashboard
- Log all order WhatsApp integrations for audit trail

## Production Deployment

Before going to production:

1. ✅ Update `CENTRAL_ROCKETWHEEL_PHONE` with real business number
2. ✅ Update `REACT_APP_CENTRAL_PHONE` in frontend
3. ✅ Test with actual vendor numbers
4. ✅ Verify all vendors have valid phone numbers
5. ✅ Set proper error handling for missing numbers
6. ✅ Document all WhatsApp numbers used

## Architecture

```
Order Placement Flow:
├── Customer places order
├── App determines WhatsApp number:
│   ├── 1st try: vendor.assignedDeliveryPhone
│   ├── 2nd try: vendor.phone
│   └── 3rd try: REACT_APP_CENTRAL_PHONE (from .env)
├── Validate number exists
├── Build order message
├── Open WhatsApp Web link with number
└── Customer confirms order
```

## Related Files

- `frontend/src/pages/VendorMenu.jsx` - WhatsApp number selection logic
- `backend/.env` - Central phone configuration
- `frontend/.env.local` - Frontend central phone configuration
- `backend/src/models/Vendor.js` - Vendor schema with phone fields
- `frontend/src/pages/AdminDashboard.jsx` - Admin vendor management

