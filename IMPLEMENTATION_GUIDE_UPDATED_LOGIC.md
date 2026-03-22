# 💻 IMPLEMENTATION GUIDE - Updated Order Logic

**For Developers:** Complete guide to implementing the new order logic

---

## 🎯 Overview

The RocketWheel system now uses a **Delivery Boy Pickup Model** instead of **Direct Vendor Order Model**.

### What Changed:
- ❌ Orders NO LONGER sent to vendor WhatsApp
- ✅ Orders sent ONLY to delivery boys (or central team)
- ✅ Delivery boys pick up from restaurant (not pre-notified)
- ✅ Restaurants see orders in vendor dashboard (optional)

---

## 📁 Files to Modify

### Frontend Files:
```
frontend/src/pages/VendorMenu.jsx
  - Update button text and logic
  - Update message formatting
  - Update phone number logic

frontend/src/pages/VendorDashboard.jsx
  - Update profile tab text
  - Add clarification about phone usage

frontend/src/pages/AdminDashboard.jsx
  - Update delivery boy assignment UI
  - Add clarification text
```

### Backend Files:
```
backend/src/routes/public.js
  - Update order creation endpoint
  - Update phone number logic
  - Update WhatsApp message formatting

backend/src/models/Order.js
  - Add/update status fields
  - Add delivery boy tracking

backend/src/models/DeliveryBoy.js
  - Ensure vendor assignment field exists
```

---

## 🔧 Implementation Steps

### Step 1: Update Frontend Button

**File:** `frontend/src/pages/VendorMenu.jsx`

**Change:**
```javascript
// OLD CODE:
<button onClick={handlePlaceOrderWhatsApp}>
  Place Order on WhatsApp
</button>

// NEW CODE:
<button onClick={handlePlaceOrderRocketWheel}>
  Order via RocketWheel Delivery
</button>

// Add tooltip:
<Tooltip title="Order will be sent to RocketWheel Delivery System">
  <button>...</button>
</Tooltip>
```

---

### Step 2: Update Phone Number Logic

**File:** `frontend/src/pages/VendorMenu.jsx`

**Change:**
```javascript
// OLD CODE:
const getPhoneNumber = () => {
  // Check vendor phone
  if (vendor.phone) return vendor.phone;
  // Check delivery boy
  if (deliveryBoy?.phone) return deliveryBoy.phone;
  // Central number
  return process.env.REACT_APP_CENTRAL_PHONE;
};

// NEW CODE:
const getPhoneNumber = () => {
  // PRIORITY 1: Assigned delivery boy
  if (deliveryBoy?.phone) return deliveryBoy.phone;
  // PRIORITY 2: Central number only
  return process.env.REACT_APP_CENTRAL_PHONE;
  
  // ❌ NEVER use vendor.phone
};
```

---

### Step 3: Update Message Formatting

**File:** `frontend/src/pages/VendorMenu.jsx`

**Change:**
```javascript
// OLD CODE:
const formatOrderMessage = () => {
  const message = `
Order ID: ${orderId}
Vendor: ${vendor.name}
Items: ${items.map(i => `${i.name} x${i.qty}`).join('\n')}
Total: ₹${total}
Address: ${deliveryAddress}
Special: ${instructions}
Phone: ${customerPhone}
  `;
  return encodeURIComponent(message);
};

// NEW CODE:
const formatOrderMessage = () => {
  // Format items with prices
  const itemsList = items
    .map(item => `- ${item.name} x${item.qty} = ₹${item.price} x ${item.qty} = ₹${item.price * item.qty}`)
    .join('\n');

  const message = `Hello RocketWheel,

New Delivery Order:

Order ID: ${orderId}

Vendor: ${vendor.name}

Items:
${itemsList}

Total Amount: ₹${total}

Pickup Location: ${vendor.name} (${vendor.address})

Customer Name: ${customerName}
Phone: ${customerPhone}
Delivery Address: ${deliveryAddress}

Note: Restaurant is not notified. Please handle pickup and delivery.

Please confirm delivery.`;

  return encodeURIComponent(message);
};
```

---

### Step 4: Update Success Message

**File:** `frontend/src/pages/VendorMenu.jsx`

