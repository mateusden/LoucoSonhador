const pool = require('../database/connection');

class User {
  static async create(userData) {
    const { name, email, password, role = 'seller', bankData = {} } = userData;
    
    const query = `
      INSERT INTO users (name, email, password, role, bank_data, created_at) 
      VALUES ($1, $2, $3, $4, $5, NOW()) 
      RETURNING *
    `;
    
    const values = [name, email, password, role, JSON.stringify(bankData)];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async update(id, userData) {
    const { name, email, role, bankData } = userData;
    
    const query = `
      UPDATE users 
      SET name = $1, email = $2, role = $3, bank_data = $4
      WHERE id = $5 
      RETURNING *
    `;
    
    const values = [name, email, role, JSON.stringify(bankData), id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = User;