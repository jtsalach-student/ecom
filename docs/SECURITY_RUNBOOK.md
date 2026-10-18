# GCP Security & Operational Runbook (OWASP ASVS 5.0 Baseline)

## 1. Security Architecture Principles
1. **Never Hardcode Secrets**: All database connection strings, JWT signing keys, and Paystack secret keys are loaded exclusively from `.env.local` or container environment variables.
2. **Contextual Role-Based Access Control (RBAC)**:
   - Platform roles (`PLATFORM_SUPER_ADMIN`) cannot view private customer transactions without an audited support access ticket.
   - Tenant roles (`TENANT_OWNER`, `STORE_MANAGER`, `CASHIER`) are constrained to their respective `tenantId`.
   - Cashiers can perform POS sales and lookups, but cannot alter product catalog prices or delete stock ledger records.
3. **Cryptographic Webhook Verification**:
   - Paystack webhooks require HMAC SHA-512 authentication.
   - Raw payloads and signatures are logged in `payment_events`.
   - Idempotent deduplication prevents double-fulfillment and replayed requests.
4. **Input Validation & Output Encoding**:
   - Every API endpoint validates payloads using Zod schemas (`OrderSchema`, `LoginRequestSchema`, `TenantSchema`).
   - SQL queries are executed via Drizzle ORM parameterized queries or tagged templates, preventing SQL injection.
