const fs = require('fs');
const path = require('path');
const { neon } = require(path.join(__dirname, '../packages/database/node_modules/@neondatabase/serverless'));

const envContent = fs.readFileSync('.env.local', 'utf8');
const lines = envContent.split('\n');
const env = {};
for (const line of lines) {
  const match = line.match(/^\s*([\w_]+)\s*=\s*["']?(.*?)["']?\s*$/);
  if (match) {
    env[match[1]] = match[2];
  }
}

async function checkNeon() {
  console.log('Connecting to Neon via @neondatabase/serverless...');
  const connStr = env.DATABASE_URL;
  console.log('Target host:', connStr.split('@')[1]?.split('/')[0]);

  try {
    const sql = neon(connStr);
    const timeRes = await sql`SELECT NOW() as now, version() as version;`;
    console.log('CONNECTED TO NEON SUCCESSFULLY!');
    console.log('Database time:', timeRes[0].now);
    console.log('PostgreSQL version:', timeRes[0].version);

    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;`;
    console.log('Tables in database:', tables.map(r => r.table_name));
  } catch (err) {
    console.error('Neon connection error:', err);
  }
}

checkNeon();
