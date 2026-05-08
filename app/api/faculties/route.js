import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT f.*, u.email, 
             GROUP_CONCAT(DISTINCT c.id) as selectedCourses,
             GROUP_CONCAT(DISTINCT ft.timing_id) as selectedTimings
      FROM faculties f 
      LEFT JOIN users u ON f.user_id = u.id
      LEFT JOIN courses c ON f.user_id = c.teacher_id
      LEFT JOIN faculty_timings ft ON f.id = ft.faculty_id
      GROUP BY f.id
      ORDER BY f.id DESC
    `);
    
    const faculties = rows.map(f => ({
      ...f,
      selectedCourses: f.selectedCourses ? f.selectedCourses.split(',').map(Number) : [],
      selectedTimings: f.selectedTimings ? f.selectedTimings.split(',').map(Number) : [],
      expertise: typeof f.expertise === 'string' ? JSON.parse(f.expertise) : f.expertise
    }));

    return NextResponse.json(faculties);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, email, password, role, specialty, image, bio, expertise, education, selectedCourses, selectedTimings } = await request.json();
    
    const hashedPassword = await bcrypt.hash(password || "Teacher@123", 10);
    const [userResult] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, 'teacher']
    );
    const userId = userResult.insertId;

    const [result] = await pool.query(
      "INSERT INTO faculties (name, role, specialty, image, bio, expertise, education, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, role, specialty, image, bio, JSON.stringify(expertise), education, userId]
    );
    const facultyId = result.insertId;

    if (selectedCourses && selectedCourses.length > 0) {
      await pool.query(
        "UPDATE courses SET teacher_id = ? WHERE id IN (?)",
        [userId, selectedCourses]
      );
    }

    if (selectedTimings && selectedTimings.length > 0) {
      const timingValues = selectedTimings.map(tId => [facultyId, tId]);
      await pool.query("INSERT INTO faculty_timings (faculty_id, timing_id) VALUES ?", [timingValues]);
    }

    return NextResponse.json({ success: true, id: facultyId });
  } catch (error) {
    console.error("Faculty POST Error:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ success: false, error: "Email already exists. Please use a unique institutional email." }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, name, email, password, role, specialty, image, bio, expertise, education, selectedCourses, selectedTimings } = await request.json();

    const [current] = await pool.query("SELECT user_id FROM faculties WHERE id = ?", [id]);
    const userId = current[0]?.user_id;

    if (userId) {
      let userQuery = "UPDATE users SET name = ?, email = ? WHERE id = ?";
      let userParams = [name, email, userId];

      if (password && password !== "********") {
        const hashedPassword = await bcrypt.hash(password, 10);
        userQuery = "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";
        userParams = [name, email, hashedPassword, userId];
      }
      await pool.query(userQuery, userParams);
    }

    await pool.query(
      "UPDATE faculties SET name = ?, role = ?, specialty = ?, image = ?, bio = ?, expertise = ?, education = ? WHERE id = ?",
      [name, role, specialty, image, bio, JSON.stringify(expertise), education, id]
    );

    if (userId) {
      await pool.query("UPDATE courses SET teacher_id = NULL WHERE teacher_id = ?", [userId]);
      if (selectedCourses && selectedCourses.length > 0) {
        await pool.query(
          "UPDATE courses SET teacher_id = ? WHERE id IN (?)",
          [userId, selectedCourses]
        );
      }
    }

    // Sync Timings
    await pool.query("DELETE FROM faculty_timings WHERE faculty_id = ?", [id]);
    if (selectedTimings && selectedTimings.length > 0) {
      const timingValues = selectedTimings.map(tId => [id, tId]);
      await pool.query("INSERT INTO faculty_timings (faculty_id, timing_id) VALUES ?", [timingValues]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Faculty PUT Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    const [faculty] = await pool.query("SELECT user_id FROM faculties WHERE id = ?", [id]);
    
    if (faculty.length > 0 && faculty[0].user_id) {
       await pool.query("DELETE FROM users WHERE id = ?", [faculty[0].user_id]);
    } else {
       await pool.query("DELETE FROM faculties WHERE id = ?", [id]);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Faculty DELETE Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
