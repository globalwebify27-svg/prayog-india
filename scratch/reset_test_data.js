const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function resetAndSeed() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'prayog_india',
  });

  const hashedPassword = await bcrypt.hash('password123', 10);

  console.log('Cleaning existing data...');
  // Order of deletion to respect foreign keys (if any)
  await conn.query('SET FOREIGN_KEY_CHECKS = 0');
  await conn.query('TRUNCATE TABLE enrollments');
  await conn.query('TRUNCATE TABLE installments');
  await conn.query('TRUNCATE TABLE batches');
  await conn.query('TRUNCATE TABLE course_materials');
  await conn.query('TRUNCATE TABLE exams');
  await conn.query('TRUNCATE TABLE exam_questions');
  await conn.query('TRUNCATE TABLE exam_submissions');
  await conn.query('TRUNCATE TABLE attendance');
  await conn.query('DELETE FROM courses');
  await conn.query('DELETE FROM users WHERE role = "student"');
  await conn.query('SET FOREIGN_KEY_CHECKS = 1');

  console.log('Seeding fresh AIML testing data...');

  // 1. Insert Courses
  const [onlineCourse] = await conn.query(
    "INSERT INTO courses (title, description, price, type, duration, image) VALUES (?, ?, ?, ?, ?, ?)",
    [
      "AI & Machine Learning (Online)",
      "Master AI and ML from anywhere with live interactive sessions and cloud-based labs.",
      25000,
      "online",
      "6 Months",
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
    ]
  );
  const onlineId = onlineCourse.insertId;

  const [offlineCourse] = await conn.query(
    "INSERT INTO courses (title, description, price, type, duration, image) VALUES (?, ?, ?, ?, ?, ?)",
    [
      "AI & Machine Learning (Offline)",
      "Advanced physical hub training with GPU workstations and in-person mentorship.",
      45000,
      "offline",
      "6 Months",
      "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&q=80&w=800"
    ]
  );
  const offlineId = offlineCourse.insertId;

  // 2. Insert Batches
  const [onlineBatch] = await conn.query(
    "INSERT INTO batches (course_id, name, schedule, type) VALUES (?, ?, ?, ?)",
    [onlineId, "Batch A (Online)", "Mon-Fri 07:00 PM", "online"]
  );
  const [offlineBatch] = await conn.query(
    "INSERT INTO batches (course_id, name, schedule, type) VALUES (?, ?, ?, ?)",
    [offlineId, "Batch B (Offline)", "Sat-Sun 10:00 AM", "offline"]
  );

  // 3. Insert Students
  const [aditi] = await conn.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    ["Aditi Singh", "aditi@example.com", hashedPassword, "student"]
  );
  const [ahmed] = await conn.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    ["Ahmed Khan", "ahmed@example.com", hashedPassword, "student"]
  );

  // 4. Enrollments
  await conn.query(
    "INSERT INTO enrollments (user_id, course_id, batch_id, status, total_amount) VALUES (?, ?, ?, ?, ?)",
    [aditi.insertId, offlineId, offlineBatch.insertId, "active", 45000]
  );
  await conn.query(
    "INSERT INTO enrollments (user_id, course_id, batch_id, status, total_amount) VALUES (?, ?, ?, ?, ?)",
    [ahmed.insertId, onlineId, onlineBatch.insertId, "active", 25000]
  );

  // 5. Materials
  const materials = [
    [onlineId, "01. Introduction to AI", "step", "Welcome to the world of AI.", 1],
    [onlineId, "02. Python Basics for ML", "video", "https://www.youtube.com/embed/rfscVS0vtbw", 1],
    [offlineId, "01. Hub Induction", "step", "Safety protocols for GPU lab.", 1],
    [offlineId, "02. Statistics Handbook", "document", "https://web.stanford.edu/class/archive/cs/cs109/cs109.1166/pdfs/CS109Notes.pdf", 1],
  ];

  for (const m of materials) {
    await conn.query(
      "INSERT INTO course_materials (course_id, title, type, content, module_number) VALUES (?, ?, ?, ?, ?)",
      m
    );
  }

  console.log('Database reset and AIML testing data seeded successfully!');
  await conn.end();
}

resetAndSeed().catch(console.error);
