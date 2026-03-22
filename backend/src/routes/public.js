const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');

const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Banner = require('../models/Banner');
const Order = require('../models/Order');
const Setting = require('../models/Setting');

async function getCentralSupportPhone() {
  const setting = await Setting.findOne({ key: 'CENTRAL_SUPPORT_PHONE' }).lean();
  return setting?.value || process.env.CENTRAL_ROCKETWHEEL_PHONE || '';
}

function getClientOrigin() {
  return (process.env.CLIENT_ORIGIN || 'http://localhost:3000').replace(/\/+$/, '');
}

function usesHashRouter() {
  const origin = getClientOrigin();
  return process.env.CLIENT_ROUTER_MODE === 'hash' || origin.includes('github.io');
}

function buildClientUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const hashPrefix = usesHashRouter() ? '/#' : '';
  return `${getClientOrigin()}${hashPrefix}${normalizedPath}`;
}

// Global vendors discovery grouped by category
router.get('/vendors', async (req, res) => {
  try {
    const vendors = await Vendor.find({ approved: true, enabled: { $ne: false } }).select('-password').lean();
    const grouped = {};
    vendors.forEach(v => {
      if (!grouped[v.category]) grouped[v.category] = [];
      grouped[v.category].push(v);
    });
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vendor menu by id
router.get('/vendors/:vendorId', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.vendorId).select('-password').lean();
    if (!vendor || !vendor.approved || vendor.enabled === false) return res.status(404).json({ error: 'Vendor not available' });
    const products = await Product.find({ vendor: vendor._id }).lean();
    const banners = await Banner.find({ active: true }).sort({ createdAt: -1 }).lean();
    const banner = banners[0] || null;
    const centralSupportPhone = await getCentralSupportPhone();
    res.json({ vendor, products, banner, banners, centralSupportPhone });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Active banners for public pages
router.get('/banners', async (req, res) => {
  try {
    const banners = await Banner.find({ active: true }).sort({ createdAt: -1 }).lean();
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public customer support info
router.get('/support', async (req, res) => {
  try {
    const phone = await getCentralSupportPhone();
    res.json({ phone });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Global QR (links to /vendors)
router.get('/qr/global', async (req, res) => {
  try {
    const url = buildClientUrl('/vendors');
    const dataUrl = await QRCode.toDataURL(url);
    res.json({ dataUrl, url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vendor QR
router.get('/qr/vendor/:vendorId', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.vendorId);
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

    const url = buildClientUrl(`/menu/${vendor._id}`);
    const dataUrl = await QRCode.toDataURL(url);

    // Persist the most recent QR so old localhost links get replaced.
    if (vendor.qrDataUrl !== dataUrl) {
      vendor.qrDataUrl = dataUrl;
      await vendor.save();
    }

    res.json({ dataUrl, url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Place order (cart checkout)
router.post('/orders', async (req, res) => {
  try {
    const { vendorId, items, totalAmount, customerName, customerPhone, customerAddress } = req.body;
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    const centralSupportPhone = await getCentralSupportPhone();
    
    const orderId = `RW-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const order = new Order({
      orderId,
      vendor: vendorId,
      items,
      totalAmount,
      customerName,
      customerPhone,
      customerAddress,
      deliveryPhone: vendor.assignedDeliveryPhone || centralSupportPhone
    });
    await order.save();
    res.json({ success: true, orderId, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get order details
router.get('/orders/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId }).populate('vendor', 'name category');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
