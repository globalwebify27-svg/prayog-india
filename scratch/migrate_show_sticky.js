const mysql = require("mysql2/promise");

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST || "localhost",
    user: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME || "prayog_india"
  });

  try {
    console.log("Checking if 'show_sticky' column exists in 'promos' table...");
    const [columns] = await connection.query("DESCRIBE promos");
    const hasShowSticky = columns.some(col => col.Field === "show_sticky");

    if (!hasShowSticky) {
      console.log("Adding 'show_sticky' column to 'promos' table...");
      await connection.query("ALTER TABLE promos ADD COLUMN show_sticky TINYINT(1) DEFAULT 1 AFTER is_active");
      console.log("Migration completed successfully!");
    } else {
      console.log("'show_sticky' column already exists. Skipping.");
    }
  } catch (err) {
    console.error("Migration failed:", err.message);
  } finally {
    await connection.end();
  }
}

migrate();
