import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { initDb } from "@/lib/init-db";

export async function GET() {
  try {
    // 0. Init Schema
    await initDb();

    // 1. Admin
    const adminPass = await bcrypt.hash("admin123", 10);
    await pool.query(
      "INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      ["Admin Head", "admin@prayogindia.in", adminPass, "admin"]
    );

    // 2. Courses
    await pool.query(
      "INSERT IGNORE INTO courses (id, title, description, price, type, duration) VALUES (?, ?, ?, ?, ?, ?)",
      [1, "Industrial Robotics", "Master the world of automation.", 15000, "offline", "6 Months"]
    );
    await pool.query(
      "INSERT IGNORE INTO courses (id, title, description, price, type, duration) VALUES (?, ?, ?, ?, ?, ?)",
      [2, "AI Foundation", "Learn the basics of Machine Learning.", 12000, "online", "4 Months"]
    );

    // 3. Student
    const studentPass = await bcrypt.hash("student123", 10);
    const [userRes] = await pool.query(
      "INSERT IGNORE INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [2, "Rahul Sharma", "rahul@gmail.com", studentPass, "student"]
    );

    // 4. Enrollment
    await pool.query(
      "INSERT IGNORE INTO enrollments (user_id, course_id, total_amount, amount_paid, status) VALUES (?, ?, ?, ?, ?)",
      [2, 1, 15000, 5000, "active"]
    );

    // 5. Installments
    await pool.query(
      "INSERT IGNORE INTO installments (enrollment_id, amount, due_date, status) VALUES (?, ?, ?, ?)",
      [1, 5000, "2026-05-15", "pending"]
    );

    // 6. Workshop Stories (Case Studies)
    const stories = [
      {
        title: "Industrial Robotics Integration in Textile Hub",
        description: "Transforming a traditional textile factory in Surat into a semi-automated powerhouse using 6-axis robotic arms for precision fabric handling.",
        image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        date: "2026-04-12",
        location: "Surat, Gujarat",
        category: "Industrial",
        client_name: "Surat Fabrics Ltd.",
        content: [
          { type: "overview", title: "Project Overview", text: "The textile industry in Surat faces increasing labor shortages and rising quality demands. This project aimed to integrate flexible automation to maintain competitive edges." },
          { type: "challenge", title: "The Challenge", text: "Handling delicate silk and cotton fabrics requires extreme precision. Standard industrial robots are often too 'rough', leading to material damage during high-speed sorting." },
          { type: "solution", title: "Our Solution", text: "We developed custom soft-gripper end-effectors and implemented vision-guided sorting algorithms that adjust pressure based on fabric density in real-time." },
          { type: "result", title: "Impact & Results", text: "Sorting speed increased by 340%, with a 99.8% reduction in material handling errors. The facility now operates 24/7 with minimal supervision." }
        ]
      },
      {
        title: "Rural Healthcare: Drone Delivery Ecosystem",
        description: "Deploying autonomous drone swarms to deliver life-saving medicines and vaccines to remote Himalayan villages with zero road access.",
        image_url: "https://images.unsplash.com/photo-1473960104372-7a35368a69b1?auto=format&fit=crop&q=80&w=1200",
        video_url: "",
        date: "2026-03-28",
        location: "Shimla, HP",
        category: "Robotics",
        client_name: "State Health Dept.",
        content: [
          { type: "overview", title: "Project Overview", text: "In high-altitude regions, medical emergencies often become fatal due to 12+ hour transport times. We proposed a sky-bridge of autonomous drones." },
          { type: "challenge", title: "The Challenge", text: "Extreme wind conditions and sub-zero temperatures drastically reduce battery efficiency and flight stability for standard commercial drones." },
          { type: "solution", title: "Our Solution", text: "Designed a cold-weather resistant airframe and implemented a 'Swarm Intelligence' routing system that uses local thermal currents to conserve 25% more energy." },
          { type: "result", title: "Impact & Results", text: "Reduced delivery time from 14 hours to 42 minutes. Over 1,200 vaccine doses successfully delivered in the first pilot month." }
        ]
      },
      {
        title: "AI-Driven Smart Grid Monitoring",
        description: "Implementing predictive maintenance algorithms across urban power grids to prevent blackouts and optimize energy distribution during peak hours.",
        image_url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200",
        video_url: "",
        date: "2026-05-01",
        location: "Pune, Maharashtra",
        category: "Academic",
        client_name: "Urban Power Corp.",
        content: [
          { type: "overview", title: "Project Overview", text: "Urban grids are reaching breaking points. This R&D project focused on 'Self-Healing Grids' using deep learning models." },
          { type: "challenge", title: "The Challenge", text: "Identifying micro-fluctuations that lead to transformers blowing up before they actually happen is statistically complex in high-noise environments." },
          { type: "solution", title: "Our Solution", text: "Deployed IoT sensor arrays that feed 10,000 data points per second into a custom-trained LSTM (Long Short-Term Memory) neural network." },
          { type: "result", title: "Impact & Results", text: "Successfully predicted 12 major grid failures before they occurred, saving the city approximately ₹4.2 Crores in infrastructure damage." }
        ]
      }
    ];

    for (const story of stories) {
      await pool.query(
        "INSERT IGNORE INTO workshops (title, description, image_url, video_url, date, location, category, client_name, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [story.title, story.description, story.image_url, story.video_url, story.date, story.location, story.category, story.client_name, JSON.stringify(story.content)]
      );
    }

    return NextResponse.json({ success: true, message: "Database seeded with workshop case studies!" });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
