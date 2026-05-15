const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function migrate() {
    const envPath = path.join(__dirname, '..', '.env');
    const env = fs.readFileSync(envPath, 'utf8');
    const config = Object.fromEntries(
        env.split('\n')
           .filter(l => l.includes('=') && !l.startsWith('#'))
           .map(l => {
               const [key, ...rest] = l.split('=');
               return [key.trim(), rest.join('=').trim()];
           })
    );

    const connection = await mysql.createConnection({
        host: config.DATABASE_HOST || 'localhost',
        user: config.DATABASE_USER,
        password: config.DATABASE_PASSWORD,
        database: config.DATABASE_NAME
    });

    try {
        await connection.query("ALTER TABLE courses ADD COLUMN is_one_to_one TINYINT(1) DEFAULT 0");
        console.log("Migration successful: Added is_one_to_one column.");
    } catch (err) {
        if (err.code === 'ER_DUP_COLUMN_NAME') {
            console.log("Column is_one_to_one already exists.");
        } else {
            console.error("Migration failed:", err);
        }
    } finally {
        await connection.end();
    }
}

migrate();
