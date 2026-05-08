import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function createTeacher() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'prayog_india',
    socketPath: '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock'
  });

  const name = "Senior Faculty";
  const email = "teacher@prayogindia.in";
  const password = "Teacher@2026";
  const role = "teacher";

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await connection.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE role='teacher'",
      [name, email, hashedPassword, role]
    );
    console.log(`Teacher account created!`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } catch (error) {
    console.error("Error creating teacher:", error);
  } finally {
    await connection.end();
  }
}

createTeacher();
