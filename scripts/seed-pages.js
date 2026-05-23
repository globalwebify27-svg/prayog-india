import fs from 'fs';
const envConfig = fs.readFileSync('.env', 'utf8').split('\n');
for (const line of envConfig) {
  if (line.trim() && !line.startsWith('#')) {
    const [key, val] = line.split('=');
    if (key && val) process.env[key.trim()] = val.trim();
  }
}
const { default: pool } = await import('../lib/db.js');

const pagesData = [
  {
    slug: 'training',
    title: 'Training Programs',
    content: JSON.stringify({
      heroTitleLine1: "Robotics | STEM | AI | IoT",
      heroTitleLine2: "Drone Tech | 3D Design",
      heroSubtitle: "For Class 1–12 Students",
      heroDescription: "Education is changing rapidly. The world is moving toward Artificial Intelligence, Robotics, Automation, Smart Technologies, and Innovation-Based Learning. Today's students need much more than textbook knowledge to succeed in academics and future careers.",
      heroBadge: "Future Skills Begin Here",
      aboutTitle: "Building a Future-Focused Learning Ecosystem",
      aboutDescription1: "At PRAYOG INDIA ROBOTICS, we are building a future-focused learning ecosystem where students from Class 1 to 12 learn through practical activities, innovation projects, robotics systems, STEM education, electronics experiments, coding, AI tools, and real technology implementation.",
      aboutDescription2: "Our programs are specially designed to make learning exciting, interactive, practical, and deeply connected with school academics.",
      aboutDescription3: "Based in Ranchi, Jharkhand and expanding across India, we are helping students become confident learners, creative thinkers, and future innovators.",
      ctaTitle: "Give Your Child the Power of Future Education",
      ctaQuote: "\"We Don't Just Teach Technology — We Build Future Innovators, Thinkers & Leaders.\"",
      heroImage: "/assets/hero-indian-2.png"
    })
  },
  {
    slug: 'one-on-one',
    title: '1:1 Training',
    content: JSON.stringify({
      heroTitleLine1: "Master Technology with",
      heroTitleLine2: "1:1 Expert Mentorship",
      heroSubtitle: "Personalized Learning for Maximum Growth",
      heroDescription: "Experience customized learning paths tailored strictly to your child's pace and interests. Our 1:1 training ensures 100% attention, faster concept grasping, and deep practical engagement.",
      heroBadge: "Premium Personal Mentorship",
      aboutTitle: "Why Choose 1:1 Mentorship?",
      aboutDescription1: "Every student learns differently. Our 1:1 programs are designed to adapt to the individual learning style of your child, focusing on their strengths and addressing their specific challenges.",
      aboutDescription2: "With dedicated mentorship, students can explore advanced robotics, complex coding, and IoT projects without the pressure of keeping up with a batch.",
      aboutDescription3: "Personalized attention guarantees higher confidence and better understanding of core STEM concepts.",
      ctaTitle: "Transform Their Future with Dedicated Guidance",
      ctaQuote: "\"Personalized attention is the catalyst that turns curiosity into lifelong passion.\"",
      heroImage: "/assets/one_on_one_robotics_training.png"
    })
  },
  {
    slug: 'internships',
    title: 'Internships',
    content: JSON.stringify({
      heroTitleLine1: "Industrial Internships &",
      heroTitleLine2: "Real-World Projects",
      heroSubtitle: "Bridge the gap between Academic & Industry",
      heroDescription: "Step into the real world of technology with our intensive internship programs. Work on live projects, gain hands-on experience with cutting-edge tools, and build a resume that stands out to top employers.",
      heroBadge: "Career-Defining Experience",
      aboutTitle: "Gain True Industrial Exposure",
      aboutDescription1: "Our internships provide students and graduates with the rare opportunity to work on actual industry problems. You aren't just learning theory; you are applying it to build real solutions.",
      aboutDescription2: "Under the guidance of industry veterans, interns will tackle projects in AI, Robotics, Web Development, and IoT.",
      aboutDescription3: "By the end of the program, interns will have a portfolio of working projects, a deep understanding of professional workflows, and an official experience certificate.",
      ctaTitle: "Start Your Professional Journey Today",
      ctaQuote: "\"Experience is the bridge between textbook knowledge and professional success.\"",
      heroImage: "/assets/internship.png"
    })
  },
  {
    slug: 'admission',
    title: 'Admission',
    content: JSON.stringify({
      heroTitleLine1: "Secure Your Seat in the",
      heroTitleLine2: "Future of Learning",
      heroSubtitle: "Join our next batch of innovators",
      heroDescription: "Complete your admission process today to unlock world-class STEM education, personalized mentorship, and hands-on technological training. Limited seats available for the upcoming sessions.",
      heroBadge: "Admissions Open",
      aboutTitle: "Simple Enrollment Process",
      aboutDescription1: "We've made joining Prayog India as straightforward as possible. Select your program, verify your identity, and complete the fee payment securely online.",
      aboutDescription2: "Our system ensures your data is protected with TLS encryption.",
      aboutDescription3: "Need help choosing the right program? Our academic counselors are available to guide you.",
      ctaTitle: "Begin Your Application Now",
      ctaQuote: "\"The first step toward innovation is the decision to start learning.\"",
      heroImage: "/assets/hero-indian-2.png"
    })
  }
];

async function seed() {
  try {
    console.log("Seeding pages...");
    for (const page of pagesData) {
      await pool.query(
        `INSERT INTO pages (slug, title, content) VALUES (?, ?, ?) 
         ON DUPLICATE KEY UPDATE title = VALUES(title), content = VALUES(content)`,
        [page.slug, page.title, page.content]
      );
      console.log("Seeded page: " + page.slug);
    }
    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding pages:", err);
    process.exit(1);
  }
}

seed();
