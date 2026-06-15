const mysql = require('mysql2/promise');

async function checkSchema() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'prayog_india'
  });

  try {
    const [tables] = await connection.query('SHOW TABLES');
    console.log('Tables:', tables);
    
    try {
      const [rows] = await connection.query('DESCRIBE stories');
      console.log('stories DESCRIBE:', JSON.stringify(rows, null, 2));
      const [records] = await connection.query('SELECT id, title, slug FROM stories');
      console.log('stories records:', records);
    } catch (e) {
      console.log('Error describing/querying stories:', e.message);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await connection.end();
  }
}

checkSchema();
