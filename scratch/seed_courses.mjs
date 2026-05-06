import pool from "../lib/db.js";

const courses = [
  {
    title: "Industrial Robotics & Automation",
    category: "Robotics",
    duration: "6 Months",
    level: "Advanced",
    price: 15000,
    rating: 4.9,
    description: "Master industrial arm controllers, PLC integration, and automated production line design.",
    image: "/assets/course1.png",
    type: "offline"
  },
  {
    title: "AI & Machine Learning Foundation",
    category: "Artificial Intelligence",
    duration: "4 Months",
    level: "Intermediate",
    price: 25000,
    rating: 4.8,
    description: "Build neural networks, implement computer vision, and deploy predictive models.",
    image: "/assets/course2.png",
    type: "online"
  },
  {
    title: "Next-Gen Drone Technology",
    category: "Aviation",
    duration: "3 Months",
    level: "Beginner",
    price: 18000,
    rating: 4.7,
    description: "Learn flight dynamics, autonomous navigation, and industrial drone maintenance.",
    image: "/assets/course1.png",
    type: "offline"
  },
  {
    title: "IoT & Smart Systems Design",
    category: "Electronics",
    duration: "4 Months",
    level: "Intermediate",
    price: 12000,
    rating: 4.8,
    description: "Design connected ecosystems using ESP32, Raspberry Pi, and MQTT protocols.",
    image: "/assets/course2.png",
    type: "online"
  },
  {
    title: "Cyber-Physical Security",
    category: "Robotics",
    duration: "5 Months",
    level: "Advanced",
    price: 30000,
    rating: 4.9,
    description: "Secure industrial control systems and protect robotics infrastructure from threats.",
    image: "/assets/course1.png",
    type: "offline"
  },
  {
    title: "Embedded Systems Mastery",
    category: "Electronics",
    duration: "6 Months",
    level: "Advanced",
    price: 20000,
    rating: 4.9,
    description: "Deep dive into RTOS, ARM Cortex-M architecture, and firmware optimization.",
    image: "/assets/course2.png",
    type: "offline"
  },
  {
    title: "Robot Operating System (ROS 2)",
    category: "Robotics",
    duration: "4 Months",
    level: "Advanced",
    price: 22000,
    rating: 4.8,
    description: "Develop scalable robotic applications using the industry-standard ROS 2 framework.",
    image: "/assets/course1.png",
    type: "offline"
  },
  {
    title: "Smart City Township Program",
    category: "Township",
    duration: "1 Month",
    level: "Advanced",
    price: 45000,
    rating: 5.0,
    description: "An immersive 30-day experience building IoT-driven infrastructure in our model smart township.",
    image: "/assets/m1.png",
    type: "offline"
  },
  {
    title: "Industrial Automation Residency",
    category: "Township",
    duration: "2 Weeks",
    level: "Intermediate",
    price: 25000,
    rating: 4.9,
    description: "Hands-on industrial residency focusing on full-scale production line automation and robotics.",
    image: "/assets/m2.png",
    type: "offline"
  },
  {
    title: "3D Design & Prototyping",
    category: "Design",
    duration: "2 Months",
    level: "Beginner",
    price: 8000,
    rating: 4.6,
    description: "Master CAD modeling, generative design, and professional 3D printing techniques.",
    image: "/assets/course2.png",
    type: "online"
  }
];

async function seedCourses() {
  try {
    console.log("Seeding courses...");
    
    for (const course of courses) {
      await pool.query(
        "INSERT INTO courses (title, category, level, duration, price, rating, description, image, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [course.title, course.category, course.level, course.duration, course.price, course.rating, course.description, course.image, course.type]
      );
    }

    console.log("Seeding successful!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seedCourses();
