# EVERA

**Working title:** EVERA  
**Brand line:** Live one life. Shape generations.

EVERA is a local-first persistent life and world simulation. The player is one person inside a world that continues independently.

## Current build — v0.9.0 Health & Healthcare

### Foundation
- React + TypeScript + Vite
- Mobile-first dark UI
- Deterministic seeded simulation engine
- Local IndexedDB autosave and offline PWA shell
- Five primary areas: Life, People, World, Money, Timeline
- GitHub Actions release gate: production dependency security gate, strict simulation typecheck, cumulative Vitest suite, production build and temporary Capacitor wrapper generation

### Human simulation
- Multidimensional traits, values, needs, health, habits, goals and memories
- Tier 1 / Tier 2 / Tier 3 NPC simulation
- Autonomous goal-directed NPC decisions
- Directional relationships, person-specific knowledge and canonical secrets

### Health & healthcare
- Canonical v8 health records layered around the existing hidden human-health model
- Person-specific health profiles for instantiated people
- Hidden preventive, nutrition, sleep, substance, chronic-condition, accident and care-access factors
- Persistent acute, chronic, mental-health and injury conditions
- Separate suspected vs diagnosed state so the player does not receive omniscient medical information
- Condition recovery, long-term management and treatment history
- Preventive, primary-care, urgent-care, emergency, specialist and therapy encounter model
- Employer health coverage integrated with existing employment benefits and insurance premiums
- Deductible and coinsurance tracking by calendar year
- Medication cost, effectiveness and adherence state
- Medical bills when current cash cannot cover patient responsibility
- Past-due medical costs feed back into security and mental load
- Player-directed preventive care and treatment choices inside LIFE
- Health events affect energy, stress and other human-state consequences without exposing hidden risk percentages
- Diagnosed medical history can enter grounded narration and annual Life Chapters only when recorded by the simulation

Mortality is intentionally not enabled in v0.9. Death, estates, inheritance and controlled-character continuation are being built together in Phase 10 so the simulation cannot strand a life after death without a valid continuation path.

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
- Healthcare spending uses the same checking account and financial ledger as the rest of the simulation

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
- Health facts are only narratable as canonical medical facts after the simulation records a diagnosis or healthcare event

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
- Canonical simulation schema is v8 in app v0.9 because health/medical history is gameplay state
- v1 → v2 → v3 → v4 → v5 → v6 → v7 → v8 migration paths remain supported
- v7 saves are upgraded with health profiles without deleting relationship, family, finance, sports, business, narration or timeline history

See `docs/CLOUD_NATIVE.md` for cloud/security/Capacitor setup and `docs/HEALTH_ARCHITECTURE.md` for the health simulation boundary.

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

> Hidden risk is simulation state. Known medical history is player-facing state.

Core simulation remains deterministic and fully playable offline. AI, accounts and cloud services may enrich the experience, but they may not become prerequisites for the life simulation.
