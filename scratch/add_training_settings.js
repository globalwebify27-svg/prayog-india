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
        await connection.query("ALTER TABLE site_settings ADD COLUMN training_title TEXT, ADD COLUMN training_description TEXT, ADD COLUMN training_image TEXT, ADD COLUMN training_features TEXT");
        
        // Initialize with current values
        await connection.query(`
            UPDATE site_settings SET 
            training_title = 'Master Robotics with 1:1 Expert Training',
            training_description = 'Experience the future of learning with dedicated mentorship, tailored curricula, and hands-on industrial projects—designed exclusively for your pace and professional goals.',
            training_features = 'Individual Expert Attention,Customized Learning Paths,Live Industrial Projects,Flexible Session Scheduling,Direct Industry Exposure,Personalized Performance Tracking'
            WHERE id = 1
        `);

        console.log("Migration successful: Added training settings columns.");
    } catch (err) {
        if (err.code === 'ER_DUP_COLUMN_NAME') {
            console.log("Columns already exist.");
        } else {
            console.error("Migration failed:", err);
        }
    } finally {
        await connection.end();
    }
}

migrate();
