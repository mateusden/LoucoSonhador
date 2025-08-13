// app.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Pool PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // obrigatório Supabase
});

// Testa a conexão
async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Banco conectado! Hora:', res.rows[0].now);
  } catch (err) {
    console.error('Erro na conexão:', err);
  }
}
testConnection();

// Exporta pool
export { pool };

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
app.use('/api/produtos', (await import('./routes/products.js')).default);
app.use('/api/users', (await import('./routes/users.js')).default);
app.use('/api/downloads', (await import('./routes/downloads.js')).default);
app.use('/api/carrinho', (await import('./routes/carrinho.js')).default);
app.use('/api/wishlist', (await import('./routes/wishlist.js')).default);

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
  console.log(`Servidor rodando na porta ${port}`);
});
