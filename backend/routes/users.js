const express = require('express');
const router = express.Router();
const pool = require('../database/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const autenticarToken = require('../middleware/auth');

const SECRET = 'euodeiogostarde1pacoquita';

// Cadastro
router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  
  try {
    const hash = await bcrypt.hash(senha, 10);
    const [result] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, hash]
    );
    res.status(201).json({ id: result.insertId, nome, email });
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.status(400).json({ error: 'Erro ao cadastrar usuário' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }
    
    const usuario = rows[0];
    const match = await bcrypt.compare(senha, usuario.senha);
    
    if (!match) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Gera o token
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email }, 
      SECRET, 
      { expiresIn: '1h' }
    );

    // Envia o token em cookie httpOnly
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // true se usar HTTPS
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 1 hora
      domain: undefined, // Permite cookies em subdomínios
      path: '/' // Cookie disponível em todo o site
    });
    
    res.json({ 
      message: 'Login realizado com sucesso!',
      user: { id: usuario.id, nome: usuario.nome, email: usuario.email }
    });
    
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Perfil (rota protegida)
router.get('/perfil', autenticarToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nome, email, nascimento, genero FROM usuarios WHERE id = ?', [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar perfil do usuário' });
  }
});

// Atualização de perfil do usuário logado
router.put('/perfil', autenticarToken, async (req, res) => {
  const { nome, nascimento, genero } = req.body;
  if (!nome && !nascimento && !genero) {
    return res.status(400).json({ error: 'Nenhum dado para atualizar.' });
  }
  try {
    // Monta query dinâmica
    let campos = [];
    let valores = [];
    if (nome) { campos.push('nome = ?'); valores.push(nome); }
    if (nascimento) { campos.push('nascimento = ?'); valores.push(nascimento); }
    if (genero) { campos.push('genero = ?'); valores.push(genero); }
    valores.push(req.user.id);
    const sql = `UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`;
    await pool.query(sql, valores);
    res.json({ message: 'Perfil atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
});

// Alteração de senha do usuário logado
router.post('/senha', autenticarToken, async (req, res) => {
  const { senhaAtual, novaSenha } = req.body;
  if (!senhaAtual || !novaSenha) {
    return res.status(400).json({ error: 'Preencha todos os campos.' });
  }
  try {
    // Busca usuário atual
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    const usuario = rows[0];
    // Verifica senha atual
    const match = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!match) {
      return res.status(401).json({ error: 'Senha atual incorreta' });
    }
    // Atualiza senha
    const hash = await bcrypt.hash(novaSenha, 10);
    await pool.query('UPDATE usuarios SET senha = ? WHERE id = ?', [hash, req.user.id]);
    res.json({ message: 'Senha alterada com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao alterar senha' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout realizado com sucesso!' });
});

// Rota de teste para verificar se está logado
router.get('/check-auth', autenticarToken, (req, res) => {
  res.json({ 
    message: 'Usuário autenticado',
    user: { id: req.user.id, email: req.user.email }
  });
});

// Resumo de compras do usuário logado
const Sale = require('../models/Sale');

router.get('/resumo-compras', autenticarToken, async (req, res) => {
  try {
    // Busca todas as vendas onde o usuário é o comprador e o status é 'pago'
    const vendas = await Sale.find({ buyer: req.user.id, status: 'pago' });
    const totalProdutosComprados = vendas.length;
    const totalGasto = vendas.reduce((soma, venda) => soma + (venda.price || 0), 0);
    res.json({ totalProdutosComprados, totalGasto });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar resumo de compras' });
  }
});

// Produtos comprados pelo usuário logado (versão MySQL)
const db = require('../database/connection');

router.get('/produtos-comprados', autenticarToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.id, p.nome, p.imagem, p.arquivo, v.data_compra, v.preco
      FROM vendas v
      JOIN produtos p ON v.product_id = p.id
      WHERE v.user_id = ? AND v.status = 'pago'
      ORDER BY v.data_compra DESC
    `, [req.user.id]);
    const produtos = rows.map(row => ({
      id: row.id,
      nome: row.nome,
      imagem: row.imagem,
      arquivo: row.arquivo,
      dataCompra: row.data_compra,
      preco: row.preco
    }));
    res.json({ produtos });
  } catch (err) {
    console.error('Erro ao buscar produtos comprados:', err);
    res.status(500).json({ error: 'Erro ao buscar produtos comprados', detalhe: err.message });
  }
});

// Registrar compra manualmente (admin ou para testes)
router.post('/registrar-compra', async (req, res) => {
  const { user_id, product_id, preco } = req.body;
  if (!user_id || !product_id || !preco) {
    return res.status(400).json({ error: 'user_id, product_id e preco são obrigatórios.' });
  }
  try {
    await db.query(
      'INSERT INTO vendas (user_id, product_id, preco, status) VALUES (?, ?, ?, ?)',
      [user_id, product_id, preco, 'pago']
    );
    res.json({ message: 'Compra registrada com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar compra' });
  }
});

// Remover compra manualmente (admin ou para testes)
router.delete('/remover-compra', async (req, res) => {
  const { user_id, product_id } = req.body;
  if (!user_id || !product_id) {
    return res.status(400).json({ error: 'user_id e product_id são obrigatórios.' });
  }
  try {
    await db.query(
      'DELETE FROM vendas WHERE user_id = ? AND product_id = ? AND status = ? LIMIT 1',
      [user_id, product_id, 'pago']
    );
    res.json({ message: 'Compra removida com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover compra' });
  }
});

module.exports = router;