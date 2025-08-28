require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const app = express();

// Pool PostgreSQL - Use APENAS connectionString OU configuração manual
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Versão mais limpa
async function testConnection() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  }
}
testConnection();

// Exporta pool
module.exports.pool = pool;

// CORS
app.use(cors({
  origin: [
    'http://localhost:3001',
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'http://localhost:5501',
    'http://127.0.0.1:3000',
    'http://192.168.0.62:5500',
    'http://192.168.0.89:5500',
    'http://192.168.0.89:3001',
    'http://192.168.0.89',
    'http://192.168.0.62',
    'http://localhost',
    'http://127.0.0.1',
    'https://loucosonhador.onrender.com'
  ],
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With']
}));

app.use(express.json());
app.use(cookieParser());

// Rotas API
const produtosRouter = require('./routes/products');
const usersRouter = require('./routes/users');
const downloadsRouter = require('./routes/downloads');
const carrinhoRouter = require('./routes/carrinho');
const wishlistRouter = require('./routes/wishlist');

app.use('/api/produtos', produtosRouter);
app.use('/api/users', usersRouter);
app.use('/api/downloads', downloadsRouter);
app.use('/api/carrinho', carrinhoRouter);
app.use('/api/wishlist', wishlistRouter);

// Rotas estáticas
app.use('/downloads', express.static(path.join(__dirname, 'public/downloads')));
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Porta dinâmica
const port = process.env.PORT || 3001;
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});


// Criar o transportador
const transporter = nodemailer.createTransporter({
    service: 'gmail', // ou 'outlook', 'yahoo', etc
    auth: {
        user: 'produtos.loucosonhador@gmail.com',
        pass: 'suasenhaDeApp' // NÃO é a senha normal!
    }
});