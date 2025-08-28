const express = require('express');
const router = express.Router();
const { pool } = require('../database/connection'); // ← MUDANÇA: { pool }
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const autenticarToken = require('../middleware/auth');

const SECRET = 'euodeiogostarde1pacoquita';

// Cadastro
router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  
  try {
    const hash = await bcrypt.hash(senha, 10);
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
        [nome, email, hash]
      );
      
      const novoUsuario = result.rows[0];
      res.status(201).json({ 
        id: novoUsuario.id, 
        nome: novoUsuario.nome, 
        email: novoUsuario.email 
      });
    } finally {
      client.release(); // Sempre executa
    }
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.status(400).json({ error: 'Erro ao cadastrar usuário' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  let client;
  
  try {
    client = await pool.connect();
    const result = await client.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }
    
    const usuario = result.rows[0];
    const match = await bcrypt.compare(senha, usuario.senha);
    
    if (!match) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email }, 
      SECRET, 
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
      domain: undefined,
      path: '/'
    });
    
    res.json({ 
      message: 'Login realizado com sucesso!',
      user: { id: usuario.id, nome: usuario.nome, email: usuario.email }
    });
    
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    // Garante que o client seja sempre liberado
    if (client) {
      client.release();
    }
  }
});
// Perfil (rota protegida)
router.get('/perfil', autenticarToken, async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT id, nome, email, nascimento, genero FROM usuarios WHERE id = $1', 
      [req.user.id]
    );
    client.release();
    
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
    
    const client = await pool.connect();
    const result = await client.query(sql, valores);
    client.release();
    
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
    const client = await pool.connect();
    
    // Busca usuário atual
    const result = await client.query('SELECT * FROM usuarios WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      client.release();
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    const usuario = result.rows[0];
    
    // Verifica senha atual
    const match = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!match) {
      client.release();
      return res.status(401).json({ error: 'Senha atual incorreta' });
    }
    
    // Atualiza senha
    const hash = await bcrypt.hash(novaSenha, 10);
    await client.query('UPDATE usuarios SET senha = $1 WHERE id = $2', [hash, req.user.id]);
    client.release();
    
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

// Resumo de compras do usuário logado
router.get('/resumo-compras', autenticarToken, async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT COUNT(*) as total_produtos, SUM(preco) as total_gasto FROM vendas WHERE user_id = $1 AND status = $2',
      [req.user.id, 'pago']
    );
    client.release();
    
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
    const client = await pool.connect();
    const result = await client.query(`
      SELECT p.id, p.nome, p.imagem, p.arquivo, v.data_compra, v.preco
      FROM vendas v
      JOIN produtos p ON v.product_id = p.id
      WHERE v.user_id = $1 AND v.status = $2
      ORDER BY v.data_compra DESC
    `, [req.user.id, 'pago']);
    client.release();
    
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
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO vendas (user_id, product_id, preco, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, product_id, preco, 'pago']
    );
    client.release();
    
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
    const client = await pool.connect();
    const result = await client.query(
      'DELETE FROM vendas WHERE user_id = $1 AND product_id = $2 AND status = $3',
      [user_id, product_id, 'pago']
    );
    client.release();
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Compra não encontrada' });
    }
    
    res.json({ message: 'Compra removida com sucesso!' });
  } catch (err) {
    console.error('Erro ao remover compra:', err);
    res.status(500).json({ error: 'Erro ao remover compra' });
  }
});

// Endpoint para solicitar reset (Node.js/Express exemplo)
router.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  // Verificar se email existe no banco
  const user = await User.findOne({ email });
  if (!user) {
      return res.json({ success: false, message: 'Email não encontrado' });
  }
  
  // Gerar token único
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = Date.now() + 3600000; // 1 hora
  
  // Salvar token no banco
  await User.updateOne(
      { email },
      { 
          resetToken: resetToken,
          resetTokenExpiry: resetTokenExpiry 
      }
  );
  
  // Enviar email com link
  const resetLink = `https://loucosonhador.onrender.com/reset-password?token=${resetToken}`;
  
  // Usar serviço de email (Nodemailer, SendGrid, etc)
  await enviarEmail({
      to: email,
      subject: 'Recuperação de Senha',
      html: `
          <h2>Recuperação de Senha</h2>
          <p>Clique no link abaixo para redefinir sua senha:</p>
          <a href="${resetLink}">Redefinir Senha</a>
          <p>Este link expira em 1 hora.</p>
      `
  });
  
  res.json({ success: true, message: 'Email enviado com sucesso' });
});

// Endpoint para redefinir senha
router.post('/api/reset-password', async (req, res) => {
  const { token, novaSenha } = req.body;
  
  // Buscar usuário pelo token válido
  const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() } // Token não expirado
  });
  
  if (!user) {
      return res.json({ 
          success: false, 
          message: 'Token inválido ou expirado' 
      });
  }
  
  // Criptografar nova senha
  const senhaCriptografada = await bcrypt.hash(novaSenha, 10);
  
  // Atualizar senha e limpar token
  await User.updateOne(
      { _id: user._id },
      {
          senha: senhaCriptografada,
          resetToken: null,
          resetTokenExpiry: null
      }
  );
  
  res.json({ success: true, message: 'Senha alterada com sucesso' });
});

module.exports = router;