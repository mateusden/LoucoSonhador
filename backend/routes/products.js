const express = require('express');
const router = express.Router();
const { pool } = require('../database/connection'); // ← Mudança aqui

// Listar todos os produtos
router.get('/', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM produtos');
      client.release();
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});

// Cadastrar novo produto (com id alfanumérico)
router.post('/', async (req, res) => {
  const { id, nome, preco, imagem, descricao, destaque, arquivo, categoria } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO produtos (id, nome, preco, imagem, descricao, destaque, arquivo, categoria) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [id, nome, preco, imagem, descricao, destaque, arquivo, categoria]
    );
    client.release();
    res.status(201).json(result.rows[0]);
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
        const client = await pool.connect();
        const result = await client.query(
            'UPDATE produtos SET nome = $1, preco = $2, imagem = $3, descricao = $4, destaque = $5 WHERE id = $6 RETURNING *',
            [nome, preco, imagem, descricao, destaque, id]
        );
        client.release();
        
        if (result.rowCount === 0) {
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
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM produtos WHERE destaque = $1', [true]);
        client.release();
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar produtos em destaque' });
    }
});

// Buscar produto por id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM produtos WHERE id = $1', [id]);
      client.release();
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Erro ao buscar produto:', err);
      res.status(500).json({ error: 'Erro ao buscar produto' });
    }
});

// Deletar produto por id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const client = await pool.connect();
      const result = await client.query('DELETE FROM produtos WHERE id = $1', [id]);
      client.release();
      
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      
      res.json({ message: 'Produto excluído com sucesso!' });
    } catch (err) {
      console.error('Erro ao excluir produto:', err);
      res.status(500).json({ error: 'Erro ao excluir produto' });
    }
});

module.exports = router;