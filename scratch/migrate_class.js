const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME
    });

    try {
        console.log("Adding student_class column...");
        await connection.query("ALTER TABLE users ADD COLUMN student_class VARCHAR(50) AFTER phone;");
        console.log("Migration successful!");
    } catch (err) {
        if (err.code === 'ER_DUP_COLUMN_NAME') {
            console.log("Column already exists.");
        } else {
            console.error("Migration failed:", err);
        }
    } finally {
        await connection.end();
    }
}

migrate();
