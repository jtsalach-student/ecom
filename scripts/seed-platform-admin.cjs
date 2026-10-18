const fs = require('fs');
const path = require('path');
const { neon } = require(path.join(__dirname, '../packages/database/node_modules/@neondatabase/serverless'));
const bcrypt = require(path.join(__dirname, '../packages/auth/node_modules/bcryptjs'));

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(l => {
  const m = l.match(/^\s*([\w_]+)\s*=\s*['"]?(.*?)['"]?\s*$/);
  if (m) env[m[1]] = m[2];
});

const sql = neon(env.DATABASE_URL);

async function seedAdmin() {
  const hash = bcrypt.hashSync('GadgetMaster2026!', 10);
  await sql`
    INSERT INTO users (
      id, tenant_id, email, password_hash, full_name, phone, role, branch_id, is_active, mfa_enabled, created_at, updated_at
    )
    VALUES (
      'usr-platform-admin',
      NULL,
      'superadmin@gadgetcommerce.io',
      ${hash},
      'Platform Super Admin',
      '+233 20 000 0000',
      'PLATFORM_SUPER_ADMIN',
      NULL,
      true,
      true,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET password_hash = ${hash},
        role = 'PLATFORM_SUPER_ADMIN';
  `;
  console.log('Seeded Platform Super Admin user into Neon.');
}

seedAdmin().catch(console.error);
