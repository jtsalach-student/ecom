# GCP Blockers & External Dependency Tracking
**Gadget Commerce Platform (GCP) — Authoritative Blocker Log**
*Last Updated: 18 October 2026 | Branch: remediation/master-prompt-v1*

---

## Active External Blockers & Content Rights

| Blocker ID | Description | Severity | Impacted Phase | Attempted Action & Impact | User Action Required | Status |
|---|---|---|---|---|---|---|
| **BLK-001** | **Third-Party Brand Trademark & Commercial Asset Rights** | High | Phase 3 | Attempted web discovery for official logo vector assets of "The Gadget Master". Impact: System must use clearly labeled provisional branding without claiming official endorsement. | Tenant operator must supply signed license/authorization and official high-resolution vector assets. | **BLOCKED** (Provisional Theme in use) |
| **BLK-002** | **Proprietary Hardware Disassembly CAD/GLB Models** | High | Phase 7 | Model A3296 exact internal component geometries require manufacturer/authorized CAD/glTF assets. Impact: Procedural geometry cannot be labeled "verified internal hardware". | Provide licensed manufacturer GLB model with technical review sign-off. Truthful photography fallback is active. | **BLOCKED** (Media fallback enabled) |
| **BLK-003** | **Paystack Live Merchant Account Activation** | Medium | Phase 4 | Live settlements and live transactions require a verified Ghanaian registered business bank account. Impact: Live charges cannot be processed; test keys used. | Merchant must complete KYC and provide live production API keys via vault/env when ready for live launch. | **BLOCKED** (Test sandbox mode active) |
| **BLK-004** | **Neon Functions Deploy Authentication in CI/Headless** | Medium | Phase 1 | `neon deploy` requires interactive browser login or `NEON_API_KEY`. Local direct database connectivity is fully operational. | Operator to set `NEON_API_KEY` in environment if headless CLI deployment is required. | **MANAGED** (Direct PostgreSQL operational) |

---

## Handling Policy
Per Directive 4 & 8: No blocked item will be substituted with fake claims or mock production bypasses. All blocked deliverables remain explicitly labeled blocked while independent application logic continues autonomously.
