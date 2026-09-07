# EVERA

**Working title:** EVERA  
**Brand line:** Live one life. Shape generations.

EVERA is a local-first persistent life and world simulation. The player is one person inside a world that continues independently.

## Current build — v0.8.0 Optional Cloud Sync & Native Packaging

### Foundation
- React + TypeScript + Vite
- Mobile-first dark UI
- Deterministic seeded simulation engine
- Local IndexedDB autosave and offline PWA shell
- Five primary areas: Life, People, World, Money, Timeline
- GitHub Actions release gate: production dependency security gate, strict simulation typecheck, Vitest, production build and Capacitor wrapper generation

### Human simulation
- Multidimensional traits, values, needs, health, habits, goals and memories
- Tier 1 / Tier 2 / Tier 3 NPC simulation
- Autonomous goal-directed NPC decisions
- Directional relationships, person-specific knowledge and canonical secrets

### Relationships, family & households
- Dating → exclusivity → cohabitation → engagement → marriage → breakup/divorce
- Autonomous NPC-to-NPC romance
- Household schedules, labor and finance styles
- Free-text conversation intent/tone handling that works offline
- Pregnancy, children, parenting, step-family links, custody and co-parenting foundations

### Education & careers
- Persistent schools, universities, trade schools, employers and job openings
- Tuition, scholarships, GPA, credits, student debt and credentials
- Skills, job applications, interviews, offers and employment history
- Employment contracts with salary, schedules, benefits, performance and satisfaction
- Contract-driven payroll and labor-market simulation

### Money, housing & wealth
- Canonical checking, savings, brokerage and retirement accounts
- Recurring obligations, childcare, budgets, savings/investment rules and past-due balances
- Credit cards, loans, APR, utilization, delinquency, default and bankruptcy
- Insurance, vehicles, auto financing, mortgages, homeownership and housing-market exposure
- Deterministic investment markets, retirement accounts and net-worth accounting

### Sports
- Persistent fictional soccer and American-football leagues, teams, rosters and fixtures
- Soccer academy → professional pathway
- American football prep → college → professional pathway
- Athlete and head-coach careers using one deterministic match engine
- Training, fitness, fatigue, morale, injuries and recovery
- Coach tactics, development, leadership and reputation
- Sports contracts and payroll integrated with the same checking/finance system
- Persistent season statistics and team standings
- Stored match moments for future visual rendering
- Interactive sports career, fixtures, match-moment and standings UI inside WORLD

### Logistics & warehousing business
- Separate personal and business finances
- Warehouse facilities with rent, capacity, automation and utilization
- Persistent employees with role, pay, productivity, reliability, morale and safety
- Customer contracts with demand, pricing, complexity and service targets
- Monthly productivity, inventory accuracy, service, safety, labor-cost, utilization, revenue and profit KPIs
- Business reputation, valuation, debt pressure, opportunities and failure risk
- Interactive hiring, staffing, pricing, facility and contract controls inside WORLD

### Grounded narration
- Canonical context compiler with fact / belief / rumor separation
- Speaker knowledge and secret filtering
- Personality-, age- and relationship-aware voice profiles
- Deterministic offline narration provider with mandatory fallback
- Annual Life Chapters and persistent autobiography inside TIMELINE
- Provider registry and vendor-neutral remote adapter
- Same-origin Netlify narration gateway so optional provider secrets remain server-side

### Optional cloud & cross-device sync
- Local IndexedDB remains the authoritative save while offline
- Device/revision metadata is stored separately from simulation state
- Deterministic world checksums
- Optional Supabase email-link authentication and cloud save transport
- Row-level-security schema included in `docs/supabase-schema.sql`
- Safe upload/download when only one side changed
- Explicit conflict flow when two devices independently advance the same life
- No field-level auto-merge of divergent simulation timelines
- Cloud failures never block local play or local saving

### Native packaging
- Capacitor configuration for one shared web/iOS/Android codebase
- Working bundle identifier `com.evera.game` while EVERA remains a working brand
- Scripts for adding, syncing and opening iOS/Android projects
- CI generates temporary iOS and Android wrappers to verify packaging compatibility
- Generated platform projects are not the source of truth; React/TypeScript remains the core application

### Save compatibility
- Canonical simulation save schema remains v7 in app v0.8 because cloud/device metadata is infrastructure, not gameplay state
- v1 → v2 → v3 → v4 → v5 → v6 → v7 migrations remain supported

See `docs/CLOUD_NATIVE.md` for cloud, security and Capacitor setup.

## Run

```bash
npm install
npm run dev
```

## Verify

```bash
npm run typecheck:simulation
npm test
npm run build
```

## Architecture principles

> The database is truth. AI is narration.

> The simulation decides what happened. Narration decides how it is expressed.

> Offline is the baseline. Cloud is an enhancement.

Core simulation remains deterministic and fully playable offline. AI, accounts and cloud services may enrich the experience, but they may not become prerequisites for the life simulation.
