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
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, hash]
    );
    const novoUsuario = result.rows[0];  // ← era result.insertId
    res.status(201).json({ id: novoUsuario.id, nome: novoUsuario.nome, email: novoUsuario.email });
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.status(400).json({ error: 'Erro ao cadastrar usuário' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {  // ← era rows.length
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }
    
    const usuario = result.rows[0];  // ← era rows[0]
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
    const result = await pool.query(
      'SELECT id, nome, email, nascimento, genero FROM usuarios WHERE id = $1', 
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ user: result.rows[0] });
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
    // Monta query dinâmica (PostgreSQL style)
    let campos = [];
    let valores = [];
    let paramIndex = 1;
    
    if (nome) { 
      campos.push(`nome = $${paramIndex}`); 
      valores.push(nome); 
      paramIndex++; 
    }
    if (nascimento) { 
      campos.push(`nascimento = $${paramIndex}`); 
      valores.push(nascimento); 
      paramIndex++; 
    }
    if (genero) { 
      campos.push(`genero = $${paramIndex}`); 
      valores.push(genero); 
      paramIndex++; 
    }
    
    valores.push(req.user.id);
    const sql = `UPDATE usuarios SET ${campos.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    
    const result = await pool.query(sql, valores);
    res.json({ 
      message: 'Perfil atualizado com sucesso!',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err);
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
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    const usuario = result.rows[0];
    
    // Verifica senha atual
    const match = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!match) {
      return res.status(401).json({ error: 'Senha atual incorreta' });
    }
    
    // Atualiza senha
    const hash = await bcrypt.hash(novaSenha, 10);
    await pool.query('UPDATE usuarios SET senha = $1 WHERE id = $2', [hash, req.user.id]);
    res.json({ message: 'Senha alterada com sucesso!' });
  } catch (err) {
    console.error('Erro ao alterar senha:', err);
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

// Resumo de compras do usuário logado (convertido de MongoDB para PostgreSQL)
router.get('/resumo-compras', autenticarToken, async (req, res) => {
  try {
    // Busca todas as vendas onde o usuário é o comprador e o status é 'pago'
    const result = await pool.query(
      'SELECT COUNT(*) as total_produtos, SUM(preco) as total_gasto FROM vendas WHERE user_id = $1 AND status = $2',
      [req.user.id, 'pago']
    );
    
    const { total_produtos, total_gasto } = result.rows[0];
    res.json({ 
      totalProdutosComprados: parseInt(total_produtos) || 0,
      totalGasto: parseFloat(total_gasto) || 0
    });
  } catch (err) {
    console.error('Erro ao buscar resumo de compras:', err);
    res.status(500).json({ error: 'Erro ao buscar resumo de compras' });
  }
});

// Produtos comprados pelo usuário logado
router.get('/produtos-comprados', autenticarToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.nome, p.imagem, p.arquivo, v.data_compra, v.preco
      FROM vendas v
      JOIN produtos p ON v.product_id = p.id
      WHERE v.user_id = $1 AND v.status = $2
      ORDER BY v.data_compra DESC
    `, [req.user.id, 'pago']);
    
    const produtos = result.rows.map(row => ({
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
    const result = await pool.query(
      'INSERT INTO vendas (user_id, product_id, preco, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, product_id, preco, 'pago']
    );
    res.json({ 
      message: 'Compra registrada com sucesso!',
      compra: result.rows[0]
    });
  } catch (err) {
    console.error('Erro ao registrar compra:', err);
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
    const result = await pool.query(
      'DELETE FROM vendas WHERE user_id = $1 AND product_id = $2 AND status = $3',
      [user_id, product_id, 'pago']
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Compra não encontrada' });
    }
    
    res.json({ message: 'Compra removida com sucesso!' });
  } catch (err) {
    console.error('Erro ao remover compra:', err);
    res.status(500).json({ error: 'Erro ao remover compra' });
  }
});

module.exports = router;