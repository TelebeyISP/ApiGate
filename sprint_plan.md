# Telebey MVP: 4-Week Sprint Plan

This document outlines the execution strategy for the Telebey MVNO platform, designed for a 2-developer team (1 Backend/DevOps, 1 Frontend/Integration).

---

## Git Workflow & Branching
- **Naming Convention**: `feat/week-X/feature-name`, `fix/issue-description`, `docs/update-name`
- **Main Branch**: `main` (Production-ready)
- **Develop Branch**: `develop` (Integration branch)
- **Review Policy**: All PRs require 1 peer review and successful CI build.

---

## Week 1: Backend Foundation & Identity
**Goal**: Establish the core API, database schema, and secure authentication flow.

| Day | Task | Modules/Files | Definition of Done (DoD) |
|:---|:---|:---|:---|
| **Mon** | Project Scaffolding | `apps/api/src/*`, [docker-compose.yml](file:///Users/marktplaats/Desktop/Telebey/docker-compose.yml) | NestJS app running with Docker, Swagger active. |
| **Tue** | Database Design | `src/database/migrations/`, `src/users/entities/` | Schema applied to Postgres with 100% TypeORM sync. |
| **Wed** | Auth System (JWT) | `src/auth/*`, `src/auth/guards/*.guard.ts` | Login/Register/Refresh work with 15m AT/7d RT. |
| **Thu** | Security Hardening | [src/common/services/security.service.ts](file:///Users/marktplaats/Desktop/Telebey/telebey-platform/apps/api/src/common/services/security.service.ts) | AES-256 implemented; encryption key managed in .env. |
| **Fri** | API Key Management | `src/plans/dto/*`, `src/common/interceptors/*` | Initial Plans API reachable; logging interceptor active. |

---

## Week 2: Telecom Core (SIM & Open5GS)
**Goal**: Integrate with the 5G Core network and manage subscriber lifecycles.

| Day | Task | Modules/Files | Definition of Done (DoD) |
|:---|:---|:---|:---|
| **Mon** | SIM Management API | [src/sim/sim.controller.ts](file:///Users/marktplaats/Desktop/Telebey/telebey-platform/apps/api/src/sim/sim.controller.ts), `src/sim/entities/` | CRUD for SIMs; status enums (active/blocked) locked. |
| **Tue** | Open5GS Integration | `src/open5gs/subscriber.service.ts` | Connection to Open5GS MongoDB established. |
| **Wed** | Subscriber Lifecycle | [src/open5gs/open5gs.module.ts](file:///Users/marktplaats/Desktop/Telebey/telebey-platform/apps/api/src/open5gs/open5gs.module.ts) | Provisioning/Deprovisioning (IMSI/KI) verified in logs. |
| **Thu** | Ownership Guard | [src/common/guards/sim-ownership.guard.ts](file:///Users/marktplaats/Desktop/Telebey/telebey-platform/apps/api/src/common/guards/sim-ownership.guard.ts) | Horizontal privilege escalation impossible (403 fix). |
| **Fri** | Usage Tracking | [src/sim/sim.service.ts](file:///Users/marktplaats/Desktop/Telebey/telebey-platform/apps/api/src/sim/sim.service.ts) (Usage logic) | Data usage increments correctly in Postgres. |

---

## Week 3: GSMA Gateway & Billing
**Goal**: Implement security APIs (Number Verify, SIM Swap) and payment processing.

| Day | Task | Modules/Files | Definition of Done (DoD) |
|:---|:---|:---|:---|
| **Mon** | GSMA CAMARA Auth | [src/gsma/gsma-gateway.service.ts](file:///Users/marktplaats/Desktop/Telebey/telebey-platform/apps/api/src/gsma/gsma-gateway.service.ts) | OAuth2 handshake with GSMA Sandbox succeeds. |
| **Tue** | Number Verification | `src/gsma/verification.controller.ts` | Phone-to-SIM matching logic returns verified boolean. |
| **Wed** | SIM Swap Detection | `src/gsma/fraud.controller.ts` | Fraud checks integrated into activation flow. |
| **Thu** | Data Plan Store | [src/plans/plans.service.ts](file:///Users/marktplaats/Desktop/Telebey/telebey-platform/apps/api/src/plans/plans.service.ts) | Pricing logic and plan assignments working. |
| **Fri** | Audit & Forensics | [src/common/interceptors/audit.interceptor.ts](file:///Users/marktplaats/Desktop/Telebey/telebey-platform/apps/api/src/common/interceptors/audit.interceptor.ts) | Every GSMA/Payment call hashed and logged. |

---

## Week 4: Frontend & Deployment
**Goal**: Professional UI implementation and production rollout.

| Day | Task | Modules/Files | Definition of Done (DoD) |
|:---|:---|:---|:---|
| **Mon** | UI Kit & Layout | `apps/telebey-dashboard/src/components/*` | Sidebar/Header/Footer with HSL branding applied. |
| **Tue** | Dashboard Views | [src/app/dashboard/page.tsx](file:///Users/marktplaats/Desktop/Telebey/telebey-platform/apps/telebey-dashboard/src/app/dashboard/page.tsx), [/sim/page.tsx](file:///Users/marktplaats/Desktop/Telebey/telebey-platform/apps/telebey-dashboard/src/app/sim/page.tsx) | Usage charts (Recharts) populated via React Query. |
| **Wed** | Verification Flow | [src/app/verify/page.tsx](file:///Users/marktplaats/Desktop/Telebey/telebey-platform/apps/telebey-dashboard/src/app/verify/page.tsx) | Multi-step mobile verification with GSMA feedback. |
| **Thu** | Production Docker | [docker-compose.prod.yml](file:///Users/marktplaats/Desktop/Telebey/docker-compose.prod.yml), [nginx.conf](file:///Users/marktplaats/Desktop/Telebey/nginx.conf) | SSL termination and multi-stage builds optimized. |
| **Fri** | QA & Handover | [walkthrough.md](file:///Users/marktplaats/.gemini/antigravity/brain/049c4104-6c47-4017-af79-d2d259a2b49f/walkthrough.md), [telebey_architecture.md](file:///Users/marktplaats/.gemini/antigravity/brain/049c4104-6c47-4017-af79-d2d259a2b49f/telebey_architecture.md) | E2E tests pass; Handover documentation complete. |

---

## Risk Register

| Risk | Impact | Probability | Mitigation Strategy |
|:---|:---|:---|:---|
| **GSMA API Latency** | High | Medium | Implement Redis caching for verification results (TTL 5m). |
| **Open5GS DB Desync** | Critical | Low | Transactional wrapper to rollback Postgres if Open5GS fails. |
| **OOM on Charts** | Medium | Medium | Aggregate usage data on backend; don't pipe 10k raw data points. |
| **Token Hijacking** | Critical | Low | RT Rotation + Refresh Reuse Detection (Implemented). |
| **Deployment Drift** | High | High | Strict Docker versioning (alpine-20); avoid `latest` tags. |

---

## Testing Strategy
1. **Unit (Jest)**: Target 80% coverage on [AuthService](file:///Users/marktplaats/Desktop/Telebey/telebey-platform/apps/api/src/auth/auth.service.ts#10-102) and [SecurityService](file:///Users/marktplaats/Desktop/Telebey/telebey-platform/apps/api/src/common/services/security.service.ts#5-26).
2. **Integration (SuperTest)**: Verify `/sim/activate` and `/gsma/verify` contract matches.
3. **E2E (Playwright)**: Test the full "User Login -> View Usage -> Purchase Plan" happy path.

---

## Developer Onboarding Checklist
- [ ] Install Docker Desktop & Node.js 20.
- [ ] Clone repository: `git clone https://github.com/telebey/platform`.
- [ ] Copy env: `cp .env.example .env`.
- [ ] Spin up infra: `docker-compose up -d postgres redis mongo`.
- [ ] Sync Schema: `cd apps/api && npm run migration:run`.
- [ ] Seed Data: `npm run seed:plans`.
