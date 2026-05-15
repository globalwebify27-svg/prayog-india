const fs = require('fs');
const mysql = require('mysql2/promise');

// Simple .env parser
function loadEnv() {
  const envPath = './.env';
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    });
  }
}

loadEnv();

async function migrate() {
  const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });

  try {
    console.log('Adding columns to courses table...');
    
    const [columns] = await pool.query("SHOW COLUMNS FROM courses");
    const columnNames = columns.map(c => c.Field);
    
    if (!columnNames.includes('outcomes')) {
      await pool.query("ALTER TABLE courses ADD COLUMN outcomes TEXT");
      console.log('Added outcomes column');
    }
    if (!columnNames.includes('certification')) {
      await pool.query("ALTER TABLE courses ADD COLUMN certification TEXT");
      console.log('Added certification column');
    }
    if (!columnNames.includes('who_can_join')) {
      await pool.query("ALTER TABLE courses ADD COLUMN who_can_join TEXT");
      console.log('Added who_can_join column');
    }
    if (!columnNames.includes('methodology')) {
      await pool.query("ALTER TABLE courses ADD COLUMN methodology TEXT");
      console.log('Added methodology column');
    }

    console.log('Migration successful!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
