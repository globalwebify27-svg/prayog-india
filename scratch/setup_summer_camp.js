const mysql = require('mysql2/promise');

async function setup() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'prayog_india'
    });

    try {
        console.log("1. Adding student_class column to users...");
        try {
            await connection.query("ALTER TABLE users ADD COLUMN student_class VARCHAR(50) AFTER phone;");
            console.log("Column added.");
        } catch (err) {
            if (err.code === 'ER_DUP_COLUMN_NAME') console.log("Column already exists.");
            else throw err;
        }

        console.log("2. Ensuring Summer Camp Course exists...");
        const [courses] = await connection.query("SELECT id FROM courses WHERE title = 'Robotics Summer Camp 2026'");
        let courseId;
        if (courses.length === 0) {
            const [result] = await connection.query(
                "INSERT INTO courses (title, description, price, type, duration) VALUES (?, ?, ?, ?, ?)",
                ["Robotics Summer Camp 2026", "A 15-day hands-on journey into the world of building and programming robots.", 2999, "offline", "15 Days"]
            );
            courseId = result.insertId;
            console.log("Course created with ID:", courseId);
        } else {
            courseId = courses[0].id;
            console.log("Course already exists with ID:", courseId);
        }

        console.log("3. Ensuring Batches exist...");
        const batches = [
            { name: "Morning Batch (8:00 AM - 11:00 AM)", schedule: "Mon-Sat 8:00 AM - 11:00 AM" },
            { name: "Evening Batch (4:00 PM - 7:00 PM)", schedule: "Mon-Sat 4:00 PM - 7:00 PM" }
        ];

        for (const b of batches) {
            const [existing] = await connection.query("SELECT id FROM batches WHERE course_id = ? AND name = ?", [courseId, b.name]);
            if (existing.length === 0) {
                await connection.query(
                    "INSERT INTO batches (course_id, name, schedule, type) VALUES (?, ?, ?, ?)",
                    [courseId, b.name, b.schedule, "offline"]
                );
                console.log(`Batch ${b.name} created.`);
            } else {
                console.log(`Batch ${b.name} already exists.`);
            }
        }

        console.log("Setup complete!");
    } catch (err) {
        console.error("Setup failed:", err);
    } finally {
        await connection.end();
    }
}

setup();
