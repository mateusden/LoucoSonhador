const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../database/connection'); // ajuste para seu arquivo de conexão

// Listar itens do carrinho do usuário logado
router.get('/', auth, async (req, res) => {
  const userId = req.user.id;
  const [rows] = await db.query('SELECT * FROM carrinho WHERE user_id = ?', [userId]);
  res.json(rows);
});

// Adicionar item ao carrinho
router.post('/', auth, async (req, res) => {
  const userId = req.user.id;
  const { product_id, quantidade } = req.body;
  await db.query('INSERT INTO carrinho (user_id, product_id, quantidade) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantidade = quantidade + ?', [userId, product_id, quantidade || 1, quantidade || 1]);
  res.json({ success: true });
});

// Remover item do carrinho
router.delete('/:product_id', auth, async (req, res) => {
  const userId = req.user.id;
  const { product_id } = req.params;
  await db.query('DELETE FROM carrinho WHERE user_id = ? AND product_id = ?', [userId, product_id]);
  res.json({ success: true });
});

// Limpar carrinho
router.delete('/', auth, async (req, res) => {
  const userId = req.user.id;
  await db.query('DELETE FROM carrinho WHERE user_id = ?', [userId]);
  res.json({ success: true });
});

module.exports = router;