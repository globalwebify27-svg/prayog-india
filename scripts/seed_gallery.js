
import mysql from 'mysql2/promise';

async function run() {
  const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });

  const images = [
    "/assets/m1.png", "/assets/m2.png", "/assets/m3.png", "/assets/m4.png", "/assets/m5.png",
    "/assets/indian-hero.png", "/assets/hero-indian-2.png", "/assets/course1.png"
  ];

  for (const img of images) {
    await pool.query(
      "INSERT INTO gallery (title, category, image_url, location) VALUES (?, ?, ?, ?)",
      ["Workshop Highlight", "Workshop Gallery", img, "Prayog India Campus"]
    );
  }
  console.log("Images inserted");
  process.exit(0);
}

run();
