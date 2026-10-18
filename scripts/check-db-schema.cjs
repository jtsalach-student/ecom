const fs = require('fs');
const path = require('path');
const { neon } = require(path.join(__dirname, '../packages/database/node_modules/@neondatabase/serverless'));

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(l => {
  const m = l.match(/^\s*([\w_]+)\s*=\s*['"]?(.*?)['"]?\s*$/);
  if (m) env[m[1]] = m[2];
});

const sql = neon(env.DATABASE_URL);

async function check() {
  const usersCols = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'users'
  `;
  console.log('users columns:', usersCols.map(c => c.column_name));

  const ordersCols = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'orders'
  `;
  console.log('orders columns:', ordersCols.map(c => c.column_name));

  const inventoryCols = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'branch_inventory'
  `;
  console.log('branch_inventory columns:', inventoryCols.map(c => c.column_name));

  // Check if password_hash column exists on users
  const hasPasswordHash = usersCols.some(c => c.column_name === 'password_hash');
  if (!hasPasswordHash) {
    console.log('Adding password_hash column to users...');
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;`;
    console.log('Added password_hash column.');
  }

  // Update existing users with a valid bcrypt hash for 'GadgetMaster2026!'
  const bcrypt = require(path.join(__dirname, '../packages/auth/node_modules/bcryptjs'));
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync('GadgetMaster2026!', salt);

  await sql`UPDATE users SET password_hash = ${hash} WHERE password_hash IS NULL;`;
  console.log('Updated user password hashes with secure bcrypt hash for GadgetMaster2026!');

  const users = await sql`SELECT id, email, role, password_hash IS NOT NULL as has_hash FROM users`;
  console.log('Current users in Neon:', users);
}

check().catch(console.error);
