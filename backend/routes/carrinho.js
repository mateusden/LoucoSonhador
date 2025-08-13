const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../database/connection'); // ajuste para seu arquivo de conexão PostgreSQL

// Listar itens do carrinho do usuário logado
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    // PostgreSQL usa $1, $2... ao invés de ?
    const result = await db.query('SELECT * FROM carrinho WHERE user_id = $1', [userId]);
    res.json(result.rows); // PostgreSQL retorna .rows
  } catch (error) {
    console.error('Erro ao buscar carrinho:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Adicionar item ao carrinho
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantidade } = req.body;
    
    // PostgreSQL usa UPSERT com ON CONFLICT ao invés de ON DUPLICATE KEY UPDATE
    await db.query(`
      INSERT INTO carrinho (user_id, product_id, quantidade) 
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, product_id) 
      DO UPDATE SET quantidade = carrinho.quantidade + $4
    `, [userId, product_id, quantidade || 1, quantidade || 1]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Remover item do carrinho
router.delete('/:product_id', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.params;
    
    await db.query('DELETE FROM carrinho WHERE user_id = $1 AND product_id = $2', [userId, product_id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao remover do carrinho:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Limpar carrinho
router.delete('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    await db.query('DELETE FROM carrinho WHERE user_id = $1', [userId]);
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao limpar carrinho:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;