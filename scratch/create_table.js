const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'prayog_india',
  });

  await conn.query(`
    CREATE TABLE IF NOT EXISTS course_materials (
      id INT PRIMARY KEY AUTO_INCREMENT,
      course_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      type ENUM('document', 'video', 'link', 'step') NOT NULL,
      content TEXT,
      module_number INT DEFAULT 1,
      is_locked BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    )
  `);

  console.log('Table course_materials created successfully');
  await conn.end();
}

run().catch(console.error);
