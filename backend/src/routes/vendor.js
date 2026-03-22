const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const xlsx = require('xlsx');
const jwt = require('jsonwebtoken');

const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const { verifyToken, vendorAuth } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

const bulkUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isExcelOrCsv = /\.(xlsx|xls|csv)$/i.test(file.originalname || '');
    if (!isExcelOrCsv) {
      return cb(new Error('Invalid file type. Upload .xlsx, .xls, or .csv file.'));
    }
    cb(null, true);
  }
});

// Vendor registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, category, address, phone } = req.body;
    const existing = await Vendor.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    const vendor = new Vendor({ name, email, password, category, address, phone });
    await vendor.save();
    res.json({ success: true, message: 'Registered, awaiting approval' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vendor login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const vendor = await Vendor.findOne({ email });
    if (!vendor || !(await vendor.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!vendor.approved) {
      return res.status(403).json({ error: 'Not approved yet' });
    }
    const token = jwt.sign({ id: vendor._id, role: 'vendor' }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, vendor: { _id: vendor._id, name: vendor.name, email: vendor.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add product with image upload
const imageUpload = multer({ dest: path.join(__dirname, '..', '..', 'uploads', 'products') });
router.post('/:vendorId/products', verifyToken, vendorAuth, imageUpload.single('image'), async (req, res) => {
  try {
    if (req.user.id !== req.params.vendorId) return res.status(403).json({ error: 'Unauthorized' });
    const { name, price, category } = req.body;
    const normalizedCategory = typeof category === 'string' ? category.trim() : undefined;
    const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : undefined;
    const product = new Product({
      vendor: req.params.vendorId,
      name,
      price,
      category: normalizedCategory,
      imageUrl
    });
    await product.save();
    await Vendor.findByIdAndUpdate(req.params.vendorId, { $push: { products: product._id } });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update vendor product
router.put('/:vendorId/products/:productId', verifyToken, vendorAuth, async (req, res) => {
  try {
    if (req.user.id !== req.params.vendorId) return res.status(403).json({ error: 'Unauthorized' });
    const { name, price, imageUrl, category } = req.body;
    const normalizedCategory = typeof category === 'string' ? category.trim() : category;

    const product = await Product.findOne({ _id: req.params.productId, vendor: req.params.vendorId });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (imageUrl !== undefined) product.imageUrl = imageUrl;
    if (normalizedCategory !== undefined) product.category = normalizedCategory;

    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete vendor product
router.delete('/:vendorId/products/:productId', verifyToken, vendorAuth, async (req, res) => {
  try {
    if (req.user.id !== req.params.vendorId) return res.status(403).json({ error: 'Unauthorized' });

    const product = await Product.findOneAndDelete({ _id: req.params.productId, vendor: req.params.vendorId });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    await Vendor.findByIdAndUpdate(req.params.vendorId, { $pull: { products: req.params.productId } });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bulk upload via Excel
router.post('/:vendorId/products/upload-xlsx', verifyToken, vendorAuth, (req, res, next) => {
  bulkUpload.single('file')(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ error: err.message || 'File upload failed' });
  });
}, async (req, res) => {
  try {
    if (req.user.id !== req.params.vendorId) return res.status(403).json({ error: 'Unauthorized' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    if (!workbook.SheetNames.length) {
      return res.status(400).json({ error: 'No worksheet found in uploaded file' });
    }

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet, {
      defval: null,
      raw: false,
      blankrows: false,
      range: 0
    });

    if (!rows.length) {
      return res.status(400).json({ error: 'No data rows found. Add product rows below header.' });
    }

    const validProducts = [];
    const skippedRows = [];

    rows.forEach((row, index) => {
      const rowNumber = index + 2;
      const name = (row.name || row.Name || row.productName || row.ProductName || row.product || row.Product || '').toString().trim();
      const rawPrice = row.price ?? row.Price ?? row.amount ?? row.Amount ?? row.cost ?? row.Cost;
      const normalizedPrice = rawPrice === null || rawPrice === undefined
        ? ''
        : String(rawPrice).replace(/[^0-9.-]/g, '');
      const price = Number(normalizedPrice);
      const imageUrlRaw = row.imageUrl ?? row.ImageUrl ?? row.imageURL ?? row.ImageURL ?? row.image ?? row.Image;
      const imageUrl = imageUrlRaw ? String(imageUrlRaw).trim() : undefined;
      const categoryRaw = row.category ?? row.Category ?? row.cat ?? row.Cat;
      const category = categoryRaw ? String(categoryRaw).trim() : undefined;

      if (!name || Number.isNaN(price) || price <= 0) {
        skippedRows.push({
          row: rowNumber,
          reason: 'Invalid name or price'
        });
        return;
      }

      validProducts.push({
        vendor: req.params.vendorId,
        name,
        price,
        category: category || undefined,
        imageUrl
      });
    });

    if (!validProducts.length) {
      return res.status(400).json({
        error: 'No valid product rows found. Ensure columns include name and price.',
        skippedRows
      });
    }

    const createdProducts = await Product.insertMany(validProducts, { ordered: false });
    await Vendor.findByIdAndUpdate(req.params.vendorId, {
      $push: { products: { $each: createdProducts.map((p) => p._id) } }
    });

    res.json({
      success: true,
      createdCount: createdProducts.length,
      skippedCount: skippedRows.length,
      skippedRows,
      products: createdProducts
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get vendor products
router.get('/:vendorId/products', verifyToken, vendorAuth, async (req, res) => {
  try {
    if (req.user.id !== req.params.vendorId) return res.status(403).json({ error: 'Unauthorized' });
    const products = await Product.find({ vendor: req.params.vendorId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get vendor info
router.get('/:vendorId/info', verifyToken, vendorAuth, async (req, res) => {
  try {
    if (req.user.id !== req.params.vendorId) return res.status(403).json({ error: 'Unauthorized' });
    const vendor = await Vendor.findById(req.params.vendorId).select('-password');
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload vendor photo
const vendorPhotoUpload = multer({ dest: path.join(__dirname, '..', '..', 'uploads', 'vendors') });
router.post('/:vendorId/photo', verifyToken, vendorAuth, vendorPhotoUpload.single('photo'), async (req, res) => {
  try {
    if (req.user.id !== req.params.vendorId) return res.status(403).json({ error: 'Unauthorized' });
    if (!req.file) return res.status(400).json({ error: 'No photo uploaded' });
    const photoUrl = `/uploads/vendors/${req.file.filename}`;
    const vendor = await Vendor.findByIdAndUpdate(req.params.vendorId, { photo: photoUrl }, { new: true }).select('-password');
    res.json({ success: true, vendor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update vendor details
router.put('/:vendorId/info', verifyToken, vendorAuth, async (req, res) => {
  try {
    if (req.user.id !== req.params.vendorId) return res.status(403).json({ error: 'Unauthorized' });
    const { name, category, address, phone } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name;
    if (category !== undefined) updates.category = category;
    if (address !== undefined) updates.address = address;
    if (phone !== undefined) updates.phone = phone;

    const vendor = await Vendor.findByIdAndUpdate(req.params.vendorId, updates, { new: true }).select('-password');
    res.json({ success: true, vendor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
