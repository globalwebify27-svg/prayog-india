const mysql = require('mysql2/promise');

async function seed() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'prayog_india',
  });

  console.log('Seeding AIML courses...');

  // 1. Insert Courses
  const [onlineCourse] = await conn.query(
    "INSERT INTO courses (title, description, price, type, duration, image) VALUES (?, ?, ?, ?, ?, ?)",
    [
      "Artificial Intelligence & Machine Learning (Online Pro)",
      "Comprehensive mastery of Neural Networks, Deep Learning, and Computer Vision. Includes live industry projects.",
      24999.00,
      "online",
      "6 Months",
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
    ]
  );
  const onlineId = onlineCourse.insertId;

  const [offlineCourse] = await conn.query(
    "INSERT INTO courses (title, description, price, type, duration, image) VALUES (?, ?, ?, ?, ?, ?)",
    [
      "Artificial Intelligence & Machine Learning (Offline Hub)",
      "Hands-on physical lab sessions with high-performance GPU workstations. Direct mentorship at Prayog India Hubs.",
      45999.00,
      "offline",
      "6 Months",
      "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&q=80&w=800"
    ]
  );
  const offlineId = offlineCourse.insertId;

  // 2. Insert Batches
  await conn.query(
    "INSERT INTO batches (course_id, name, schedule, type) VALUES (?, ?, ?, ?)",
    [onlineId, "AIML Online - Evening Delta", "Mon-Fri 07:00 PM - 09:00 PM", "online"]
  );

  await conn.query(
    "INSERT INTO batches (course_id, name, schedule, type) VALUES (?, ?, ?, ?)",
    [offlineId, "AIML Offline - Weekend Alpha", "Sat-Sun 10:00 AM - 02:00 PM", "offline"]
  );

  // 3. Insert Materials for Online
  const onlineMaterials = [
    ["Welcome & Environment Setup", "step", "Install Anaconda and set up your NVIDIA CUDA environment.", 1],
    ["Mathematics for ML - Foundation PDF", "document", "https://www.overleaf.com/learn/latex/Main_Page", 1],
    ["Python for Data Science Crash Course", "video", "https://www.youtube.com/embed/rfscVS0vtbw", 1],
    ["Linear Regression Implementation", "step", "Build your first predictive model using Scikit-Learn.", 2],
    ["Neural Network Architectures", "document", "https://arxiv.org/pdf/1512.03385.pdf", 2],
  ];

  for (const m of onlineMaterials) {
    await conn.query(
      "INSERT INTO course_materials (course_id, title, type, content, module_number, is_locked) VALUES (?, ?, ?, ?, ?, ?)",
      [onlineId, m[0], m[1], m[2], m[3], 0]
    );
  }

  // 4. Insert Materials for Offline
  const offlineMaterials = [
    ["Hub Induction & Hardware Safety", "step", "Safety protocols for using GPU servers and workstation handling.", 1],
    ["Probability & Statistics for AI", "document", "https://web.stanford.edu/class/archive/cs/cs109/cs109.1166/pdfs/CS109Notes.pdf", 1],
    ["Live Workshop: Data Wrangling", "video", "https://www.youtube.com/embed/P_q0tkYqvSk", 1],
    ["Computer Vision with OpenCV", "step", "Real-time object detection workshop using hub cameras.", 2],
    ["Advanced NLP with Transformers", "document", "https://jalammar.github.io/illustrated-transformer/", 2],
  ];

  for (const m of offlineMaterials) {
    await conn.query(
      "INSERT INTO course_materials (course_id, title, type, content, module_number, is_locked) VALUES (?, ?, ?, ?, ?, ?)",
      [offlineId, m[0], m[1], m[2], m[3], 0]
    );
  }

  console.log('Seeding complete! AIML courses, batches, and materials are ready.');
  await conn.end();
}

seed().catch(console.error);