**Change:**
```javascript
// OLD CODE:
toast.success(`Order sent to WhatsApp! Order ID: ${orderId}`);

// NEW CODE:
toast.success(`Order sent to RocketWheel Delivery! Order ID: ${orderId}`);

// Update confirmation screen text:
<div className="order-confirmation">
  <h3>✅ Order Confirmed!</h3>
  <p>Order ID: <strong>{orderId}</strong></p>
  <p>Your order has been sent to RocketWheel Delivery</p>
  <p>Delivery boy will contact you shortly</p>
  <p>Est. Delivery: 30-40 minutes</p>
</div>
```

---

### Step 5: Update Backend Order Creation

**File:** `backend/src/routes/public.js`

**Change:**
```javascript
// OLD CODE:
router.post('/orders/create', async (req, res) => {
  const { vendorId, items, total, address, phone, instructions } = req.body;
  
  // Get vendor with phone
  const vendor = await Vendor.findById(vendorId);
  const phoneNumber = vendor.phone || process.env.CENTRAL_PHONE;
  
  // Send to vendor
  sendWhatsAppToVendor(phoneNumber, message);
});

// NEW CODE:
router.post('/orders/create', async (req, res) => {
  const { vendorId, items, total, address, phone, instructions, customerName } = req.body;
  
  try {
    // Create order
    const order = new Order({
      vendorId,
      items,
      total,
      deliveryAddress: address,
      customerPhone: phone,
      customerName,
      specialInstructions: instructions,
      status: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await order.save();
    const orderId = order._id.toString().slice(-5).toUpperCase();
    order.orderId = `RW${orderId}`;
    await order.save();
    
    // Get vendor info
    const vendor = await Vendor.findById(vendorId);
    
    // Get delivery boy if assigned
    let deliveryPhone = null;
    const deliveryBoyAssignment = await DeliveryBoyAssignment.findOne({ 
      vendorId: vendorId 
    });
    
    if (deliveryBoyAssignment) {
      // Has delivery boy assigned
      const deliveryBoy = await DeliveryBoy.findById(deliveryBoyAssignment.deliveryBoyId);
      deliveryPhone = deliveryBoy.phone;
    } else {
      // Use central number
      deliveryPhone = process.env.CENTRAL_PHONE;
    }
    
    // Format message
    const itemsList = items
      .map(item => `- ${item.name} x${item.qty} = ₹${item.price} x ${item.qty} = ₹${item.price * item.qty}`)
      .join('\n');
    
    const message = `Hello RocketWheel,

New Delivery Order:

Order ID: ${order.orderId}

Vendor: ${vendor.name}

Items:
${itemsList}

Total Amount: ₹${total}

Pickup Location: ${vendor.name} (${vendor.address})

Customer Name: ${customerName}
Phone: ${phone}
Delivery Address: ${address}

Note: Restaurant is not notified. Please handle pickup and delivery.

Please confirm delivery.`;

    // Send WhatsApp ONLY to delivery
    sendWhatsAppMessage(deliveryPhone, message);
    
    // Update order with delivery info
    order.deliveryPhoneUsed = deliveryPhone;
    order.deliveryAssigned = deliveryBoyAssignment ? deliveryBoyAssignment.deliveryBoyId : null;
    await order.save();
    
    res.json({ 
      success: true, 
      orderId: order.orderId,
      deliveryPhone: deliveryPhone,
      message: 'Order sent to RocketWheel Delivery'
    });
    
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});
```

---

### Step 6: Update Order Model

**File:** `backend/src/models/Order.js`

**Change:**
```javascript
// Add/update fields:
const orderSchema = new Schema({
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  items: [
    {
      id: String,
      name: String,
      price: Number,
      qty: Number
    }
  ],
  total: { type: Number, required: true },
  orderId: { type: String, unique: true }, // Format: RW12345
  customerName: String,
  customerPhone: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  specialInstructions: String,
  
  // Delivery tracking
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'PickedUp', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  deliveryPhoneUsed: String, // Which phone received the order
  deliveryAssigned: { type: Schema.Types.ObjectId, ref: 'DeliveryBoy' }, // Which delivery boy
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  completedAt: Date
});

module.exports = mongoose.model('Order', orderSchema);
```

