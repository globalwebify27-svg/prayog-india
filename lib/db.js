import mysql from "mysql2/promise";

// Prevent multiple pools in development
const pool = global.mysqlPool || mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Adjust based on your DB plan
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

if (process.env.NODE_ENV !== "production") {
  global.mysqlPool = pool;
}

export default pool;
