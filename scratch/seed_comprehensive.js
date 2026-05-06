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
  await conn.query('SET FOREIGN_KEY_CHECKS = 0');
  const tables = [
    'enrollments', 'installments', 'batches', 'course_materials', 
    'exams', 'exam_questions', 'exam_submissions', 'attendance', 
    'material_completions', 'courses'
  ];
  for (const table of tables) {
    await conn.query(`TRUNCATE TABLE ${table}`);
  }
  await conn.query('DELETE FROM users WHERE role = "student"');
  await conn.query('SET FOREIGN_KEY_CHECKS = 1');

  console.log('Seeding Comprehensive AI & ML Environment...');

  // 1. Insert Courses
  const [onlineCourse] = await conn.query(
    "INSERT INTO courses (title, description, price, type, duration, image) VALUES (?, ?, ?, ?, ?, ?)",
    [
      "AI & Machine Learning (Online Pro)",
      "Master Neural Networks, NLP, and Computer Vision from home. Includes high-performance cloud GPU access.",
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
      "AI & Machine Learning (Offline Hub)",
      "Intensive lab-based training at Prayog Hub. Work with NVIDIA Jetson kits and high-end workstations.",
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
    [onlineId, "Delta Batch (Online)", "Mon-Fri 07:00 PM - 09:00 PM", "online"]
  );
  const [offlineBatch] = await conn.query(
    "INSERT INTO batches (course_id, name, schedule, type) VALUES (?, ?, ?, ?)",
    [offlineId, "Alpha Batch (Offline Hub)", "Sat-Sun 10:00 AM - 02:00 PM", "offline"]
  );

  // 3. Insert Students
  const [aditi] = await conn.query(
    "INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)",
    ["Aditi Singh", "aditi@example.com", hashedPassword, "student", "9876543210"]
  );
  const aditiId = aditi.insertId;

  const [ahmed] = await conn.query(
    "INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)",
    ["Ahmed Khan", "ahmed@example.com", hashedPassword, "student", "8765432109"]
  );
  const ahmedId = ahmed.insertId;

  // 4. Enrollments & Installments
  const [aditiEnroll] = await conn.query(
    "INSERT INTO enrollments (user_id, course_id, batch_id, status, total_amount, amount_paid, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [aditiId, offlineId, offlineBatch.insertId, "active", 45000, 15000, "partial"]
  );
  
  await conn.query(
    "INSERT INTO enrollments (user_id, course_id, batch_id, status, total_amount, amount_paid, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [ahmedId, onlineId, onlineBatch.insertId, "active", 25000, 25000, "paid"]
  );

  // Installments for Aditi
  const installments = [
    [aditiEnroll.insertId, 15000, '2026-04-01', 'paid'],
    [aditiEnroll.insertId, 15000, '2026-05-01', 'pending'],
    [aditiEnroll.insertId, 15000, '2026-06-01', 'pending'],
  ];
  for (const inst of installments) {
    await conn.query("INSERT INTO installments (enrollment_id, amount, due_date, status) VALUES (?, ?, ?, ?)", inst);
  }

  // 5. Rich Course Materials
  const materials = [
    // Online Materials
    [onlineId, "01. Orientation & Cloud Setup", "step", "Instructions to access your cloud GPU instance.", 1, 0],
    [onlineId, "02. Mathematics for Deep Learning", "document", "https://mml-book.github.io/book/mml-book.pdf", 1, 0],
    [onlineId, "03. Python for AI: Performance Optimization", "video", "https://www.youtube.com/embed/rfscVS0vtbw", 1, 0],
    [onlineId, "04. Linear Algebra Mastery Quiz", "step", "Check your mathematical foundations.", 1, 0],
    [onlineId, "05. Neural Network Architectures (Locked)", "document", "https://arxiv.org/pdf/1512.03385.pdf", 2, 1],
    
    // Offline Materials
    [offlineId, "01. Hub Safety & Induction", "step", "Safety protocols for high-voltage server handling.", 1, 0],
    [offlineId, "02. Probability & Stats for ML", "document", "https://web.stanford.edu/class/archive/cs/cs109/cs109.1166/pdfs/CS109Notes.pdf", 1, 0],
    [offlineId, "03. Workshop: Data Wrangling with Pandas", "video", "https://www.youtube.com/embed/P_q0tkYqvSk", 1, 0],
    [offlineId, "04. Hub Access ID Generation", "step", "Follow these steps to generate your digital entry key.", 1, 0],
    [offlineId, "05. Computer Vision with NVIDIA Jetson (Locked)", "step", "Hardware setup for edge AI.", 2, 1],
  ];

  for (const m of materials) {
    await conn.query(
      "INSERT INTO course_materials (course_id, title, type, content, module_number, is_locked) VALUES (?, ?, ?, ?, ?, ?)",
      m
    );
  }

  // 6. Exams & Questions
  const [exam] = await conn.query(
    "INSERT INTO exams (course_id, title, description, duration, total_marks) VALUES (?, ?, ?, ?, ?)",
    [onlineId, "AI Foundations - Mid Term", "Covers Python, Linear Algebra, and Calculus foundations.", 45, 50]
  );
  const examId = exam.insertId;

  const questions = [
    [examId, "What is the primary function of an activation function in a Neural Network?", "objective", JSON.stringify(["To add non-linearity", "To multiply weights", "To calculate loss", "To normalize input"]), "To add non-linearity", 5, 1],
    [examId, "Explain the difference between Overfitting and Underfitting in your own words.", "subjective", null, null, 10, 2],
    [examId, "Which optimizer is most commonly used for Deep Learning tasks?", "objective", JSON.stringify(["Adam", "SGD", "RMSProp", "Adagrad"]), "Adam", 5, 3],
  ];

  for (const q of questions) {
    await conn.query(
      "INSERT INTO exam_questions (exam_id, question_text, type, options, correct_answer, marks, order_num) VALUES (?, ?, ?, ?, ?, ?, ?)",
      q
    );
  }

  // 7. Some Initial Progress (Aditi has completed first 2 materials)
  const [aditiMaterials] = await conn.query("SELECT id FROM course_materials WHERE course_id = ?", [offlineId]);
  await conn.query("INSERT INTO material_completions (student_id, material_id) VALUES (?, ?), (?, ?)", [aditiId, aditiMaterials[0].id, aditiId, aditiMaterials[1].id]);

  // 8. Attendance Logs
  await conn.query(
    "INSERT INTO attendance (user_id, course_id, date, type, latitude, longitude, selfie_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [aditiId, offlineId, '2026-04-30', "offline", 28.6139, 77.2090, "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200"]
  );

  console.log('Comprehensive environment seeded successfully!');
  await conn.end();
}

resetAndSeed().catch(console.error);
