const pool = require('../database/connection');

class Product {
  static async create(productData) {
    const { 
      seller, title, description, price, category, tags = [], 
      images = [], files = [], license = 'pessoal', isFree = false, 
      status = 'rascunho', seo = {} 
    } = productData;
    
    const query = `
      INSERT INTO products (
        seller_id, title, description, price, category, tags, 
        images, files, license, is_free, status, seo, created_at
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW()) 
      RETURNING *
    `;
    
    const values = [
      seller, title, description, price, category, JSON.stringify(tags),
      JSON.stringify(images), JSON.stringify(files), license, isFree, 
      status, JSON.stringify(seo)
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT p.*, u.name as seller_name, u.email as seller_email
      FROM products p
      LEFT JOIN users u ON p.seller_id = u.id
      WHERE p.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findBySeller(sellerId) {
    const query = 'SELECT * FROM products WHERE seller_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [sellerId]);
    return result.rows;
  }

  static async findByCategory(category) {
    const query = 'SELECT * FROM products WHERE category = $1 AND status = $2 ORDER BY created_at DESC';
    const result = await pool.query(query, [category, 'ativo']);
    return result.rows;
  }

  static async findActive() {
    const query = 'SELECT * FROM products WHERE status = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, ['ativo']);
    return result.rows;
  }

  static async update(id, productData) {
    const { 
      title, description, price, category, tags, images, 
      files, license, isFree, status, seo 
    } = productData;
    
    const query = `
      UPDATE products 
      SET title = $1, description = $2, price = $3, category = $4, 
          tags = $5, images = $6, files = $7, license = $8, 
          is_free = $9, status = $10, seo = $11
      WHERE id = $12 
      RETURNING *
    `;
    
    const values = [
      title, description, price, category, JSON.stringify(tags),
      JSON.stringify(images), JSON.stringify(files), license, 
      isFree, status, JSON.stringify(seo), id
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Product;