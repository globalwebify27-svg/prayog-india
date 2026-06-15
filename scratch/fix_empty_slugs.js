const mysql = require('mysql2/promise');

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function fixEmptySlugs() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'prayog_india'
  });

  try {
    const [stories] = await connection.query("SELECT id, title, slug FROM stories WHERE slug = '' OR slug IS NULL");
    console.log('Found empty slugs:', stories.length);

    for (const story of stories) {
      let newSlug = slugify(story.title);
      // Ensure uniqueness just in case
      let uniqueSlug = newSlug;
      let counter = 1;
      while (true) {
        const [existing] = await connection.query("SELECT id FROM stories WHERE slug = ? AND id != ?", [uniqueSlug, story.id]);
        if (existing.length === 0) break;
        uniqueSlug = `${newSlug}-${counter}`;
        counter++;
      }

      console.log(`Updating story ID ${story.id} slug to: ${uniqueSlug}`);
      await connection.query("UPDATE stories SET slug = ? WHERE id = ?", [uniqueSlug, story.id]);
    }
    console.log('Finished updating empty slugs.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await connection.end();
  }
}

fixEmptySlugs();
