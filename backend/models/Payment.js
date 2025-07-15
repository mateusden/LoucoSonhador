const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pendente', 'pago'], default: 'pendente' },
  method: { type: String, enum: ['pix', 'transferencia', 'paypal'], required: true },
  requestedAt: { type: Date, default: Date.now },
  paidAt: Date,
});

module.exports = mongoose.model('Payment', PaymentSchema); 