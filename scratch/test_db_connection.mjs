import mysql from 'mysql2/promise';
import fs from 'fs';

async function testConnections() {
  const configs = [
    {
      name: "TCP Localhost",
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'prayog_india'
    },
    {
      name: "Hostinger Local",
      host: 'localhost',
      user: 'u523255408_prayogadmin',
      password: 'Admin@7209',
      database: 'u523255408_prayog_india'
    },
    {
      name: "TCP 127.0.0.1",
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'prayog_india'
    },
    {
      name: "XAMPP Socket",
      socketPath: '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock',
      user: 'root',
      password: '',
      database: 'prayog_india'
    }
  ];

  for (const config of configs) {
    if (config.socketPath && !fs.existsSync(config.socketPath)) {
      console.log(`Skipping ${config.name}: Socket path does not exist.`);
      continue;
    }
    
    console.log(`Testing ${config.name}...`);
    try {
      const connection = await mysql.createConnection(config);
      console.log(`✅ ${config.name} SUCCESS!`);
      const [rows] = await connection.query("SHOW TABLES");
      console.log(`Tables:`, rows.map(r => Object.values(r)[0]));
      await connection.end();
      return; // Stop if we find a working one
    } catch (err) {
      console.error(`❌ ${config.name} FAILED:`, err);
    }
  }
}

testConnections();
