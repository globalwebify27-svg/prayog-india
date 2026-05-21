import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { initDb } from "@/lib/init-db";

export async function GET() {
  try {
    // 0. Init Schema
    await initDb();

    // Ensure about_faculty has img_url column
    try {
      await pool.query("ALTER TABLE about_faculty ADD COLUMN img_url VARCHAR(255) DEFAULT ''");
    } catch (e) {
      // Column might already exist, ignore error
    }

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

    // 7. Seed about_team
    const [teamRows] = await pool.query("SHOW TABLES LIKE 'about_team'");
    if (teamRows.length > 0) {
      const [teamCountRows] = await pool.query("SELECT COUNT(*) as count FROM about_team");
      if (teamCountRows[0].count === 0) {
        const team = [
          { 
            name: "Enamul Hassan", 
            role: "Founder & Visionary", 
            initial: "EH", 
            img: "/assets/t1.png",
            bio: "Founder of PRAYOG INDIA ROBOTICS PVT. LTD. — the visionary who started this journey in 2015 during his Engineering days, driven by a passion for Robotics, Embedded Systems, and practical education.", 
            color: "#01254d",
            specialties: ["Strategic Growth", "Embedded Systems", "Robotics"],
            focus: "National STEM Scaling"
          },
          { 
            name: "Md. Shahnawaz Abbas", 
            role: "Research & Training Manager", 
            initial: "SA", 
            img: "/assets/t2.png",
            bio: "One of the strongest pillars behind PRAYOG's growth. With co-founder-level dedication, he shaped the research, learning methodology, workshops, and innovation culture of the organization.", 
            color: "#1a3f70",
            specialties: ["IoT Networks", "Applied Research", "STEM Labs Setup"],
            focus: "Ecosystem Development"
          },
          { 
            name: "Emraan Hassan", 
            role: "Robotics & Emerging Tech Specialist", 
            initial: "EH", 
            img: "/assets/t3.png",
            bio: "A driving force with expertise in Robotics, Embedded Systems, IoT, and Drone Technology. His passion for hands-on learning embodies the spirit of innovation at PRAYOG.", 
            color: "#0d2d52",
            specialties: ["Drone Engineering", "Sensors & Telemetry", "Workshop Design"],
            focus: "UAV Systems & Flight Control"
          },
          { 
            name: "Jay Prakash Kumar", 
            role: "Sr. Embedded Engineer", 
            initial: "JK", 
            img: "/assets/t1.png",
            bio: "Specialized in Embedded Systems, IoT, Electronics Design, and Hardware Prototyping with deep expertise in real-time embedded technologies.", 
            color: "#01254d",
            specialties: ["Circuit Design", "Firmware (C++)", "Prototyping"],
            focus: "Microcontrollers & RTOS"
          },
          { 
            name: "Nikhil Khakha", 
            role: "Drone Engineer", 
            initial: "NK", 
            img: "/assets/t2.png",
            bio: "Focused on Drone Technology, UAV Systems, and aerial robotics — guiding students through the technical and regulatory aspects of drone engineering.", 
            color: "#1a3f70",
            specialties: ["Aerodynamics", "PX4 Autopilot", "DGCA Compliance"],
            focus: "UAV Assembly & Flight Operations"
          },
          { 
            name: "Saheb Ali", 
            role: "Automation Engineer", 
            initial: "SA", 
            img: "/assets/t3.png",
            bio: "Specialized in Industrial Automation, Control Systems, and Smart Technologies — bridging the gap between academic theory and real industrial practice.", 
            color: "#0d2d52",
            specialties: ["PLC Programming", "SCADA Integration", "Control Logic"],
            focus: "Industrial Automation Systems"
          },
          { 
            name: "Vivek Ranjan", 
            role: "Sr. Graphic Designer", 
            initial: "VR", 
            img: "/assets/t1.png",
            bio: "One of the earliest members who shaped PRAYOG's entire visual identity, creative branding, and digital presence through impactful graphic design.", 
            color: "#01254d",
            specialties: ["Visual Design", "Creative Branding", "UX/UI Prototyping"],
            focus: "Digital & Media Presence"
          }
        ];

        for (let i = 0; i < team.length; i++) {
          const m = team[i];
          await pool.query(
            "INSERT INTO about_team (name, role, initial, img, bio, color, specialties, focus, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [m.name, m.role, m.initial, m.img, m.bio, m.color, JSON.stringify(m.specialties), m.focus, i]
          );
        }
      }
    }

    // 8. Seed about_faculty
    const [facultyRows] = await pool.query("SHOW TABLES LIKE 'about_faculty'");
    if (facultyRows.length > 0) {
      // Clear existing records to ensure we load the fresh expanded descriptions
      await pool.query("DELETE FROM about_faculty");
      const guestFaculty = [
        { 
          name: "Aman Raj", 
          role: "Robotics & Automation Engineer", 
          desc: "Aman Raj is a seasoned Robotics & Automation Engineer who has dedicated years to designing complex control loops and automated factory systems. As a guest mentor, he guides students through practical hardware interfaces, sensor calibration, and embedded microcontroller architectures, ensuring they build robust, production-ready engineering applications.", 
          initial: "AR", 
          img_url: "" 
        },
        { 
          name: "Anant Verma", 
          role: "Robotics Engineer", 
          desc: "Anant Verma is an expert Robotics Engineer specializing in kinematics, mechanical structural designs, and control systems. He provides guest lectures and mentorship on advanced robot assembly, custom structural designs, and innovative project developments. His guidance helps students conceptualize and manufacture their own functional robotic platforms from scratch.", 
          initial: "AV", 
          img_url: "" 
        },
        { 
          name: "Sunny Kumar", 
          role: "Sr. Web Developer", 
          desc: "Sunny Kumar is a Senior Web Developer with extensive experience building highly scalable enterprise web systems, database architectures, and API integrations. He oversees web infrastructure projects at Prayog India and guides students on modern stack deployment, microservices, cloud database architectures, and software engineering practices.", 
          initial: "SK", 
          img_url: "" 
        },
        { 
          name: "Belal Khan", 
          role: "Sr. Android Developer", 
          desc: "Belal Khan is a Senior Android Developer with a rich history of building consumer-grade mobile applications and digital platforms. He focuses on mobile application architectures, Android SDK, and hardware-mobile integration (like Bluetooth/WiFi control for robots), allowing students to develop wireless interfaces for their physical projects.", 
          initial: "BK", 
          img_url: "" 
        }
      ];

      for (let i = 0; i < guestFaculty.length; i++) {
        const f = guestFaculty[i];
        await pool.query(
          "INSERT INTO about_faculty (name, role, desc_text, initial, img_url, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
          [f.name, f.role, f.desc, f.initial, f.img_url, i]
        );
      }
    }

    return NextResponse.json({ success: true, message: "Database seeded with workshop case studies, team and faculty data!" });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
