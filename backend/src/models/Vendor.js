const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const VendorSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  category: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  approved: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  qrDataUrl: { type: String },
  assignedDeliveryPhone: { type: String },
  photo: { type: String },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  createdAt: { type: Date, default: Date.now }
});

VendorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

VendorSchema.methods.comparePassword = async function(pwd) {
  return await bcrypt.compare(pwd, this.password);
};

module.exports = mongoose.model('Vendor', VendorSchema);
