import fs from 'fs';
const envConfig = fs.readFileSync('.env', 'utf8').split('\n');
for (const line of envConfig) {
  if (line.trim() && !line.startsWith('#')) {
    const [key, val] = line.split('=');
    if (key && val) process.env[key.trim()] = val.trim();
  }
}
const { initDb } = await import('../lib/init-db.js');
await initDb();
process.exit(0);
