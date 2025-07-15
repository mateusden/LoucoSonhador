const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['pago', 'pendente', 'cancelado'], default: 'pendente' },
  downloadCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Sale', SaleSchema); 