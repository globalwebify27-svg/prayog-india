import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Parse .env manually
const envPath = path.resolve(process.cwd(), '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

async function updateImages() {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  const [rows] = await pool.query('SELECT slug, content FROM pages');
  
  for (const row of rows) {
    let content = typeof row.content === 'string' ? JSON.parse(row.content) : row.content;
    
    if (row.slug === 'training') {
      content.heroImage = '/assets/hero-indian-2.png';
    } else if (row.slug === 'one-on-one') {
      content.heroImage = '/assets/one_on_one_robotics_training.png';
    } else if (row.slug === 'internships') {
      content.heroImage = '/assets/internship.png';
    }
    
    await pool.query('UPDATE pages SET content = ? WHERE slug = ?', [JSON.stringify(content), row.slug]);
    console.log(`Updated images for ${row.slug}`);
  }
  
  process.exit(0);
}

updateImages();
