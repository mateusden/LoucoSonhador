const express = require('express');
const router = express.Router();
const pool = require('../database/connection');

// Listar todos os produtos
router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM produtos');
      res.json(result.rows);  // ← era [rows]
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});

// Cadastrar novo produto (com id alfanumérico)
router.post('/', async (req, res) => {
    const { id, nome, preco, imagem, descricao, destaque } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO produtos (id, nome, preco, imagem, descricao, destaque) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [id, nome, preco, imagem, descricao, destaque]  // ← era ? ? ?
      );
      res.status(201).json(result.rows[0]);  // ← retorna o produto criado
    } catch (err) {
      console.error('Erro ao cadastrar produto:', err);
      res.status(400).json({ error: 'Erro ao cadastrar produto' });
    }
});

// Atualizar produto existente
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, preco, imagem, descricao, destaque } = req.body;
    try {
        const result = await pool.query(
            'UPDATE produtos SET nome = $1, preco = $2, imagem = $3, descricao = $4, destaque = $5 WHERE id = $6 RETURNING *',
            [nome, preco, imagem, descricao, destaque, id]  // ← era ? ? ?
        );
        
        if (result.rowCount === 0) {  // ← era result.affectedRows
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        
        res.json({ 
            message: 'Produto atualizado com sucesso!',
            produto: result.rows[0]
        });
    } catch (err) {
        console.error('Erro ao atualizar produto:', err);
        res.status(400).json({ error: 'Erro ao atualizar produto' });
    }
});

// Listar produtos em destaque
router.get('/destaque', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM produtos WHERE destaque = $1', [true]);  // ← era destaque = 1
        res.json(result.rows);  // ← era [rows]
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar produtos em destaque' });
    }
});

// Buscar produto por id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM produtos WHERE id = $1', [id]);  // ← era ?
      
      if (result.rows.length === 0) {  // ← era rows.length
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      
      res.json(result.rows[0]);  // ← era rows[0]
    } catch (err) {
      console.error('Erro ao buscar produto:', err);
      res.status(500).json({ error: 'Erro ao buscar produto' });
    }
});

// Deletar produto por id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('DELETE FROM produtos WHERE id = $1', [id]);  // ← era ?
      
      if (result.rowCount === 0) {  // ← era result.affectedRows
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      
      res.json({ message: 'Produto excluído com sucesso!' });
    } catch (err) {
      console.error('Erro ao excluir produto:', err);
      res.status(500).json({ error: 'Erro ao excluir produto' });
    }
});

module.exports = router;