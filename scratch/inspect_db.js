const mysql = require('mysql2/promise');

async function inspect() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'prayog_india',
  });

  const [tables] = await connection.query('SHOW TABLES');
  console.log('Tables:', tables);

  for (const tableRow of tables) {
    const tableName = Object.values(tableRow)[0];
    const [columns] = await connection.query(`DESCRIBE ${tableName}`);
    console.log(`\nTable: ${tableName}`);
    console.table(columns);
  }

  await connection.end();
}

inspect().catch(console.error);
