const { Pool } = require('pg');

const pool = new Pool({
  // Configuração para produção (Render + Supabase)
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  
  // Configuração para desenvolvimento local (comentada)
  // host: 'localhost',
  // user: 'postgres',
  // password: 'pacoquita',
  // database: 'louco_sonhador',
  // port: 5432,
  
  // Configurações do pool
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Função helper para queries
async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

// Teste de conexão
async function testConnection() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    console.log('✅ Banco conectado! Hora:', res.rows[0].now);
    console.log('🌍 Ambiente:', process.env.NODE_ENV || 'development');
    client.release();
  } catch (err) {
    console.error('❌ Erro na conexão:', err.message);
  }
}

// Event listeners
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database error:', err);
});

module.exports = {
  pool,
  query,
  testConnection
};