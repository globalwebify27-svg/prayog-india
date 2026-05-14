const mysql = require('mysql2/promise');

async function seed() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'prayog_india'
  });

  try {
    // 1. Alumni Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS placement_alumni (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        company VARCHAR(255),
        image_url VARCHAR(255),
        story TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Partners Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS placement_partners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Stats Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS placement_stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        label VARCHAR(255) NOT NULL,
        value VARCHAR(100),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed Data
    await connection.query("DELETE FROM placement_alumni");
    await connection.query(`
      INSERT INTO placement_alumni (name, role, company, image_url, story) VALUES
      ('Amitabh Singh', 'Robotics Engineer', 'ABB India', '/assets/t1.png', "Prayog India's hands-on lab sessions were the key to clearing my technical rounds at ABB."),
      ('Neha Kapoor', 'AI Developer', 'TCS', '/assets/t2.png', "The Computer Vision specialization helped me transition from general software to elite AI roles."),
      ('Rohan Varma', 'UAV Designer', 'IdeaForge', '/assets/t3.png', "The internship residency at the Mumbai hub gave me the real-world experience I needed for aerospace.")
    `);

    await connection.query("DELETE FROM placement_partners");
    await connection.query(`
      INSERT INTO placement_partners (name) VALUES
      ('ABB Robotics'), ('KUKA'), ('Fanuc'), ('Yaskawa'), ('Tesla'), ('DRDO'), ('ISRO'), ('Tata Motors'), ('Reliance Industries')
    `);

    await connection.query("DELETE FROM placement_stats");
    await connection.query(`
      INSERT INTO placement_stats (label, value, description) VALUES
      ('Placement Rate', '94%', 'Of our certified students get hired within 6 months.'),
      ('Avg CTC', '₹6.5 LPA', 'For entry-level industrial robotics roles.'),
      ('Global Network', '50+', 'Industrial partners and research laboratories.'),
      ('Highest Package', '₹18 LPA', 'For Advanced AI & Robotics specialization.')
    `);

    console.log("Placement tables created and seeded successfully!");
  } catch (error) {
    console.error("Seeding placements failed:", error);
  } finally {
    await connection.end();
  }
}

seed();
