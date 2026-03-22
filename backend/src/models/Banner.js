const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BannerSchema = new Schema({
  title: { type: String },
  imageUrl: { type: String },
  playStoreUrl: { type: String },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Banner', BannerSchema);
