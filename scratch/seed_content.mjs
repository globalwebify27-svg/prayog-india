import pool from "../lib/db.js";

async function seedContent() {
  try {
    console.log("Seeding site content...");

    // 1. Seed Faculties
    const faculties = [
      { name: "Prof. Rajesh Khanna", role: "Head of Robotics", specialty: "Industrial Automation", img: "/assets/t3.png", bio: "20+ years of industrial experience in heavy-duty robotics and automated production lines.", expertise: JSON.stringify(["Kinematics", "PLC Programming", "Industrial Safety"]), education: "Ph.D. Robotics, IIT Bombay" },
      { name: "Dr. Ananya Roy", role: "AI Researcher", specialty: "Computer Vision", img: "/assets/t2.png", bio: "Pioneering researcher in neural networks for autonomous navigation.", expertise: JSON.stringify(["Deep Learning", "TensorFlow", "Object Detection"]), education: "Post-Doc AI, Stanford University" },
      { name: "Vikram Malhotra", role: "Drone Specialist", specialty: "Aerodynamics", img: "/assets/t1.png", bio: "Certified UAV pilot and aerospace engineer dedicated to developing high-performance drone solutions.", expertise: JSON.stringify(["Aviation Design", "Flight Dynamics", "UAV Maintenance"]), education: "M.Tech Aerospace, IISc Bangalore" }
    ];

    for (const f of faculties) {
      await pool.query(
        "INSERT INTO faculties (name, role, specialty, image, bio, expertise, education) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [f.name, f.role, f.specialty, f.img, f.bio, f.expertise, f.education]
      );
    }

    // 2. Seed Testimonials
    const testimonials = [
      { name: "Rahul Sharma", course: "Industrial Robotics", year: "2025", video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", thumbnail: "/assets/course1.png" },
      { name: "Priya Patel", course: "AI & ML", year: "2024", video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", thumbnail: "/assets/course2.png" },
      { name: "Amit Kumar", course: "Drone Tech", year: "2025", video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", thumbnail: "/assets/course1.png" }
    ];

    for (const t of testimonials) {
      await pool.query(
        "INSERT INTO testimonials (name, course, year, video_url, thumbnail) VALUES (?, ?, ?, ?, ?)",
        [t.name, t.course, t.year, t.video_url, t.thumbnail]
      );
    }

    // 3. Seed Gallery
    const gallery = [
      { title: "Industrial Arm Training", category: "Robotics", image_url: "/assets/course1.png", location: "Mumbai Center" },
      { title: "Neural Network Seminar", category: "AI Workshops", image_url: "/assets/course2.png", location: "Pune Hub" },
      { title: "Flight Simulation Hub", category: "Drone Labs", image_url: "/assets/course1.png", location: "Science Park" }
    ];

    for (const g of gallery) {
      await pool.query(
        "INSERT INTO gallery (title, category, image_url, location) VALUES (?, ?, ?, ?)",
        [g.title, g.category, g.image_url, g.location]
      );
    }

    console.log("Seeding successful!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seedContent();
