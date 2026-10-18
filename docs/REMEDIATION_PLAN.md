# GCP Autonomous Remediation Plan (Audit Backlog A01–A23)
**Gadget Commerce Platform (GCP) — Corrective Implementation Matrix**
*Date: 18 October 2026 | Branch: remediation/master-prompt-v1*

---

## 1. Audit Defect Catalog (A01 – A23)

| ID | Category | Defect Description | Target Fix & Implementation Plan | Target Phase |
|---|---|---|---|---|
| **A01** | Security / Auth | Password-unchecked login in `/auth/login` | Implement Argon2id/bcrypt password hashing in database schema, verify password hash during login, reject invalid passwords with generic error messages and rate limiting. | Phase 2 |
| **A02** | Multi-Tenancy | Unbound request/token tenant override | Enforce token-bound tenant resolution. Caller cannot supply arbitrary `x-tenant-id` to access another tenant; tenant must match authenticated user's authorized memberships or verified domain. | Phase 2 |
| **A03** | Auth / Privacy | Public order data & unauthenticated mutations | Require authentication for staff operations; require customer ownership or cryptographically secure signed capability for order tracking; rate-limit public lookups. | Phase 2, Phase 6 |
| **A04** | Commerce | Client-selected PAID status and grand totals | Calculate all line totals, VAT, delivery fees, and discounts strictly server-side; reject client-provided financial totals or status overrides. | Phase 3, Phase 4 |
| **A05** | Payments | Generated fake Paystack checkout URL | Call real Paystack API `/transaction/initialize` using test merchant secret; return real authorization URL; fail safely if unconfigured without generating fake URLs. | Phase 4 |
| **A06** | Payments | Webhook HMAC signature bypass & stringified payload | Remove test-mode signature bypass; capture raw request body buffer before JSON parsing; verify HMAC SHA-512 constant-time against `PAYSTACK_SECRET_KEY`. | Phase 4 |
| **A07** | Database | Runtime in-memory Map persistence fallback | Replace in-memory repository with real Neon PostgreSQL database backed by Drizzle ORM; reject in-memory persistence in non-test mode. | Phase 1 |
| **A08** | Admin / POS | Fixture-based admin operations | Connect Retail Admin and Platform Admin to real backend REST APIs backed by live database records; remove synthetic sample orders from production view. | Phase 5, Phase 8 |
| **A09** | UI / UX | Missing interactive login UI across apps | Implement dedicated Login pages in `storefront`, `retail-admin`, and `platform-admin` with accessible forms, password toggle, error states, and session persistence. | Phase 2 |
| **A10** | Admin | Nonfunctional procurement, repair, and settings controls | Wire procurement, PO creation, goods receipt, repair card updates, and brand settings forms to working backend endpoints and database tables. | Phase 5, Phase 6 |
| **A11** | 3D Engine | Procedural geometry presented as authentic hardware | Enforce exact-model GLB package loading with asset provenance metadata; if unverified/missing, display truthful standard media fallback with clear disclosure. | Phase 7 |
| **A12** | 3D Engine | Missing scroll/pointer animation bindings | Implement normalized pointer interaction on login screen with damped interpolation and bounds clamping; synchronize scroll-driven timeline scrubber with viewport. | Phase 2, Phase 7 |
| **A13** | Compliance | Unsupported brand, warranty, and analytics claims | Remove unsupported claims (e.g. fabricated 74% affinity, unverified dealership claims); label provisional brand assets and ground all analytics in real ledger records. | Phase 3, Phase 8 |
| **A14** | Config | Hardcoded `http://localhost:4000` calls in client apps | Replace hardcoded URLs with `process.env.NEXT_PUBLIC_API_URL` and server-side environment configuration with fallback guards. | Phase 0, Phase 3 |
| **A15** | Infrastructure | Incomplete Neon function source (`hello.ts` placeholder) | Replace `hello.ts` placeholder with an actual production-grade Neon Function (e.g., Paystack webhook receiver / order reconciliation handler) declared in `neon.ts`. | Phase 1 |
| **A16** | Accessibility | Missing WCAG 2.2 AA semantics & keyboard accessibility | Add explicit ARIA attributes, focus management, keyboard navigation, accessible contrast, and screen reader announcements across all user journeys. | Phase 9 |
| **A17** | Tooling | Inadequate Turborepo build coverage & test evidence | Wire Turbo build pipelines across all apps and packages; ensure `pnpm build` and test suites execute real tasks with zero skips. | Phase 0, Phase 10 |
| **A18** | Financial | Money represented with floating point `real` | Convert all money amounts in database and contracts to integer subunits (pesewas/cents) or arbitrary-precision decimals; enforce exact rounding. | Phase 1, Phase 4 |
| **A19** | Security | Missing security headers, CSRF, and HttpOnly cookies | Implement Helmet security headers, CORS allowlist, CSRF tokens for stateful writes, and HttpOnly/Secure/SameSite cookies. | Phase 2, Phase 9 |
| **A20** | Multi-Tenancy | Missing staff invitation & domain verification | Build staff invite workflow with expiring cryptographic tokens; verify domain ownership via DNS TXT record checks. | Phase 2, Phase 8 |
| **A21** | Concurrency | Stock reservation concurrency races | Implement transactional PostgreSQL row-level locking (`SELECT ... FOR UPDATE`) in stock reservation to prevent overselling across multi-process workers. | Phase 1, Phase 5 |
| **A22** | 3D Pipeline | Missing 3D asset review & approval lifecycle | Implement state machine: `DRAFT -> TECHNICAL_REVIEW -> VISUAL_REVIEW -> APPROVED -> PUBLISHED -> ARCHIVED` with reviewer provenance tracking. | Phase 7 |
| **A23** | Reliability | Missing operational runbooks and disaster recovery tests | Create explicit disaster recovery procedures, backup verification runbooks, and health monitoring endpoints with degraded state reporting. | Phase 10 |

