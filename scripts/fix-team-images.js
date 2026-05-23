import fs from 'fs';
const envConfig = fs.readFileSync('.env', 'utf8').split('\n');
for (const line of envConfig) {
  if (line.trim() && !line.startsWith('#')) {
    const [key, val] = line.split('=');
    if (key && val) process.env[key.trim()] = val.trim();
  }
}
const { default: pool } = await import('../lib/db.js');

async function fix() {
  await pool.query("UPDATE about_team SET img = '/assets/t1.png' WHERE name LIKE '%Enamul%'");
  await pool.query("UPDATE about_team SET img = '/assets/t2.png' WHERE name LIKE '%Shahnawaz%'");
  await pool.query("UPDATE about_team SET img = '/assets/t3.png' WHERE name LIKE '%Emraan%'");
  await pool.query("UPDATE about_team SET img = '/assets/t1.png' WHERE name LIKE '%Jay Prakash%'");
  await pool.query("UPDATE about_team SET img = '/assets/t2.png' WHERE name LIKE '%Nikhil%'");
  await pool.query("UPDATE about_team SET img = '/assets/t3.png' WHERE name LIKE '%Saheb%'");
  await pool.query("UPDATE about_team SET img = '/assets/t1.png' WHERE name LIKE '%Vivek%'");
  console.log('Fixed team images');
  process.exit(0);
}

fix();
