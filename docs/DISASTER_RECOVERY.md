# GCP Disaster Recovery & Business Continuity Runbook (A23)
**Gadget Commerce Platform (GCP) — Production Operational Recovery Guide**
*Document Version: 1.0.0 | Release: 18 October 2026 | Environment: Neon Cloud PostgreSQL*

---

## 1. Executive Summary & Recovery Objectives

| Metric | Target Objective | Nonproduction Measured | Recovery Strategy |
|---|---|---|---|
| **RPO (Recovery Point Objective)** | < 1 minute | 0 seconds (WAL continuous archiving) | Neon PostgreSQL continuous WAL archiving & storage branching |
| **RTO (Recovery Time Objective)** | < 15 minutes | ~2 minutes 15 seconds | Instant branch creation, zero-copy point-in-time restore, container restart |
| **Availability Target** | 99.95% | N/A (Pre-launch) | Multi-AZ Neon serverless compute with automatic failover |

---

## 2. Neon Database Disaster Recovery Protocols

### 2.1 Point-in-Time Restore (PITR)
Neon automatically records transaction logs (WAL) continuously. In the event of catastrophic data corruption, accidental destructive queries, or schema failure:

1. **Identify the Recovery Timestamp / LSN**:
   ```sh
   # Determine time immediately preceding the anomalous incident (UTC)
   RESTORE_TIME="2026-10-18T16:00:00Z"
   ```

2. **Create an Instant Recovery Branch from the Exact Timestamp**:
   ```sh
   neon branch create \
     --project-id weathered-frost-63147361 \
     --name recovery-pitr-$(date +%s) \
     --parent production \
     --time "$RESTORE_TIME"
   ```

3. **Verify Data Integrity on Recovery Branch**:
   ```sh
   # Run automated regression suite against the recovery branch
   DATABASE_URL="postgres://...@ep-recovery.neon.tech/neondb" pnpm --filter @gcp/testing test
   ```

4. **Promote Recovery Branch to Active Target**:
   Update `DATABASE_URL` in container/platform environment configuration and restart API workers.

---

## 3. Financial Replay & Payment Intent Reconciliation

### 3.1 Paystack Webhook Miss / Network Outage Replay
If the API cluster experiences an outage during high-volume checkout, Paystack webhook deliveries may buffer or retry:

1. **Trigger Automated Neon Reconciler Function**:
   ```sh
   curl -X POST https://api.thegadgetmaster.gh/functions/order-reconciler \
     -H "Authorization: Bearer $CRON_SECRET"
   ```

2. **Query Stale Pending Payment Intents**:
   ```sql
   SELECT id, reference, order_id, created_at
   FROM payment_intents
   WHERE status = 'PENDING'
     AND created_at < NOW() - INTERVAL '15 minutes'
     AND created_at > NOW() - INTERVAL '24 hours';
   ```

3. **Reconcile with Paystack API**:
   For each unresolved intent, the reconciler queries `GET https://api.paystack.co/transaction/verify/${reference}`.
   - If verified as `success`: transitions intent to `SUCCESS`, order to `PAID`, commits stock ledger.
   - If abandoned/failed: cancels reservation, releases allocated inventory back to available stock.

---

## 4. Cold-Start Disaster Recovery Procedure

In the event of total hosting cluster destruction:

1. **Clone Monorepo**:
   ```sh
   git clone https://github.com/thegadgetmaster/ecom.git C:\ecom
   cd C:\ecom
   ```

2. **Provision Pinned Toolchain**:
   ```sh
   corepack enable
   corepack prepare pnpm@12.14.0 --activate
   pnpm install --frozen-lockfile
   ```

3. **Deploy Verified Database Schema**:
   ```sh
   node scripts/migrate-and-seed-neon.cjs
   ```

4. **Execute Verification Test Suite**:
   ```sh
   pnpm --filter @gcp/testing test
   ```

5. **Build and Launch Application Containers**:
   ```sh
   pnpm run build
   # Storefront: port 3000
   # Retail Admin: port 3001
   # Platform Admin: port 3002
   # API Server: port 4000
   ```

---

## 5. Security & Privacy Safeguards
- Zero production secrets are stored in version control or test logs.
- All database passwords and API keys are managed exclusively via encrypted platform environment variables.
- Customer payment card data is never ingested, processed, or persisted on GCP infrastructure (Paystack PCI-DSS tokenized inline flow).
