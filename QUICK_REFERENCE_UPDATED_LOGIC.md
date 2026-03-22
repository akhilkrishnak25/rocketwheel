# ⚡ QUICK REFERENCE - Updated Order Logic

**One-page summary of the new order system**

---

## 🎯 Core Rule

```
WhatsApp = RocketWheel Delivery ONLY ✅
WhatsApp ≠ Restaurant/Vendor ❌
```

---

## 👥 User Roles & Actions

### 🛍️ CUSTOMER
```
1. Browse vendors
2. Add items to cart
3. Click "Order via RocketWheel Delivery"
4. WhatsApp opens → Pre-filled order message
5. Send to RocketWheel Delivery
6. Receive order confirmation (Order ID: RW12345)
7. Delivery boy contacts via WhatsApp
```

### 🏪 RESTAURANT OWNER (Vendor)
```
❌ Does NOT receive WhatsApp orders
✅ Sees orders in vendor dashboard (optional)
✅ Prepares food when delivery boy arrives
✅ Hands over food to delivery boy
✅ Phone is for contact, NOT orders
```

### 🚴 DELIVERY BOY
```
1. Receives WhatsApp with order details
2. Goes to restaurant address
3. Tells restaurant staff about order (verbal)
4. Waits for food preparation
5. Picks up food
6. Delivers to customer address
7. Confirms delivery with customer
8. Marks order complete
```

### 👨‍💼 ADMIN
```
✅ Manages vendors
✅ Creates delivery boys
✅ Assigns delivery boys to vendors
✅ Monitors orders
✅ Handles cancellations
```

---

## 📱 WhatsApp Message

### WHO Receives:
```
PRIORITY 1: Assigned Delivery Boy Phone
PRIORITY 2: Central RocketWheel Number
❌ NEVER: Vendor/Restaurant Phone
```

### MESSAGE FORMAT:
```
Hello RocketWheel,

New Delivery Order:

Order ID: RW12345

Vendor: ABC Hotel

Items:
- Chicken Biryani x2 = ₹600
- Coke x1 = ₹50

Total Amount: ₹650

Pickup Location: ABC Hotel (Address)

Customer Name: Satya
Phone: 9876543210
Delivery Address: XYZ Street

Note: Restaurant is not notified. 
Please handle pickup and delivery.

Please confirm delivery.
```

---

## 🔁 Order Flow

```
Customer Order
    ↓
System Creates Order (Status: Pending)
    ↓
Generates Order ID (RW12345)
    ↓
Sends WhatsApp to Delivery Boy
    ├─ Has assigned delivery boy? → Send to delivery boy
    └─ No delivery boy? → Send to central number
    ↓
Delivery Boy Receives Message
    ↓
Goes to Restaurant (Address in message)
    ↓
Places Verbal Order (No system message)
    ↓
Restaurant Prepares Food
    ↓
Delivery Boy Picks Up
    ↓
Delivery Boy Delivers to Customer
    ↓
Order Marked Complete (Status: Completed)
```

---

## 🔌 API Endpoints

### Create Order
```
POST /api/orders/create

Request:
{
  "vendorId": "...",
  "customerName": "Satya",
  "customerPhone": "9876543210",
  "items": [
    {"id": "1", "name": "Biryani", "price": 300, "qty": 2}
  ],
  "total": 600,
  "address": "XYZ Street",
  "instructions": "Extra spicy"
}

Response:
{
  "success": true,
  "orderId": "RW12345",
  "deliveryPhone": "+923001234567",
  "message": "Order sent to RocketWheel Delivery"
}
```

---

## 🗄️ Database Fields

### Order Model (Keep/Add):
```
✅ vendorId - Which restaurant
✅ orderId - Order ID (RW12345 format)
✅ customerName - Who ordered
✅ customerPhone - Customer contact
✅ deliveryAddress - Where to deliver
✅ specialInstructions - Special requests
✅ items - Array of order items
✅ total - Order amount
✅ status - Order status (Pending/Confirmed/Completed)
✅ deliveryPhoneUsed - Which phone was used
✅ deliveryAssignedBoyId - Which delivery boy
✅ createdAt, updatedAt - Timestamps
```

### Vendor Model (Keep As Is):
```
✅ name - Restaurant name
✅ phone - For contact ONLY (NOT for orders)
✅ address - Restaurant location
✅ email - Contact email
❌ Remove from order routing logic
```

### DeliveryBoy Model (Keep As Is):
```
✅ name - Delivery boy name
✅ phone - Receives WhatsApp orders
✅ vendorAssignment - Linked vendors
✅ status - Active/Inactive
```

---

## ✅ Button Changes

### Old Version:
```html
<button>Place Order on WhatsApp</button>
```

