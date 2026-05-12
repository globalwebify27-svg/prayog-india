import { NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { location, selfie, courseId = null, batchId = null } = await req.json();

    // Check if attendance already marked for today
    const [existing] = await pool.query(
      "SELECT id FROM attendance WHERE user_id = ? AND course_id = ? AND date = CURDATE()",
      [userId, courseId]
    );

    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: "Attendance already marked for this course today" }, { status: 400 });
    }

    // 1. Save selfie to public/uploads/attendance (mocking file save)
    let selfieUrl = null;
    if (selfie) {
      const base64Data = selfie.replace(/^data:image\/png;base64,/, "");
      const fileName = `attendance_${userId}_${Date.now()}.png`;
      const uploadDir = path.join(process.cwd(), "public", "uploads", "attendance");
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      fs.writeFileSync(path.join(uploadDir, fileName), base64Data, "base64");
      selfieUrl = `/uploads/attendance/${fileName}`;
    }

    // 2. Reverse Geocode Location
    let locationName = "Unknown Location";
    if (location?.lat && location?.lng) {
      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`, {
          headers: { "User-Agent": "PrayogIndia/1.0" }
        });
        const geoData = await geoRes.json();
        locationName = geoData.display_name || `${location.lat}, ${location.lng}`;
      } catch (e) {
        console.error("Geocoding failed:", e);
      }
    }

    // 3. Insert into DB
    await pool.query(
      "INSERT INTO attendance (user_id, course_id, batch_id, date, type, latitude, longitude, location_name, selfie_url, status) VALUES (?, ?, ?, CURDATE(), 'offline', ?, ?, ?, ?, 'present')",
      [userId, courseId || null, batchId || null, location?.lat, location?.lng, locationName, selfieUrl]
    );

    return NextResponse.json({ success: true, message: "Attendance logged successfully", locationName });

  } catch (error) {
    console.error("Attendance error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
