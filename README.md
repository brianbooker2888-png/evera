# EVERA

**Working title:** EVERA  
**Brand line:** Live one life. Shape generations.

EVERA is a local-first persistent life and world simulation. The player is one person inside a world that continues independently.

## Current build — v0.6.0 Sports & Logistics Business

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
- Offline free-text conversation intent/tone handling
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
- Stored match moments for score/chance/turnover/big-play review and future visual rendering
- Interactive sports career, fixtures, match-moment and standings UI inside WORLD

### Logistics & warehousing business
- Separate personal and business finances
- Warehouse facilities with rent, capacity, automation and utilization
- Persistent employees with role, pay, productivity, reliability, morale and safety
- Customer contracts with demand, pricing, complexity and service targets
- Monthly productivity, inventory accuracy, service, safety, labor-cost, utilization, revenue and profit KPIs
- Business reputation, valuation, debt pressure, opportunities and failure risk
- Interactive hiring, staffing, pricing, facility and contract controls inside WORLD

### Save compatibility
- v1 → v2 → v3 → v4 → v5 → v6 migrations
- Prior family, relationship, career, finance, memory and timeline state is preserved while later modules are added

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

Core simulation remains deterministic and fully playable offline. AI may enrich player-facing language later, but it may not invent canonical facts or decide outcomes.
