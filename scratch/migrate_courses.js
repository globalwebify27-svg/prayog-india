const mysql = require('mysql2/promise');

async function migrate() {
  // Use hardcoded defaults based on viewed .env
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'prayog_india',
  });

  try {
    console.log('Migrating courses table...');
    // MySQL 8.0.19+ supports IF NOT EXISTS for columns in some contexts, 
    // but for ALTER TABLE it's safer to just try and catch the error if it already exists
    try {
      await connection.execute(`ALTER TABLE courses ADD COLUMN allow_partial_payment TINYINT(1) DEFAULT 0`);
      console.log('Added allow_partial_payment');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log('allow_partial_payment already exists');
      else throw e;
    }

    try {
      await connection.execute(`ALTER TABLE courses ADD COLUMN installments_count INT DEFAULT 1`);
      console.log('Added installments_count');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log('installments_count already exists');
      else throw e;
    }

    console.log('Migration successful!');
  } catch (error) {
    console.error('Migration failed:', error.message);
  } finally {
    await connection.end();
  }
}

migrate();
