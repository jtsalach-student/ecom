# GCP Blockers & External Dependency Tracking

| Blocker ID | Description | Severity | Impacted Phase | Mitigation / Action Required | Status |
|---|---|---|---|---|---|
| BLK-001 | Neon CLI Authentication / Service Entitlements | High | Phase 1 | Check `neon auth` / CLI status; verify project `weathered-frost-63147361` and branch `production` access. | Investigating |
| BLK-002 | Paystack Live Secrets & Merchant Credentials | Low (Dev/Test) | Phase 7 | Test keys to be injected via secure `.env.local`; sandbox tests will use verified mock/sandbox flows. | Managed |
| BLK-003 | Exact-Model 3D Asset Availability | Medium | Phase 6 | For models without verified CAD/glTF assets, use high-resolution verified multi-angle photography and standard media fallback per section 8.9. | Planned |
