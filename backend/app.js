const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const carrinhoRoutes = require('./routes/carrinho');
const wishlistRoutes = require('./routes/wishlist');
const produtosRoutes = require('./routes/products');

// Servir arquivos estáticos da pasta public
app.use(express.static(__dirname + '/../public'));

// Substitua a configuração atual do CORS por essa:
app.use(cors({
  origin: [
    'http://localhost:3001',
    'http://127.0.0.1:5500',    // Live Server
    'http://localhost:5500',    // Variação do Live Server
    'http://localhost:5501',    // Caso use outra porta
    'http://127.0.0.1:3000',    // Variação do localhost
    'http://192.168.0.62:5500',
    'http://192.168.0.89:5500',
    'http://192.168.0.89:3001',
    // Adicionar variações para dispositivos móveis
    'http://192.168.0.89',
    'http://192.168.0.62',
    'http://localhost',
    'http://127.0.0.1'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));





app.use(express.json());
app.use(cookieParser());

app.use('/api/produtos', produtosRoutes);
app.use('/api/users', require('./routes/users'));
app.use('/api/downloads', require('./routes/downloads'));
app.use('/downloads', express.static(__dirname + '/public/downloads'));
app.use('/api/carrinho', carrinhoRoutes);
app.use('/api/wishlist', wishlistRoutes);

app.listen(3001, '0.0.0.0', () => {
  console.log('Servidor rodando na porta 3001');
});