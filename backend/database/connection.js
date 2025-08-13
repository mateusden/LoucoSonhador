const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',        // usuário PostgreSQL (era root)
  password: 'pacoquita',   // mesma senha
  database: 'louco_sonhador',
  port: 5432,
  // Para Supabase/produção:
  // connectionString: process.env.DATABASE_URL,
  // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Testar conexão
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database error:', err);
});

module.exports = pool;