---

## 2. Phased Execution Roadmap & Machine-Checkable Gates

- **Phase 0 (Baseline & Containment)**: Map routes, capture current baseline, wire config variables, remove fake mock endpoints, create evidence docs. *Gate: All routes mapped, zero fake claims in prod paths, reproducible baseline build.*
- **Phase 1 (Neon Infrastructure & Durable Data)**: Replace in-memory repository with real Drizzle PostgreSQL queries on Neon, convert money to integer subunits, enforce atomic stock reservations with `FOR UPDATE` locks, implement actual Neon Function. *Gate: Migrations apply cleanly, records survive server restart, concurrent stock allocation race test passes.*
- **Phase 2 (Identity, Tenant Isolation & Interactive Login)**: Argon2id password hashing, verify tokens server-side with strict tenant boundary enforcement, build interactive login pages with pointer disassembly visual. *Gate: Anonymous access denied, wrong password rejected, cross-tenant access blocked.*
- **Phase 3 (Catalogue, Pricing & Tenant Branding)**: Authoritative server-side pricing engine, dynamic tenant branding tokens, real media provenance manifests, provisional brand tagging. *Gate: Tampered prices rejected, brand updates persist, no fabricated claims.*
- **Phase 4 (Paystack Checkout & Financial Integrity)**: Real Paystack API initialization, raw body HMAC SHA-512 webhook verification, idempotent payment events, ledger-backed refund workflows. *Gate: Fake URLs rejected, HMAC test passes with whitespace sensitivity, payment replays deduplicated.*
- **Phase 5 (Inventory, Procurement & POS)**: Multi-branch inventory ledger, purchase orders, goods receipt notes, barcode POS search, cashier shifts with cash float reconciliation. *Gate: Complete POS sale decrements branch stock and logs immutable transaction.*
- **Phase 6 (Orders, Fulfillment & After-Sales)**: Order state machine transitions, dispatch/tracking workflows, serial-linked warranty registration, repair job cards, trade-in valuations. *Gate: Order lifecycles pass role/state transition validation.*
- **Phase 7 (Exact-Model Cinematic 3D Engine)**: Model-verified 3D package format, asset review state machine, scroll/pointer choreography, fallback for missing assets. *Gate: Exact model verified or truthful fallback displayed; no procedural slab labeled authentic.*
- **Phase 8 (Analytics, Grounded AI & Superadmin)**: Ledger-reconciled executive KPIs, grounded AI assistant via Neon AI Gateway, multi-tenant subscription management. *Gate: AI answers grounded in real stock; executive metrics balance with ledger.*
- **Phase 9 (Accessibility, Security & Performance Hardening)**: WCAG 2.2 AA automated/manual checks, security headers, rate limiting, responsive viewport testing. *Gate: Zero critical accessibility/security defects.*
- **Phase 10 (Release Candidate & Production Evidence)**: `npm run build` verification, CI workflows, disaster recovery runbooks, final handoff ledger. *Gate: Clean Turbo production build, all regression suites pass.*
