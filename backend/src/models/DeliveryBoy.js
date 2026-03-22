const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeliveryBoySchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  assignedVendors: [{ type: Schema.Types.ObjectId, ref: 'Vendor' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DeliveryBoy', DeliveryBoySchema);
