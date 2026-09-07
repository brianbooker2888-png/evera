# EVERA

**Working title:** EVERA  
**Brand line:** Live one life. Shape generations.

EVERA is a local-first persistent life and world simulation. The player is one person inside a world that continues independently.

## Current build — v0.7.0 Grounded Narration & Life Chapters

### Foundation
- React + TypeScript + Vite
- Mobile-first dark UI
- Deterministic seeded simulation engine
- Local IndexedDB autosave and offline PWA shell
- Five primary areas: Life, People, World, Money, Timeline
- GitHub Actions release gate: strict simulation typecheck, Vitest and production build

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
- Narration-specific canonical context compiler
- Explicit separation of canonical facts, beliefs and rumors
- Speaker knowledge filtering so NPCs cannot narrate secrets they do not know
- Personality-, age- and relationship-aware voice profiles
- Deterministic offline narration provider with no network dependency
- Free-text conversations apply simulation consequences first, then narrate the reply
- Annual Life Chapters generated from recorded events, memories, careers, sports and business facts
- Persistent autobiography inside TIMELINE
- Narration mode setting for offline or enhanced-when-available behavior
- Provider registry and vendor-neutral remote adapter for future online AI providers
- Mandatory offline fallback if an optional provider is unavailable

Remote providers are not authoritative and never receive the full save. A provider may only receive a sanitized scene packet compiled from facts the narration layer is allowed to express.

### Save compatibility
- v1 → v2 → v3 → v4 → v5 → v6 → v7 migrations
- Prior family, relationship, career, finance, sports, business, memory and timeline state is preserved while later modules are added

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

## Architecture principle

> The database is truth. AI is narration.

> The simulation decides what happened. Narration decides how it is expressed.

Core simulation remains deterministic and fully playable offline. AI may enrich player-facing language, but it may not invent canonical facts or decide outcomes.
