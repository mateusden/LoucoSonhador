const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Configuração CORS (igual antes)
app.use(cors({
  origin: [
    // teus domínios aqui...
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

// Rotas API (do jeito que tu já tem)
app.use('/api/produtos', require('./routes/products'));
app.use('/api/users', require('./routes/users'));
app.use('/api/downloads', require('./routes/downloads'));
app.use('/downloads', express.static(path.join(__dirname, 'public/downloads')));
app.use('/api/carrinho', require('./routes/carrinho'));
app.use('/api/wishlist', require('./routes/wishlist'));

app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));


// Serve os arquivos estáticos e outros HTMLs dentro da pasta public
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve index.html que está na raiz na rota '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Porta dinâmica do Render
const port = process.env.PORT || 3001;
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${port}`);
});
