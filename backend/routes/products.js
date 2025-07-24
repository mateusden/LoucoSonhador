const express = require('express');
const router = express.Router();
const pool = require('../database/connection');

router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM produtos');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
  });
  

// Cadastrar novo produto (com id alfanumérico)
router.post('/', async (req, res) => {
    const { id, nome, preco, imagem, descricao, destaque } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO produtos (id, nome, preco, imagem, descricao, destaque) VALUES (?, ?, ?, ?, ?, ?)',
        [id, nome, preco, imagem, descricao, destaque]
      );
      res.status(201).json({ id, nome, preco, imagem, descricao, destaque });
    } catch (err) {
      res.status(400).json({ error: 'Erro ao cadastrar produto' });
    }
});

// Atualizar produto existente
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, preco, imagem, descricao, destaque } = req.body; // inclua destaque aqui
    try {
        const [result] = await pool.query(
            'UPDATE produtos SET nome = ?, preco = ?, imagem = ?, descricao = ?, destaque = ? WHERE id = ?',
            [nome, preco, imagem, descricao, destaque, id] // inclua destaque aqui
        );
        res.json({ message: 'Produto atualizado com sucesso!' });
    } catch (err) {
        res.status(400).json({ error: 'Erro ao atualizar produto' });
    }
});

// Listar produtos em destaque
router.get('/destaque', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM produtos WHERE destaque = 1');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar produtos em destaque' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await pool.query('SELECT * FROM produtos WHERE id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar produto' });
    }
  });
  
// Deletar produto por id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await pool.query('DELETE FROM produtos WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      res.json({ message: 'Produto excluído com sucesso!' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao excluir produto' });
    }
  });

module.exports = router;