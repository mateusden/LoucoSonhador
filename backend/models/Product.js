const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, required: true },
  tags: [String],
  images: [String],
  files: [String],
  license: { type: String, enum: ['pessoal', 'comercial', 'estendida'], default: 'pessoal' },
  isFree: { type: Boolean, default: false },
  status: { type: String, enum: ['ativo', 'pausado', 'rascunho'], default: 'rascunho' },
  seo: {
    title: String,
    description: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', ProductSchema); 