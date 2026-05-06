import pool from "../lib/db.js";
import bcrypt from "bcryptjs";

async function createAdmin() {
  try {
    console.log("Creating admin user...");
    
    const name = "Admin User";
    const email = "admin@prayogindia.in";
    const password = "admin123"; // You can change this
    const role = "admin";

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the admin user
    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    console.log("Admin user created successfully!");
    console.log("Email: " + email);
    console.log("Password: " + password);
    process.exit(0);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.log("Admin user already exists.");
    } else {
      console.error("Failed to create admin user:", err);
    }
    process.exit(1);
  }
}

createAdmin();
