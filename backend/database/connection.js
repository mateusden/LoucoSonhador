const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',      // troque pelo seu usuário do MySQL
  password: 'pacoquita',    // troque pela sua senha do MySQL
  database: 'louco_sonhador'
});

module.exports = pool;