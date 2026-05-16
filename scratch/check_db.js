const pool = require('./lib/db');

async function checkColumns() {
  try {
    const [rows] = await pool.query("SHOW COLUMNS FROM users");
    console.log(rows.map(r => r.Field));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkColumns();
