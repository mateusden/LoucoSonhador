const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../database/connection');

// Listar wishlist do usuário logado
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query('SELECT * FROM wishlist WHERE user_id = $1', [userId]);
    res.json(result.rows); // PostgreSQL usa result.rows
  } catch (error) {
    console.error('Erro ao buscar wishlist:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Adicionar item à wishlist
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;
    
    // PostgreSQL usa ON CONFLICT DO NOTHING ao invés de INSERT IGNORE
    await db.query(`
      INSERT INTO wishlist (user_id, product_id) 
      VALUES ($1, $2) 
      ON CONFLICT (user_id, product_id) DO NOTHING
    `, [userId, product_id]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao adicionar à wishlist:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Remover item da wishlist
router.delete('/:product_id', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.params;
    
    const result = await db.query(
      'DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2', 
      [userId, product_id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Item não encontrado na wishlist' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao remover da wishlist:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Limpar wishlist
router.delete('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query('DELETE FROM wishlist WHERE user_id = $1', [userId]);
    
    res.json({ 
      success: true, 
      message: `${result.rowCount} item(s) removido(s) da wishlist` 
    });
  } catch (error) {
    console.error('Erro ao limpar wishlist:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Verificar se produto está na wishlist do usuário
router.get('/check/:product_id', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.params;
    
    const result = await db.query(
      'SELECT COUNT(*) as count FROM wishlist WHERE user_id = $1 AND product_id = $2',
      [userId, product_id]
    );
    
    const isInWishlist = parseInt(result.rows[0].count) > 0;
    res.json({ inWishlist: isInWishlist });
  } catch (error) {
    console.error('Erro ao verificar wishlist:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;