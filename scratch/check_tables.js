const pool = require('./lib/db');

async function checkTables() {
  try {
    const [rows] = await pool.query("SHOW TABLES");
    console.log(rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkTables();
