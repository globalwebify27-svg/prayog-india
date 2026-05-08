import mysql from 'mysql2/promise';

async function checkSchema() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'prayog_india',
  });

  try {
    const [rows] = await connection.query("DESCRIBE courses");
    console.log("Courses schema:", JSON.stringify(rows, null, 2));
  } catch (error) {
    console.error("Error describing courses table:", error);
  } finally {
    await connection.end();
  }
}

checkSchema();
