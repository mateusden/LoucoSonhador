const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Rotas importadas
const carrinhoRoutes = require('./routes/carrinho.js');
const wishlistRoutes = require('./routes/wishlist');
const produtosRoutes = require('./routes/products');

// Configuração CORS
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
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(cookieParser());

// Rotas API
app.use('/api/produtos', produtosRoutes);
app.use('/api/users', require('./routes/users'));
app.use('/api/downloads', require('./routes/downloads'));
app.use('/downloads', express.static(path.join(__dirname, 'public/downloads')));
app.use('/api/carrinho', carrinhoRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Serve arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal para servir index.html na raiz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Porta dinâmica para Render
const port = process.env.PORT || 3001;
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${port}`);
});