---

### Step 7: Vendor Profile Clarification

**File:** `frontend/src/pages/VendorDashboard.jsx`

**Update Profile Tab:**
```javascript
// Add clarification text:
<div className="profile-section">
  <h4>Restaurant Phone: {vendor.phone}</h4>
  <p className="text-muted">
    ℹ️ Your phone number is for vendor contact and support only.
    <br/>
    Customer orders are sent to RocketWheel Delivery system, not to your phone.
    <br/>
    Delivery boys will communicate with your restaurant verbally.
  </p>
</div>
```

---

### Step 8: Admin Dashboard Update

**File:** `frontend/src/pages/AdminDashboard.jsx`

**Delivery Boy Tab Clarification:**
```javascript
// Add info section:
<div className="info-alert">
  <strong>ℹ️ How Delivery Boys Work:</strong>
  <ul>
    <li>Assigned delivery boys receive customer orders via WhatsApp</li>
    <li>They will go to the restaurant and place the order verbally</li>
    <li>Restaurant staff will prepare the food</li>
    <li>Delivery boy will pick up and deliver to customer</li>
  </ul>
</div>
```

---

## 🔍 Testing Checklist

### Frontend Testing:
- [ ] Button text updated: "Order via RocketWheel Delivery"
- [ ] Button tooltip shows new description
- [ ] Success message updated
- [ ] Message formatting correct
- [ ] Profile page shows clarification text
- [ ] Admin page shows delivery info

### Backend Testing:
- [ ] Order creation endpoint works
- [ ] Phone number logic correct (never uses vendor phone)
- [ ] Message formatting correct with new template
- [ ] Order saved to database
- [ ] Order ID generated correctly (RW12345 format)
- [ ] WhatsApp sent to delivery phone only

### API Testing:
```bash
# Create order
POST /api/orders/create
{
  "vendorId": "635f3b2a1c9d4e2b8a5c3f1d",
  "customerName": "Satya",
  "customerPhone": "9876543210",
  "items": [
    {"id": "1", "name": "Biryani", "price": 300, "qty": 2}
  ],
  "total": 600,
  "address": "123 Main Street",
  "instructions": "Extra spicy"
}

Expected Response:
{
  "success": true,
  "orderId": "RW12345",
  "deliveryPhone": "+923001234567",
  "message": "Order sent to RocketWheel Delivery"
}
```

---

## 🔄 Migration Notes

### If Updating Existing System:

1. **Check Existing Orders:**
   - Some orders may have vendor phone in `deliveryPhoneUsed`
   - This is OK - they were processed under old system
   - New orders will use delivery phone only

2. **Update Delivery Boy Assignments:**
   - Ensure all vendors have delivery boy assignments
   - If not assigned, central phone will be used
   - This is acceptable as fallback

3. **Notification Strategy:**
   - Send email to vendors explaining change
   - Provide training on new system
   - Update vendor documentation

4. **Database Migration:**
   - No schema changes required
   - Add new fields to Order model
   - Old orders will still work

---

## 📋 Summary of Changes

| Component | Old Behavior | New Behavior |
|-----------|-------------|-------------|
| Button Text | "Place Order on WhatsApp" | "Order via RocketWheel Delivery" |
| Message Recipient | Vendor phone | Delivery boy phone only |
| Restaurant Notification | WhatsApp | No direct notification |
| Restaurant Order | System message | Verbal from delivery boy |
| Message Format | Simple format | Detailed with pickup location |
| Order Status | Simple (Pending/Complete) | Detailed workflow |
| Vendor Phone | For orders | For contact only |

---

## ✅ Completion Checklist

- [ ] Frontend button updated
- [ ] Phone number logic changed
- [ ] Message formatting updated
- [ ] Backend endpoint updated
- [ ] Order model updated
- [ ] Delivery boy routing configured
- [ ] Profile page clarification added
- [ ] Admin page clarification added
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Team trained on new system
- [ ] Production ready

---

## 🎯 Result

After implementation:
- ✅ Cleaner order flow
- ✅ Restaurants don't need WhatsApp integration
- ✅ Delivery boys handle all logistics
- ✅ System is more maintainable
- ✅ Better separation of concerns
- ✅ Production ready

---
