import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // Modifique essa linha

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL não definida!');
  process.exit(1);
}

const pool = new Pool({
  host: 'd12f821c15ab.ngrok-free.app',
  port: 5432,
  user: 'postgres',
  password: 'crush nothing chest fiscal faint never',
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
   connectionTimeout: 30000, // aumenta o tempo de conexão para 30 segundos
});


async function testar() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    console.log('✅ Conexão funcionando! Hora do DB:', res.rows[0].now);
    client.release();
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro na conexão:', err);
    process.exit(1);
  }
}

testar();