const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  orderId: { type: String, unique: true },
  vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  items: [
    {
      product: String,
      qty: Number,
      price: Number
    }
  ],
  totalAmount: { type: Number, required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  deliveryPhone: { type: String },
  status: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'on-way', 'delivered', 'cancelled'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
