const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Default XAMPP password is empty
  database: 'chatbot_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
  } else {
    console.log('📦 Connected to MySQL Database!');
    connection.release();
  }
});

module.exports = pool.promise();
