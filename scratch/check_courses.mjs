import mysql from 'mysql2/promise';

async function checkTable() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'prayog_india',
  });

  try {
    const [rows] = await connection.query("SELECT * FROM courses");
    console.log("Courses in DB:", JSON.stringify(rows, null, 2));
  } catch (error) {
    console.error("Error checking courses table:", error);
  } finally {
    await connection.end();
  }
}

checkTable();
