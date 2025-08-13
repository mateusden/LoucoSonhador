const { pool } = require('../database/connection'); // ← MUDANÇA: { pool }

class Payment {
  static async create(paymentData) {
    const { 
      seller, amount, method, 
      status = 'pendente' 
    } = paymentData;
    
    const query = `
      INSERT INTO payments (seller_id, amount, status, method, requested_at) 
      VALUES ($1, $2, $3, $4, NOW()) 
      RETURNING *
    `;
    
    const values = [seller, amount, status, method];
    
    const client = await pool.connect();
    try {
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findById(id) {
    const query = `
      SELECT p.*, u.name as seller_name, u.email as seller_email, u.bank_data
      FROM payments p
      LEFT JOIN users u ON p.seller_id = u.id
      WHERE p.id = $1
    `;
    
    const client = await pool.connect();
    try {
      const result = await client.query(query, [id]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findBySeller(sellerId) {
    const query = 'SELECT * FROM payments WHERE seller_id = $1 ORDER BY requested_at DESC';
    
    const client = await pool.connect();
    try {
      const result = await client.query(query, [sellerId]);
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async findPending() {
    const query = `
      SELECT p.*, u.name as seller_name, u.bank_data
      FROM payments p
      LEFT JOIN users u ON p.seller_id = u.id
      WHERE p.status = 'pendente'
      ORDER BY p.requested_at ASC
    `;
    
    const client = await pool.connect();
    try {
      const result = await client.query(query);
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async markAsPaid(id) {
    const query = 'UPDATE payments SET status = $1, paid_at = NOW() WHERE id = $2 RETURNING *';
    
    const client = await pool.connect();
    try {
      const result = await client.query(query, ['pago', id]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async updateStatus(id, status) {
    const query = 'UPDATE payments SET status = $1 WHERE id = $2 RETURNING *';
    
    const client = await pool.connect();
    try {
      const result = await client.query(query, [status, id]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}

module.exports = Payment;