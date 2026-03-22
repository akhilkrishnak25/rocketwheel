const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Banner = require('../models/Banner');
const DeliveryBoy = require('../models/DeliveryBoy');
const Admin = require('../models/Admin');
const Order = require('../models/Order');
const Setting = require('../models/Setting');
const { verifyToken, adminAuth } = require('../middleware/auth');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let admin = await Admin.findOne({ email });
    if (!admin) {
      // Create default admin if not exists
      admin = new Admin({ email, password });
      await admin.save();
    } else {
      const valid = await admin.comparePassword(password);
      if (!valid) return res.status(401).json({ error: 'Invalid password' });
    }
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, admin: { _id: admin._id, email: admin.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all vendors
router.get('/vendors', verifyToken, adminAuth, async (req, res) => {
  try {
    const vendors = await Vendor.find().select('-password').lean();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve vendor and generate QR
const QRCode = require('qrcode');
router.post('/vendors/:id/approve', verifyToken, adminAuth, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    vendor.approved = true;
    const url = `${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}/menu/${vendor._id}`;
    vendor.qrDataUrl = await QRCode.toDataURL(url);
    await vendor.save();
    res.json({ success: true, vendor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject vendor
router.post('/vendors/:id/reject', verifyToken, adminAuth, async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Enable/disable vendor
router.post('/vendors/:id/toggle', verifyToken, adminAuth, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    vendor.enabled = !vendor.enabled;
    await vendor.save();
    res.json({ success: true, enabled: vendor.enabled });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Manage delivery boys
router.post('/deliveryboys', verifyToken, adminAuth, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const db = new DeliveryBoy({ name, phone });
    await db.save();
    res.json({ success: true, deliveryBoy: db });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/deliveryboys', verifyToken, adminAuth, async (req, res) => {
  try {
    const list = await DeliveryBoy.find().lean();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assign delivery boy to vendor
router.post('/vendors/:id/assign-delivery', verifyToken, adminAuth, async (req, res) => {
  try {
    const { deliveryBoyId } = req.body;
    const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
    if (!deliveryBoy) return res.status(404).json({ error: 'Delivery boy not found' });
    await Vendor.findByIdAndUpdate(req.params.id, { assignedDeliveryPhone: deliveryBoy.phone });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload banner
const upload = multer({ dest: path.join(__dirname, '..', '..', 'uploads', 'banners') });
router.post('/banners', verifyToken, adminAuth, upload.single('image'), async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/banners/${req.file.filename}` : undefined;
    const banner = new Banner({
      title: req.body.title,
      imageUrl,
      playStoreUrl: req.body.playStoreUrl,
      active: true
    });
    await banner.save();
    res.json({ success: true, banner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update banner (title, playStoreUrl, optional image)
router.put('/banners/:id', verifyToken, adminAuth, upload.single('image'), async (req, res) => {
  try {
    const updates = {};
    if (typeof req.body.title !== 'undefined') updates.title = req.body.title;
    if (typeof req.body.playStoreUrl !== 'undefined') updates.playStoreUrl = req.body.playStoreUrl;
    if (req.file) updates.imageUrl = `/uploads/banners/${req.file.filename}`;

    const banner = await Banner.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!banner) return res.status(404).json({ error: 'Banner not found' });
    res.json({ success: true, banner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete banner
router.delete('/banners/:id', verifyToken, adminAuth, async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ error: 'Banner not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all banners
router.get('/banners', async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 }).lean();
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Set central delivery number
router.post('/central-delivery', verifyToken, adminAuth, async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone is required' });

    await Setting.findOneAndUpdate(
      { key: 'CENTRAL_SUPPORT_PHONE' },
      { value: phone, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    process.env.CENTRAL_ROCKETWHEEL_PHONE = phone;
    res.json({ success: true, phone });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get central delivery/customer support number
router.get('/central-delivery', verifyToken, adminAuth, async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'CENTRAL_SUPPORT_PHONE' }).lean();
    const phone = setting?.value || process.env.CENTRAL_ROCKETWHEEL_PHONE || '';
    res.json({ phone });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// View all orders
router.get('/orders', verifyToken, adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().populate('vendor', 'name').lean();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ NEW: Assign restaurants to delivery boy (multiple restaurants)
router.post('/deliveryboys/:id/assign-restaurants', verifyToken, adminAuth, async (req, res) => {
  try {
    const { restaurantIds } = req.body; // Array of vendor IDs
    const deliveryBoy = await DeliveryBoy.findById(req.params.id);
    if (!deliveryBoy) return res.status(404).json({ error: 'Delivery boy not found' });

    const nextRestaurantIds = Array.isArray(restaurantIds) ? restaurantIds : [];
    const prevRestaurantIds = (deliveryBoy.assignedVendors || []).map(id => String(id));
    const nextRestaurantIdSet = new Set(nextRestaurantIds.map(id => String(id)));
    const removedRestaurantIds = prevRestaurantIds.filter(id => !nextRestaurantIdSet.has(id));
    
    // Update delivery boy with assigned restaurants
    deliveryBoy.assignedVendors = nextRestaurantIds;
    await deliveryBoy.save();

    // Sync vendor phone used by public ordering flow.
    if (nextRestaurantIds.length > 0) {
      await Vendor.updateMany(
        { _id: { $in: nextRestaurantIds } },
        { $set: { assignedDeliveryPhone: deliveryBoy.phone } }
      );
    }

    if (removedRestaurantIds.length > 0) {
      await Vendor.updateMany(
        { _id: { $in: removedRestaurantIds } },
        { $unset: { assignedDeliveryPhone: 1 } }
      );
    }
    
    res.json({ success: true, deliveryBoy });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ NEW: Get assigned restaurants for delivery boy
router.get('/deliveryboys/:id/assigned-restaurants', verifyToken, adminAuth, async (req, res) => {
  try {
    const deliveryBoy = await DeliveryBoy.findById(req.params.id).populate('assignedVendors', 'name address phone');
    if (!deliveryBoy) return res.status(404).json({ error: 'Delivery boy not found' });
    res.json(deliveryBoy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ NEW: Get all restaurants for assignment selection
router.get('/restaurants-for-assignment', verifyToken, adminAuth, async (req, res) => {
  try {
    const restaurants = await Vendor.find({ approved: true }).select('_id name address phone category').lean();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ NEW: Edit delivery boy (name, phone)
router.post('/deliveryboys/:id/edit', verifyToken, adminAuth, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const deliveryBoy = await DeliveryBoy.findById(req.params.id);
    if (!deliveryBoy) return res.status(404).json({ error: 'Delivery boy not found' });
    
    if (name) deliveryBoy.name = name;
    if (phone) deliveryBoy.phone = phone;
    
    await deliveryBoy.save();

    // Keep assigned vendor delivery phone in sync after phone edits.
    if (phone && deliveryBoy.assignedVendors && deliveryBoy.assignedVendors.length > 0) {
      await Vendor.updateMany(
        { _id: { $in: deliveryBoy.assignedVendors } },
        { $set: { assignedDeliveryPhone: phone } }
      );
    }

    res.json({ success: true, deliveryBoy });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ NEW: Delete delivery boy
router.post('/deliveryboys/:id/delete', verifyToken, adminAuth, async (req, res) => {
  try {
    const deliveryBoy = await DeliveryBoy.findById(req.params.id);
    if (!deliveryBoy) return res.status(404).json({ error: 'Delivery boy not found' });

    if (deliveryBoy.assignedVendors && deliveryBoy.assignedVendors.length > 0) {
      await Vendor.updateMany(
        { _id: { $in: deliveryBoy.assignedVendors } },
        { $unset: { assignedDeliveryPhone: 1 } }
      );
    }

    await DeliveryBoy.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
