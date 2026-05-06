import { generateIDCard } from "../lib/pdf.js";
import pool from "../lib/db.js";

async function testIDCard() {
  try {
    console.log("Generating sample ID card...");

    // Fetch first student or admin
    const [users] = await pool.query("SELECT * FROM users LIMIT 1");
    if (users.length === 0) {
      console.log("No users found to generate ID card.");
      process.exit(1);
    }

    const user = users[0];
    const pdfPath = await generateIDCard(
      user.name,
      `PI-${user.id}`,
      "Advanced Industrial Robotics",
      null, // No photo for now
      `sample_${user.id}`
    );

    console.log(`ID Card generated successfully at: ${pdfPath}`);
    process.exit(0);
  } catch (err) {
    console.error("ID Card generation failed:", err);
    process.exit(1);
  }
}

testIDCard();
