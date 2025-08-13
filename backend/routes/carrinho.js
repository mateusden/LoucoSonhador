const express = require('express'); 
const router = express.Router(); 
const auth = require('../middleware/auth'); 
const { pool } = require('../database/connection'); // ← MUDANÇA: { pool }

// Listar itens do carrinho do usuário logado
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM carrinho WHERE user_id = $1', [userId]);
    client.release();
    res.json(result.rows);
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
    
    const client = await pool.connect();
    await client.query(`
      INSERT INTO carrinho (user_id, product_id, quantidade) 
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, product_id) 
      DO UPDATE SET quantidade = carrinho.quantidade + $4
    `, [userId, product_id, quantidade || 1, quantidade || 1]);
    client.release();
    
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
    
    const client = await pool.connect();
    await client.query('DELETE FROM carrinho WHERE user_id = $1 AND product_id = $2', [userId, product_id]);
    client.release();
    
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
    const client = await pool.connect();
    await client.query('DELETE FROM carrinho WHERE user_id = $1', [userId]);
    client.release();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao limpar carrinho:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;