const mysql = require("mysql2/promise");

const reviews = [
  {
    name: "Nikki Devi",
    course: "Parent",
    year: "2 weeks ago",
    content: "My children go there for training in robotics development and programming and now they are learning a lot. Thank you Prayog India for making my children so intelligent at such a young age.",
    rating: 5,
    thumbnail: "/assets/avatar.png"
  },
  {
    name: "Prashnt Jha",
    course: "Customer",
    year: "2 weeks ago",
    content: "Very best place to buy IoT and DIY products.",
    rating: 5,
    thumbnail: "/assets/avatar.png"
  },
  {
    name: "Bison Sara",
    course: "Customer",
    year: "2 weeks ago",
    content: "The product range is excellent and prices are reasonable. A must-visit store for tech enthusiasts and students.",
    rating: 5,
    thumbnail: "/assets/avatar.png"
  },
  {
    name: "Laxman Kumar Rana",
    course: "Internship Student",
    year: "7 weeks ago",
    content: "I successfully completed my internship at Prayog India Robotics and it was a fantastic journey. The institute provides excellent infrastructure and practical exposure. Mentors are skilled and very supportive throughout the training. I learned about Embedded Systems, Robotics, IoT and Drone. I really improved my skills, which I have never imagined. This is one of the best places in Ranchi, Jharkhand for internship training. Highly recommended and worth it.",
    rating: 5,
    thumbnail: "/assets/avatar.png"
  },
  {
    name: "Mishkaat Jamal",
    course: "Internship Student",
    year: "7 weeks ago",
    content: "I recently completed my internship at PRAYOG INDIA ROBOTICS and it was an amazing learning experience. The institute offers one of the best environments for students in Ranchi, Jharkhand. The labs are highly advanced and fully equipped with modern tools. Mentors are very experienced and always ready to guide. I gained strong practical knowledge in Robotics and IoT. Highly recommended for every tech student.",
    rating: 5,
    thumbnail: "/assets/avatar.png"
  },
  {
    name: "Krish Kumar",
    course: "Student",
    year: "8 weeks ago",
    content: "I had a great experience.\nI enjoyed the whole session.\nAnd also learnt many more things.",
    rating: 5,
    thumbnail: "/assets/avatar.png"
  },
  {
    name: "Nausheen Jilani",
    course: "Workshop Attendee",
    year: "8 weeks ago",
    content: "Had a great experience workshop conducted by Prayog Idea.",
    rating: 5,
    thumbnail: "/assets/avatar.png"
  },
  {
    name: "Harsh Singh",
    course: "Workshop Attendee",
    year: "8 weeks ago",
    content: "Wonderful workshop!! A well new experience with living with AI and robotics!!",
    rating: 5,
    thumbnail: "/assets/avatar.png"
  },
  {
    name: "Aryan Beniwal",
    course: "Workshop Attendee",
    year: "8 weeks ago",
    content: "The workshop organised by them was excellent. We all learned a lot.",
    rating: 5,
    thumbnail: "/assets/avatar.png"
  },
  {
    name: "Chudamani Sahu",
    course: "Student",
    year: "2 months ago",
    content: "Quality training and as well very good response whether concern to drone or whatever else. Very good faculty.",
    rating: 5,
    thumbnail: "/assets/avatar.png"
  },
  {
    name: "Ayush",
    course: "Customer",
    year: "2 months ago",
    content: "Accha dukaan hai.",
    rating: 5,
    thumbnail: "/assets/avatar.png"
  },
  {
    name: "Aman Kumar",
    course: "Student",
    year: "2 months ago",
    content: "Great experience with Shahnawaz Sir and got to learn a lot with Shahnawaz Sir having lot of experience in the field of robotics and development projects.",
    rating: 5,
    thumbnail: "/assets/avatar.png"
  },
  {
    name: "Jagarnath Laheri",
    course: "Student",
    year: "2 months ago",
    content: "A great experience with Shahnawaz Sir.",
    rating: 5,
    thumbnail: "/assets/avatar.png"
  },
  {
    name: "Ommy",
    course: "Customer",
    year: "3 months ago",
    content: "Best place to buy robotic components.",
    rating: 5,
    thumbnail: "/assets/avatar.png"
  },
  {
    name: "Matcha Ritika",
    course: "Student",
    year: "1 month ago",
    content: "It was such an enlightening session so far I have come across after coming into the campus. The exploring of Arduino app is quite interesting, and made me analyse my interests. Yeah! it is quite good and looking forward to participate in even more sessions like this.",
    rating: 5,
    thumbnail: "/assets/avatar.png"
  },
  {
    name: "Phulkeshwar Mahto",
    course: "Student",
    year: "1 month ago",
    content: "Very Good Workshop.",
    rating: 5,
    thumbnail: "/assets/avatar.png"
  },
  {
    name: "Amrit Anand",
    course: "NIAMT Ranchi Student",
    year: "1 month ago",
    content: "I am Amrit Anand from NIAMT Ranchi, it was a great experience for me because I am a fresher so I learnt many things like how to control Arduino by code and how to make robo boat.",
    rating: 5,
    thumbnail: "/assets/avatar.png"
  },
  {
    name: "Dhwaj Gaur",
    course: "NIAMT Student",
    year: "1 month ago",
    content: "The experience was great as a student of NIAMT, each second of me was worth here. Though the topics taught were new and the circuitry was also difficult. But the staff was so well experienced and involving that every doubt got solved, and they were really inviting, anybody can ask any question to them. The complex topics were taught in a very engaging manner by analogies, and everybody had fun.",
    rating: 5,
    thumbnail: "/assets/avatar.png"
  },
  {
    name: "Sachin Kumar",
    course: "NIAMT Student (MME)",
    year: "1 month ago",
    content: "Myself Sachin Kumar, student of MME branch of NIAMT Ranchi. Robotics workshop was very interesting and entertaining. Made interesting projects easily with the guidance of workshop members and organisers. Every engineering student or student interested in robots must attend the workshop once. It gave idea about components of robots and their functions.",
    rating: 5,
    thumbnail: "/assets/avatar.png"
  },
  {
    name: "Ritik Kumar",
    course: "NIAMT Student (Metallurgy)",
    year: "1 month ago",
    content: "Myself Ritik Kumar from Metallurgy and Materials Engineering Department, 2nd semester. Nice experience with this robotics workshop and learned many new things. Fantastic experience.",
    rating: 5,
    thumbnail: "/assets/avatar.png"
  },
  {
    name: "Sagar Kushwaha",
    course: "Student",
    year: "1 month ago",
    content: "Excellent learning experience at the workshop provided by them. Greatly interesting and interactive.",
    rating: 4,
    thumbnail: "/assets/avatar.png"
  },
  {
    name: "Sumit Kumar",
    course: "NIAMT Ranchi Student",
    year: "1 month ago",
    content: "This side Mr. Sumit Kumar, a first year B.Tech student at National Institute of Advanced Manufacturing Technology Ranchi.\n\nI had an amazing experience at the Prayog India Workshop on Robotics held at NIAMT Ranchi. This workshop provided a great learning opportunity to understand the fundamentals of robotics, automation, and programming.\n\nWe got hands-on experience with assembling and programming robots, learning about sensors, microcontrollers, and real-world applications of robotics. The trainers were highly knowledgeable and made complex topics easy to understand with practical demonstrations.\n\nThis workshop not only enhanced my technical skills but also improved my problem-solving and teamwork abilities. I highly recommend Prayog India for anyone interested in robotics and innovation!",
    rating: 5,
    thumbnail: "/assets/avatar.png"
  },
  {
    name: "Arya Tiwari",
    course: "NIAMT Ranchi Student",
    year: "1 month ago",
    content: "Myself Arya Tiwari and I really say that was one of the best experiences ever I have seen and I am able to learn many new things. This type of workshop should be held every year in our college NIAMT Ranchi.",
    rating: 5,
    thumbnail: "/assets/avatar.png"
  },
  {
    name: "Rachit",
    course: "NIAMT Student (Mechanical)",
    year: "1 month ago",
    content: "My name is Rachit Raj. My college is NIAMT Ranchi. I am from Mechanical Engineering branch. I have learned a lot in this 14 hours workshop.",
    rating: 5,
    thumbnail: "/assets/avatar.png"
  }
];

async function seed() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "prayog_india"
  });

  console.log("Connected to database. Seeding GMB reviews...");

  // Clear all text GMB reviews (with content)
  await connection.query("DELETE FROM testimonials WHERE content IS NOT NULL");

  for (const review of reviews) {
    await connection.query(
      "INSERT INTO testimonials (name, course, year, content, rating, thumbnail) VALUES (?, ?, ?, ?, ?, ?)",
      [review.name, review.course, review.year, review.content, review.rating, review.thumbnail]
    );
  }

  console.log(`Successfully seeded ${reviews.length} reviews!`);
  await connection.end();
}

seed().catch(console.error);
