# RocketWheel API Testing Guide

## Quick API Test Commands (PowerShell)

Save your token from login and use in subsequent requests.

### 1. Admin Login (Create Account)

```powershell
$body = @{
    email = "admin@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:4000/api/admin/login" `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body $body

$token = ($response.Content | ConvertFrom-Json).token
Write-Host "Admin Token: $token"
```

### 2. Vendor Register

```powershell
$body = @{
    name = "Pizza Palace"
    email = "vendor@example.com"
    password = "password123"
    category = "Restaurant"
    address = "123 Main St"
    phone = "9876543210"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:4000/api/vendor/register" `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body $body
```

### 3. Vendor Login

```powershell
$body = @{
    email = "vendor@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:4000/api/vendor/login" `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body $body

$vendorToken = ($response.Content | ConvertFrom-Json).token
$vendorId = ($response.Content | ConvertFrom-Json).vendor._id
Write-Host "Vendor Token: $vendorToken"
Write-Host "Vendor ID: $vendorId"
```

### 4. List All Vendors (Admin)

```powershell
$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

Invoke-WebRequest -Uri "http://localhost:4000/api/admin/vendors" `
  -Method GET `
  -Headers $headers | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

### 5. Approve Vendor (Admin)

```powershell
# Replace VENDOR_ID with actual ID
$vendorId = "64abc123def456ghi789jklmno"

$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

Invoke-WebRequest -Uri "http://localhost:4000/api/admin/vendors/$vendorId/approve" `
  -Method POST `
  -Headers $headers `
  -Body @{} | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

### 6. Add Delivery Boy (Admin)

```powershell
$body = @{
    name = "John (RocketWheel)"
    phone = "919999999999"
} | ConvertTo-Json

$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

Invoke-WebRequest -Uri "http://localhost:4000/api/admin/deliveryboys" `
  -Method POST `
  -Headers $headers `
  -Body $body | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

### 7. Set Central Delivery Number (Admin)

```powershell
$body = @{
    phone = "919999999999"
} | ConvertTo-Json

$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

Invoke-WebRequest -Uri "http://localhost:4000/api/admin/central-delivery" `
  -Method POST `
  -Headers $headers `
  -Body $body | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

### 8. Add Product (Vendor)

```powershell
# Save as UTF-8 file first
$body = @{
    name = "Margherita Pizza"
    price = 299
} | ConvertTo-Json

$headers = @{
    Authorization = "Bearer $vendorToken"
    "Content-Type" = "application/json"
}

Invoke-WebRequest -Uri "http://localhost:4000/api/vendor/$vendorId/products" `
  -Method POST `
  -Headers $headers `
  -Body $body | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

### 9. Get Vendor Products (Public)

```powershell
Invoke-WebRequest -Uri "http://localhost:4000/api/public/vendors/$vendorId" `
  -Method GET | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
```

### 10. Get All Vendors by Category (Public)

```powershell
Invoke-WebRequest -Uri "http://localhost:4000/api/public/vendors" `
  -Method GET | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
```

### 11. Place Order (Public)

```powershell
$body = @{
    vendorId = "VENDOR_ID_HERE"
    items = @(
        @{ product = "Margherita Pizza"; qty = 2; price = 299 },
        @{ product = "Garlic Bread"; qty = 1; price = 99 }
    )
    totalAmount = 697
    customerName = "John Doe"
    customerPhone = "9876543210"
    customerAddress = "456 Oak St"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:4000/api/public/orders" `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body $body | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

### 12. Get QR Code (Vendor-specific)

```powershell
Invoke-WebRequest -Uri "http://localhost:4000/api/public/qr/vendor/$vendorId" `
  -Method GET | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

### 13. Get Global QR Code

```powershell
Invoke-WebRequest -Uri "http://localhost:4000/api/public/qr/global" `
  -Method GET | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

## Using Postman (Alternative)

1. **Download Postman**: https://www.postman.com/downloads/
2. **Create Collection**: "RocketWheel"
3. **Set Variables**:
   - `base_url`: http://localhost:4000
   - `admin_token`: (from login response)
   - `vendor_token`: (from login response)
   - `vendor_id`: (from login response)

### Example Requests in Postman:

**Admin Login**
- Method: POST
- URL: `{{base_url}}/api/admin/login`
- Body (JSON):
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**List Vendors**
- Method: GET
- URL: `{{base_url}}/api/admin/vendors`
- Headers:
  - Authorization: `Bearer {{admin_token}}`

**Approve Vendor**
- Method: POST
- URL: `{{base_url}}/api/admin/vendors/{{vendor_id}}/approve`
- Headers:
  - Authorization: `Bearer {{admin_token}}`

**Add Product**
- Method: POST
- URL: `{{base_url}}/api/vendor/{{vendor_id}}/products`
- Headers:
  - Authorization: `Bearer {{vendor_token}}`
- Body (form-data):
  - name: "Margherita Pizza"
  - price: 299
  - image: (select file)

**Get Public Vendors**
- Method: GET
- URL: `{{base_url}}/api/public/vendors`

## Expected Responses

### Successful Login (Admin/Vendor)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "_id": "64abc123def456...",
    "email": "admin@example.com"
  }
}
```

### Approve Vendor Response
```json
{
  "success": true,
  "vendor": {
    "_id": "64abc123def456...",
    "name": "Pizza Palace",
    "approved": true,
    "qrDataUrl": "data:image/png;base64,iVBORw0KGgoAAAANS..."
  }
}
```

### Get Vendor Menu
```json
{
  "vendor": {
    "_id": "64abc123def456...",
    "name": "Pizza Palace",
    "category": "Restaurant",
    "address": "123 Main St",
    "assignedDeliveryPhone": "919999999999"
  },
  "products": [
    {
      "_id": "64xyz789abc...",
      "name": "Margherita Pizza",
      "price": 299,
      "imageUrl": "/uploads/products/abc123"
    }
  ],
  "banner": {
    "_id": "64banner...",
    "title": "RocketWheel Promo",
    "imageUrl": "/uploads/banners/xyz789"
  }
}
```

### Place Order Response
```json
{
  "success": true,
  "orderId": "RW-1697432456789-abc123def",
  "order": {
    "_id": "64order...",
    "orderId": "RW-1697432456789-abc123def",
    "vendor": "64vendor...",
    "items": [...],
    "totalAmount": 697,
    "customerName": "John Doe",
    "status": "pending",
    "createdAt": "2024-03-19T10:00:00Z"
  }
}
```

## File Upload Testing

### Product Image Upload (Vendor)
```powershell
$filePath = "C:\path\to\image.jpg"
$uri = "http://localhost:4000/api/vendor/$vendorId/products"
$headers = @{ Authorization = "Bearer $vendorToken" }
$form = @{
    name = "Margherita Pizza"
    price = "299"
    image = Get-Item -Path $filePath
}

Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -Form $form
```

### Excel Bulk Upload (Vendor)
```powershell
$filePath = "C:\path\to\products.xlsx"
$uri = "http://localhost:4000/api/vendor/$vendorId/products/upload-xlsx"
$headers = @{ Authorization = "Bearer $vendorToken" }
$form = @{
    file = Get-Item -Path $filePath
}

Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -Form $form
```

## Debugging Tips

1. **Check Backend Logs**: Look at terminal where `npm run dev` is running
2. **Check Network Tab**: Browser DevTools → Network → see requests/responses
3. **Validate JSON**: Use online JSON validator
4. **Check Token**: Ensure Authorization header uses format: `Bearer <token>`
5. **Check Permissions**: Admin routes require admin role, vendor routes require vendor role
6. **Check Database**: Use `mongosh` to inspect data directly

## Notes

- Replace `VENDOR_ID`, `ADMIN_TOKEN`, etc. with actual values
- All tokens expire after 7 days (change `expiresIn` in code if needed)
- WhatsApp phone numbers must be in format: `country_code + number` (e.g., 919999999999)
- Images are stored locally in `/uploads/`; use S3 or similar in production