### New Version:
```html
<button title="Order will be sent to RocketWheel Delivery">
  Order via RocketWheel Delivery
</button>
```

---

## 📊 Order Status Workflow

```
OLD: Pending → Completed

NEW: Pending → Confirmed → PickedUp → Completed

Transitions:
- Pending: Order just created
- Confirmed: Delivery boy confirmed receipt
- PickedUp: Delivery boy picked up from restaurant
- Completed: Delivery boy delivered to customer
- Cancelled: Order cancelled by customer/system
```

---

## 🎯 Phone Number Logic

```javascript
// CURRENT (❌ WRONG):
const phone = vendor.phone || deliveryBoy.phone || central;

// UPDATED (✅ CORRECT):
const phone = deliveryBoy.phone || central;
// ❌ Never vendor.phone

// Logic:
if (deliveryBoyAssigned) {
  // Use delivery boy phone
  sendWhatsApp(deliveryBoy.phone, order);
} else {
  // Use central number
  sendWhatsApp(process.env.CENTRAL_PHONE, order);
}
```

---

## 🔐 Validation Rules

```
✅ Must have customer name
✅ Must have customer phone
✅ Must have delivery address
✅ Must have at least 1 item
✅ Must have valid total
✅ Must have valid vendor ID

Phone Format:
✅ Valid format with country code
✅ Example: +923001234567
✅ Example: 9876543210 (can be converted)

❌ Empty phone
❌ Incomplete phone number
```

---

## 🚀 Implementation Steps

```
1. Update Frontend Button
   ├─ Change button text
   ├─ Update tooltip
   └─ Update success message

2. Update Message Formatting
   ├─ Add new template
   ├─ Include pickup location
   └─ Add restaurant not notified note

3. Update Phone Logic
   ├─ Remove vendor phone from routing
   ├─ Add delivery boy check
   └─ Use central as fallback only

4. Update Backend
   ├─ Update order creation endpoint
   ├─ Update phone routing logic
   └─ Update message formatting

5. Test
   ├─ Create test order
   ├─ Verify message sent to delivery
   ├─ Verify vendor NOT contacted
   └─ Verify system status

6. Deploy
   ├─ Update frontend
   ├─ Update backend
   └─ Monitor for issues
```

---

## ⚠️ Common Mistakes (Avoid!)

```
❌ Sending message to vendor phone
❌ Using vendor.phone in order routing
❌ Notifying vendor directly
❌ Not specifying pickup location
❌ Not including restaurant address in message
❌ Old button text "Place Order on WhatsApp"
❌ Forgetting to save delivery boy assignment

✅ Always check delivery boy assignment first
✅ Always fall back to central, NOT vendor
✅ Always include pickup location
✅ Always inform customer delivery boy will contact
```

---

## 🎓 Key Concepts

### Separation of Concerns:
```
Restaurant → Prepares food (no integration)
Delivery Boy → Handles orders and delivery
Customer → Places order, receives delivery
Admin → Manages system
```

### Order Flow:
```
NO VENDOR SYSTEM MESSAGE
Only delivery boy receives WhatsApp
Vendor communicates verbally with delivery boy
Clean separation between restaurant and delivery
```

### Phone Priority:
```
1. Is delivery boy assigned? → Use delivery boy
2. No delivery boy? → Use central
3. Never use vendor phone
```

---

## 📞 Contact Points

```
Customer ↔ Delivery Boy: WhatsApp (primary)
Admin ↔ System: Dashboard
Delivery Boy ↔ Restaurant: Verbal/In-person
Vendor ↔ Vendor Phone: Contact only
```

---

## ✨ Benefits Summary

### For Restaurants:
- No WhatsApp integration needed
- No system complexity
- Focus on food quality
- Delivery boy handles everything

### For Customers:
- Single point of contact (delivery boy)
- Clear order tracking
- Professional service
- Easy payment handling

### For Business:
- Scalable system
- Easy to add new restaurants
- Clear responsibility division
- Better order management

---

## 📋 Final Checklist

- [ ] Understand new order logic ✓
- [ ] Know who receives WhatsApp ✓
- [ ] Know restaurant's role ✓
- [ ] Know delivery boy's role ✓
- [ ] Know phone priority ✓
- [ ] Review button changes ✓
- [ ] Review message format ✓
- [ ] Ready for implementation ✓

---

## 🎯 Remember

```
🚀 RULE #1: WhatsApp ONLY to RocketWheel Delivery
🚀 RULE #2: NEVER send to restaurant/vendor phone
🚀 RULE #3: Delivery boy picks up verbally
🚀 RULE #4: Restaurant doesn't need system integration
🚀 RULE #5: Everything goes through delivery system
```

---

**Status:** ✅ Updated March 20, 2026  
**System:** RocketWheel v1.0  
**Implementation:** Ready for coding phase
