const mysql = require('mysql2/promise');

async function seed() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'prayog_india'
  });

  const stories = [
    {
      title: "Empowering Rural Youth through Robotics Innovation",
      slug: "empowering-rural-youth-robotics",
      excerpt: "How our recent workshop in Satara transformed the technical outlook of 50+ students from marginalized backgrounds.",
      thumbnail: "https://images.unsplash.com/photo-1581092334651-ddf26d9a1930?q=80&w=2070&auto=format&fit=crop",
      banner_image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a1930?q=80&w=2070&auto=format&fit=crop",
      video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      content: JSON.stringify([
        { 
          type: 'text', 
          title: 'The Challenge', 
          value: 'In the remote villages of Satara, access to modern robotics equipment was virtually non-existent. Students were brilliant but lacked the tools to translate their theoretical knowledge into practical applications.' 
        },
        {
          type: 'gallery',
          value: [
            "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop"
          ]
        },
        {
          type: 'quote',
          value: 'Seeing a robot move for the first time was like watching magic become science right before our eyes.',
          author: 'Sandeep Patil, Student'
        },
        {
          type: 'image',
          value: "https://images.unsplash.com/photo-1581092334651-ddf26d9a1930?q=80&w=2070&auto=format&fit=crop",
          caption: "Students working on their final year projects using industrial controllers."
        },
        {
          type: 'text',
          title: 'The Implementation',
          value: 'We deployed our mobile robotics lab, equipped with Arduino kits, industrial sensors, and 3D printers. The curriculum was designed to be hands-on, focusing on problem-solving rather than rote learning.'
        }
      ]),
      category: "Rural Outreach",
      author: "Prayog Admin"
    },
    {
      title: "Gap in Tier 2 Cities: AI & Aviation",
      slug: "ai-aviation-skill-gap",
      excerpt: "A deep dive into our collaboration with local engineering colleges to introduce advanced AI modules.",
      thumbnail: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=2069&auto=format&fit=crop",
      banner_image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=2069&auto=format&fit=crop",
      video_url: null,
      content: JSON.stringify([
        { 
          type: 'text', 
          title: 'Industry Alignment', 
          value: 'Most engineering colleges in Tier 2 cities are using curricula that are 10 years behind industry standards.' 
        },
        {
          type: 'image',
          value: "https://images.unsplash.com/photo-1564859228273-274232fdb516?q=80&w=2070&auto=format&fit=crop",
          caption: "High-precision aviation sensors being calibrated by students."
        },
        {
          type: 'gallery',
          value: [
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
          ]
        },
        {
          type: 'text',
          title: 'Measured Outcomes',
          value: 'Out of 200 participants, 45 secured immediate internships at leading aerospace firms.'
        }
      ]),
      category: "Academic Partnership",
      author: "Dr. Sharma"
    },
    {
      title: "Women in STEM: The Rise of Industrial Robotics Female Cohorts",
      slug: "women-in-stem-robotics",
      excerpt: "Celebrating our first all-female cohort completing the Industrial Robotics Diploma with 100% placement.",
      thumbnail: "https://images.unsplash.com/photo-1573164773711-33023fd3e174?q=80&w=2070&auto=format&fit=crop",
      banner_image: "https://images.unsplash.com/photo-1573164773711-33023fd3e174?q=80&w=2070&auto=format&fit=crop",
      video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      content: JSON.stringify([
        { 
          type: 'text', 
          title: 'Breaking Barriers', 
          value: 'Industrial robotics has traditionally been a male-dominated field. Our "Pink Robotics" initiative focused on recruiting and training female engineers.' 
        },
        {
          type: 'gallery',
          value: [
            "https://images.unsplash.com/photo-1573164773711-33023fd3e174?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
          ]
        },
        {
          type: 'quote',
          value: 'Precision has no gender. These women are some of the best programmers we have ever trained.',
          author: 'Amit Varma, Lead Instructor'
        }
      ]),
      category: "Impact Story",
      author: "Aditi Rao"
    }
  ];

  try {
    await connection.query("DELETE FROM stories");
    
    for (const story of stories) {
      await connection.query(
        "INSERT INTO stories (title, slug, excerpt, thumbnail, banner_image, video_url, content, category, author, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())",
        [story.title, story.slug, story.excerpt, story.thumbnail, story.banner_image, story.video_url, story.content, story.category, story.author]
      );
    }
    console.log("Seeded 3 stories with multiple images/galleries successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await connection.end();
  }
}

seed();
