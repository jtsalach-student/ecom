const fs = require('fs');
const path = require('path');
const { neon } = require(path.join(__dirname, '../packages/database/node_modules/@neondatabase/serverless'));

// 1. Read environment configuration
const envContent = fs.readFileSync('.env.local', 'utf8');
const lines = envContent.split('\n');
const env = {};
for (const line of lines) {
  const match = line.match(/^\s*([\w_]+)\s*=\s*["']?(.*?)["']?\s*$/);
  if (match) {
    env[match[1]] = match[2];
  }
}

const DATABASE_URL = env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function migrateAndSeed() {
  console.log('=== 1. CREATING DATABASE TABLES ON NEON POSTGRESQL ===');

  // Tenants Table
  await sql`
    CREATE TABLE IF NOT EXISTS tenants (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      primary_domain TEXT NOT NULL UNIQUE,
      additional_domains JSONB DEFAULT '[]'::jsonb,
      currency TEXT DEFAULT 'GHS' NOT NULL,
      locale TEXT DEFAULT 'en-GH' NOT NULL,
      timezone TEXT DEFAULT 'Africa/Accra' NOT NULL,
      tax_rate_percent REAL DEFAULT 0 NOT NULL,
      subscription_plan TEXT DEFAULT 'growth' NOT NULL,
      subscription_status TEXT DEFAULT 'active' NOT NULL,
      branding JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;

  // Users Table
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      tenant_id TEXT REFERENCES tenants(id),
      email TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      role TEXT NOT NULL,
      branch_id TEXT,
      is_active BOOLEAN DEFAULT true NOT NULL,
      mfa_enabled BOOLEAN DEFAULT false NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;

  // Branches Table
  await sql`
    CREATE TABLE IF NOT EXISTS branches (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(id),
      name TEXT NOT NULL,
      code TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      region TEXT DEFAULT 'Greater Accra' NOT NULL,
      country TEXT DEFAULT 'Ghana' NOT NULL,
      phone TEXT NOT NULL,
      is_warehouse BOOLEAN DEFAULT false NOT NULL,
      is_active BOOLEAN DEFAULT true NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;

  // Products Table
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(id),
      global_model_id TEXT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      model_number TEXT NOT NULL,
      category TEXT NOT NULL,
      condition TEXT DEFAULT 'BRAND_NEW' NOT NULL,
      description TEXT NOT NULL,
      short_description TEXT,
      specs JSONB DEFAULT '{}'::jsonb NOT NULL,
      images JSONB DEFAULT '[]'::jsonb NOT NULL,
      featured_image TEXT,
      animation_package_id TEXT,
      is_published BOOLEAN DEFAULT true NOT NULL,
      is_featured BOOLEAN DEFAULT false NOT NULL,
      warranty_months INTEGER DEFAULT 12 NOT NULL,
      tags JSONB DEFAULT '[]'::jsonb NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;

  // Product Variants Table
  await sql`
    CREATE TABLE IF NOT EXISTS product_variants (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(id),
      product_id TEXT NOT NULL REFERENCES products(id),
      sku TEXT NOT NULL,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      color_hex TEXT,
      storage TEXT,
      ram TEXT,
      retail_price REAL NOT NULL,
      compare_at_price REAL,
      cost_price REAL NOT NULL,
      barcode TEXT,
      gtin TEXT,
      weight_kg REAL DEFAULT 0.5 NOT NULL,
      image_url TEXT,
      is_active BOOLEAN DEFAULT true NOT NULL
    );
  `;

  // Product Compatibilities Table
  await sql`
    CREATE TABLE IF NOT EXISTS product_compatibilities (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(id),
      primary_product_id TEXT NOT NULL REFERENCES products(id),
      compatible_product_id TEXT NOT NULL REFERENCES products(id),
      relationship_type TEXT NOT NULL,
      notes TEXT
    );
  `;

  // Branch Inventory Table
  await sql`
    CREATE TABLE IF NOT EXISTS branch_inventory (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(id),
      branch_id TEXT NOT NULL REFERENCES branches(id),
      variant_id TEXT NOT NULL REFERENCES product_variants(id),
      quantity_on_hand INTEGER DEFAULT 0 NOT NULL,
      quantity_reserved INTEGER DEFAULT 0 NOT NULL,
      quantity_available INTEGER DEFAULT 0 NOT NULL,
      reorder_point INTEGER DEFAULT 5 NOT NULL,
      reorder_quantity INTEGER DEFAULT 20 NOT NULL,
      bin_location TEXT,
      last_counted_at TIMESTAMP
    );
  `;

  // Orders Table
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(id),
      order_number TEXT NOT NULL UNIQUE,
      customer_id TEXT,
      customer_email TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      channel TEXT DEFAULT 'STOREFRONT' NOT NULL,
      branch_id TEXT REFERENCES branches(id),
      status TEXT DEFAULT 'PENDING_PAYMENT' NOT NULL,
      subtotal REAL NOT NULL,
      discount_total REAL DEFAULT 0 NOT NULL,
      tax_total REAL DEFAULT 0 NOT NULL,
      delivery_fee REAL DEFAULT 0 NOT NULL,
      grand_total REAL NOT NULL,
      currency TEXT DEFAULT 'GHS' NOT NULL,
      notes TEXT,
      delivery_details JSONB NOT NULL,
      reservation_expires_at TIMESTAMP,
      paid_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;

  // Payment Intents Table
  await sql`
    CREATE TABLE IF NOT EXISTS payment_intents (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(id),
      order_id TEXT NOT NULL REFERENCES orders(id),
      reference TEXT NOT NULL UNIQUE,
      provider TEXT DEFAULT 'PAYSTACK' NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'GHS' NOT NULL,
      customer_email TEXT NOT NULL,
      status TEXT DEFAULT 'PENDING' NOT NULL,
      authorization_url TEXT,
      access_code TEXT,
      channel TEXT,
      provider_reference TEXT,
      paid_at TIMESTAMP,
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;

  // POS Shifts Table
  await sql`
    CREATE TABLE IF NOT EXISTS cashier_shifts (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(id),
      branch_id TEXT NOT NULL REFERENCES branches(id),
      user_id TEXT NOT NULL REFERENCES users(id),
      register_number TEXT NOT NULL,
      opening_cash REAL NOT NULL,
      closing_cash REAL,
      expected_closing_cash REAL NOT NULL,
      cash_difference REAL,
      total_sales_cash REAL DEFAULT 0 NOT NULL,
      total_sales_card REAL DEFAULT 0 NOT NULL,
      total_sales_momo REAL DEFAULT 0 NOT NULL,
      total_refunds REAL DEFAULT 0 NOT NULL,
      transaction_count INTEGER DEFAULT 0 NOT NULL,
      status TEXT DEFAULT 'OPEN' NOT NULL,
      opened_at TIMESTAMP DEFAULT NOW() NOT NULL,
      closed_at TIMESTAMP
    );
  `;

  // POS Transactions Table
  await sql`
    CREATE TABLE IF NOT EXISTS pos_transactions (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(id),
      branch_id TEXT NOT NULL REFERENCES branches(id),
      shift_id TEXT NOT NULL REFERENCES cashier_shifts(id),
      cashier_user_id TEXT NOT NULL REFERENCES users(id),
      receipt_number TEXT NOT NULL UNIQUE,
      order_id TEXT,
      payment_method TEXT NOT NULL,
      subtotal REAL NOT NULL,
      discount_total REAL DEFAULT 0 NOT NULL,
      tax_total REAL DEFAULT 0 NOT NULL,
      grand_total REAL NOT NULL,
      cash_tendered REAL,
      change_given REAL,
      items JSONB NOT NULL,
      customer_phone TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;

  console.log('Tables created or already present in Neon PostgreSQL!');

  console.log('=== 2. SEEDING AUTHENTIC GADGET MASTER DATA TO NEON ===');

  // Insert Tenant
  await sql`
    INSERT INTO tenants (
      id, name, slug, primary_domain, additional_domains, currency, locale, timezone, tax_rate_percent, subscription_plan, subscription_status, branding, created_at, updated_at
    ) VALUES (
      'the-gadget-master-gh',
      'The Gadget Master',
      'the-gadget-master',
      'thegadgetmaster.gh',
      '["gadgetmaster.com.gh", "store.thegadgetmaster.gh"]'::jsonb,
      'GHS',
      'en-GH',
      'Africa/Accra',
      0,
      'enterprise',
      'active',
      ${JSON.stringify({
        primaryColor: "#090D16",
        accentColor: "#3B82F6",
        secondaryColor: "#10B981",
        fontFamily: "Outfit, sans-serif",
        heroTitle: "Authentic Electronics & Cinematic Tech Exploration",
        heroSubtitle: "Accra's trusted electronics destination. Authentic smartphones, pro laptops, consoles, and Starlink with genuine warranty.",
        supportEmail: "support@thegadgetmaster.gh",
        supportPhone: "+233 24 477 6621 / +233 20 014 7950",
        socialLinks: {
          instagram: "https://instagram.com/thegadgetmastergh",
          facebook: "https://facebook.com/thegadgetmastergh",
          whatsapp: "https://wa.me/233244776621",
        },
        featuredProductId: "prod-iphone-16-pro-max",
        location: "Boundary Road, Underbridge Mall (near East Legon Police Station), East Legon, Accra",
      })}::jsonb,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      branding = EXCLUDED.branding,
      updated_at = NOW();
  `;

  // Insert Branches
  const branches = [
    {
      id: "branch-east-legon-flagship",
      tenantId: "the-gadget-master-gh",
      name: "East Legon Showroom & Flagship (Underbridge Mall)",
      code: "EL-01",
      address: "Boundary Road, Underbridge Mall, East Legon (near Police Station)",
      city: "Accra",
      region: "Greater Accra",
      country: "Ghana",
      phone: "+233 24 477 6621",
      isWarehouse: false,
    },
    {
      id: "branch-accra-flagship",
      tenantId: "the-gadget-master-gh",
      name: "Osu Oxford Street Retail Store",
      code: "ACC-01",
      address: "74 Oxford Street, Osu",
      city: "Accra",
      region: "Greater Accra",
      country: "Ghana",
      phone: "+233 24 456 7890",
      isWarehouse: false,
    },
    {
      id: "branch-kumasi-hub",
      tenantId: "the-gadget-master-gh",
      name: "Kumasi Retail Hub (Ahodwo)",
      code: "KMS-01",
      address: "Ahodwo Roundabout, Commercial Hub",
      city: "Kumasi",
      region: "Ashanti Region",
      country: "Ghana",
      phone: "+233 20 888 1234",
      isWarehouse: false,
    },
    {
      id: "branch-central-warehouse",
      tenantId: "the-gadget-master-gh",
      name: "Spintex Logistics & Fulfillment Center",
      code: "HUB-01",
      address: "Plot 18 Spintex Road Industrial Area",
      city: "Accra",
      region: "Greater Accra",
      country: "Ghana",
      phone: "+233 30 299 4455",
      isWarehouse: true,
    },
  ];

  for (const b of branches) {
    await sql`
      INSERT INTO branches (id, tenant_id, name, code, address, city, region, country, phone, is_warehouse, is_active, created_at)
      VALUES (${b.id}, ${b.tenantId}, ${b.name}, ${b.code}, ${b.address}, ${b.city}, ${b.region}, ${b.country}, ${b.phone}, ${b.isWarehouse}, true, NOW())
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        address = EXCLUDED.address,
        phone = EXCLUDED.phone;
    `;
  }

  // Insert Users
  const users = [
    {
      id: "usr-owner-01",
      tenantId: "the-gadget-master-gh",
      email: "owner@thegadgetmaster.gh",
      fullName: "Kwame Mensah",
      phone: "+233 24 477 6621",
      role: "TENANT_OWNER",
      branchId: "branch-east-legon-flagship",
      mfaEnabled: true,
    },
    {
      id: "usr-manager-01",
      tenantId: "the-gadget-master-gh",
      email: "manager.accra@thegadgetmaster.gh",
      fullName: "Abena Osei",
      phone: "+233 24 333 4455",
      role: "STORE_MANAGER",
      branchId: "branch-east-legon-flagship",
      mfaEnabled: false,
    },
    {
      id: "usr-cashier-01",
      tenantId: "the-gadget-master-gh",
      email: "cashier.eastlegon@thegadgetmaster.gh",
      fullName: "Kofi Boateng",
      phone: "+233 20 014 7950",
      role: "CASHIER",
      branchId: "branch-east-legon-flagship",
      mfaEnabled: false,
    },
  ];

  for (const u of users) {
    await sql`
      INSERT INTO users (id, tenant_id, email, full_name, phone, role, branch_id, is_active, mfa_enabled, created_at, updated_at)
      VALUES (${u.id}, ${u.tenantId}, ${u.email}, ${u.fullName}, ${u.phone}, ${u.role}, ${u.branchId}, true, ${u.mfaEnabled}, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        role = EXCLUDED.role;
    `;
  }

  console.log('Seeded tenant, branches, and staff users to Neon!');
}

migrateAndSeed().catch(console.error);
