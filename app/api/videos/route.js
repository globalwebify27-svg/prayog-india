import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Auto create videos table and seed default videos if empty
async function initTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS videos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL DEFAULT 'Reel',
        youtube_url VARCHAR(500) NOT NULL,
        video_id VARCHAR(100) NOT NULL,
        thumbnail VARCHAR(500),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const initialVideos = [
      {
        title: "Robotics in Action #1",
        category: "Reel",
        youtube_url: "https://youtube.com/shorts/Hc1Y2xe8tP8",
        video_id: "Hc1Y2xe8tP8",
        thumbnail: "https://img.youtube.com/vi/Hc1Y2xe8tP8/hqdefault.jpg",
        description: "Student hands-on robotics testing in lab"
      },
      {
        title: "Student Project Demo #2",
        category: "Reel",
        youtube_url: "https://youtube.com/shorts/Ychi5tA2UTY",
        video_id: "Ychi5tA2UTY",
        thumbnail: "https://img.youtube.com/vi/Ychi5tA2UTY/hqdefault.jpg",
        description: "IoT controlled robotic arm demo"
      },
      {
        title: "Hands-on Workshop #3",
        category: "Reel",
        youtube_url: "https://youtube.com/shorts/iG8phPg9hZk",
        video_id: "iG8phPg9hZk",
        thumbnail: "https://img.youtube.com/vi/iG8phPg9hZk/hqdefault.jpg",
        description: "Drone assembly workshop highlights"
      },
      {
        title: "Prayog India Robotics Overview",
        category: "Overview",
        youtube_url: "https://youtu.be/Ebg0dNMWjCI",
        video_id: "Ebg0dNMWjCI",
        thumbnail: "https://img.youtube.com/vi/Ebg0dNMWjCI/hqdefault.jpg",
        description: "Experience the innovation, hands-on training, and technology journey at Prayog India Robotics."
      },
      {
        title: "Innovators of Tomorrow",
        category: "Overview",
        youtube_url: "https://youtu.be/DnFMfuMgDG4",
        video_id: "DnFMfuMgDG4",
        thumbnail: "https://img.youtube.com/vi/DnFMfuMgDG4/hqdefault.jpg",
        description: "Hear directly from our students about their learning journey and breakthroughs."
      },
      {
        title: "Student Experience & Review Spotlight",
        category: "Testimonial",
        youtube_url: "https://youtu.be/DnFMfuMgDG4",
        video_id: "DnFMfuMgDG4",
        thumbnail: "https://img.youtube.com/vi/DnFMfuMgDG4/hqdefault.jpg",
        description: "Watch how our robotics training catalyzed our students' technical careers."
      },
      {
        title: "Doordarshan (DD News) - Ranchi Robotics Hub",
        category: "Media",
        youtube_url: "https://youtu.be/YjQAUG1oTGQ",
        video_id: "YjQAUG1oTGQ",
        thumbnail: "https://img.youtube.com/vi/YjQAUG1oTGQ/hqdefault.jpg",
        description: "Doordarshan (DD News) broadcast feature on Prayog India Robotics."
      }
    ];

    for (const v of initialVideos) {
      const [existing] = await pool.query("SELECT id FROM videos WHERE video_id = ? AND category = ?", [v.video_id, v.category]);
      if (existing.length === 0) {
        await pool.query(
          "INSERT INTO videos (title, category, youtube_url, video_id, thumbnail, description) VALUES (?, ?, ?, ?, ?, ?)",
          [v.title, v.category, v.youtube_url, v.video_id, v.thumbnail, v.description]
        );
      }
    }
  } catch (e) {
    console.error("Table init error:", e);
  }
}

// Helper to extract YouTube ID
function extractYouTubeId(url) {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : url.trim();
}

export async function GET(req) {
  try {
    await initTable();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let query = "SELECT * FROM videos";
    let params = [];

    if (category && category !== "All") {
      query += " WHERE category = ?";
      params.push(category);
    }

    query += " ORDER BY created_at DESC";

    const [rows] = await pool.query(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await initTable();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { title, category, youtube_url, description } = await req.json();

    const videoId = extractYouTubeId(youtube_url);
    const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    const [result] = await pool.query(
      "INSERT INTO videos (title, category, youtube_url, video_id, thumbnail, description) VALUES (?, ?, ?, ?, ?, ?)",
      [title, category || 'Reel', youtube_url, videoId, thumbnail, description || '']
    );

    return NextResponse.json({
      success: true,
      message: "Video added successfully",
      id: result.insertId
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await initTable();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { id, title, category, youtube_url, description } = await req.json();

    const videoId = extractYouTubeId(youtube_url);
    const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    await pool.query(
      "UPDATE videos SET title = ?, category = ?, youtube_url = ?, video_id = ?, thumbnail = ?, description = ? WHERE id = ?",
      [title, category, youtube_url, videoId, thumbnail, description || '', id]
    );

    return NextResponse.json({ success: true, message: "Video updated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await initTable();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await pool.query("DELETE FROM videos WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Video deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
