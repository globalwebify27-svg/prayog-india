import pool from "../lib/db.js";

async function checkMoreSchemas() {
  try {
    const [exams] = await pool.query("DESCRIBE exam_submissions");
    console.log("Exam Submissions Schema:", exams);
    
    const [materials] = await pool.query("DESCRIBE material_completions");
    console.log("Material Completions Schema:", materials);
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkMoreSchemas();
