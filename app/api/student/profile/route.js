import { NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const body = await req.json();
    const { 
      name, phone, dob, address, blood_group, emergency_contact, image,
      father_name, mother_name, gender, qualification, school_college,
      last_qualification_year, id_type, id_number, id_image, school_id_card,
      school_id_number,
      bio, specialty, expertise, faculty_education
    } = body;

    // Check if profile is complete (Strict institutional requirements)
    const isComplete = (
      father_name && 
      mother_name && 
      gender && 
      qualification && 
      address && 
      dob && 
      id_number && 
      image && 
      school_id_card &&
      school_id_number // Added school ID number requirement
    ) ? 1 : 0;

    // Update profile in users table
    await pool.query(
      `UPDATE users SET 
        name = ?, phone = ?, dob = ?, address = ?, blood_group = ?, 
        emergency_contact = ?, image = ?, father_name = ?, mother_name = ?, 
        gender = ?, qualification = ?, school_college = ?, 
        last_qualification_year = ?, id_type = ?, id_number = ?, 
        id_image = ?, school_id_card = ?, school_id_number = ?, 
        profile_completed = ? 
       WHERE id = ?`,
      [
        name, phone, dob || null, address, blood_group, 
        emergency_contact, image || null, father_name, mother_name, 
        gender, qualification, school_college, 
        last_qualification_year, id_type, id_number, 
        id_image || null, school_id_card || null, school_id_number || null, 
        isComplete, userId
      ]
    );

    // If role is teacher, also update faculties table
    const [userRows] = await pool.query("SELECT role FROM users WHERE id = ?", [userId]);
    if (userRows.length > 0 && userRows[0].role === 'teacher') {
      await pool.query(
        "UPDATE faculties SET bio = ?, specialty = ?, expertise = ?, education = ? WHERE user_id = ?",
        [bio || null, specialty || null, JSON.stringify(expertise || []), faculty_education || null, userId]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully"
    });

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
