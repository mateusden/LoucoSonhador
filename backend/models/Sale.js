const pool = require('../database/connection');

class Sale {
  static async create(saleData) {
    const { 
      product, buyer, seller, price, 
      status = 'pendente', downloadCount = 0 
    } = saleData;
    
    const query = `
      INSERT INTO sales (
        product_id, buyer_id, seller_id, price, 
        date, status, download_count
      ) 
      VALUES ($1, $2, $3, $4, NOW(), $5, $6) 
      RETURNING *
    `;
    
    const values = [product, buyer, seller, price, status, downloadCount];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT s.*, 
             p.title as product_title,
             u1.name as buyer_name, u1.email as buyer_email,
             u2.name as seller_name, u2.email as seller_email
      FROM sales s
      LEFT JOIN products p ON s.product_id = p.id
      LEFT JOIN users u1 ON s.buyer_id = u1.id
      LEFT JOIN users u2 ON s.seller_id = u2.id
      WHERE s.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByBuyer(buyerId) {
    const query = `
      SELECT s.*, p.title as product_title, p.files
      FROM sales s
      LEFT JOIN products p ON s.product_id = p.id
      WHERE s.buyer_id = $1 AND s.status = 'pago'
      ORDER BY s.date DESC
    `;
    const result = await pool.query(query, [buyerId]);
    return result.rows;
  }

  static async findBySeller(sellerId) {
    const query = `
      SELECT s.*, p.title as product_title, u.name as buyer_name
      FROM sales s
      LEFT JOIN products p ON s.product_id = p.id
      LEFT JOIN users u ON s.buyer_id = u.id
      WHERE s.seller_id = $1
      ORDER BY s.date DESC
    `;
    const result = await pool.query(query, [sellerId]);
    return result.rows;
  }

  static async updateStatus(id, status) {
    const query = 'UPDATE sales SET status = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  static async incrementDownload(id) {
    const query = 'UPDATE sales SET download_count = download_count + 1 WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getSellerStats(sellerId) {
    const query = `
      SELECT 
        COUNT(*) as total_sales,
        SUM(price) as total_revenue,
        COUNT(CASE WHEN status = 'pago' THEN 1 END) as paid_sales,
        COUNT(CASE WHEN status = 'pendente' THEN 1 END) as pending_sales
      FROM sales 
      WHERE seller_id = $1
    `;
    const result = await pool.query(query, [sellerId]);
    return result.rows[0];
  }
}

module.exports = Sale;
