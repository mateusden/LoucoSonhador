const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../database/connection');

// Listar wishlist do usuário logado
router.get('/', auth, async (req, res) => {
  const userId = req.user.id;
  const [rows] = await db.query('SELECT * FROM wishlist WHERE user_id = ?', [userId]);
  res.json(rows);
});

// Adicionar item à wishlist
router.post('/', auth, async (req, res) => {
  const userId = req.user.id;
  const { product_id } = req.body;
  await db.query('INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)', [userId, product_id]);
  res.json({ success: true });
});

// Remover item da wishlist
router.delete('/:product_id', auth, async (req, res) => {
  const userId = req.user.id;
  const { product_id } = req.params;
  await db.query('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [userId, product_id]);
  res.json({ success: true });
});

// Limpar wishlist
router.delete('/', auth, async (req, res) => {
  const userId = req.user.id;
  await db.query('DELETE FROM wishlist WHERE user_id = ?', [userId]);
  res.json({ success: true });
});

module.exports = router;