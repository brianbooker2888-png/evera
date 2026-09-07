# EVERA

**Working title:** EVERA  
**Brand line:** Live one life. Shape generations.

EVERA is a local-first persistent life and world simulation. The player is one person inside a world that continues independently.

## Current build — v0.5.0 Money, Housing & Wealth

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
- Recurring household obligations with persistent past-due balances
- Household-size groceries/utilities and childcare obligations
- Budget rules, emergency-fund targets and automated saving/investing
- Credit profiles, utilization, payment history, credit cards and debt
- Interest, delinquency, default, secured-debt consequences and bankruptcy records
- Insurance policies and lapse behavior
- Vehicle assets, depreciation, auto financing and repossession foundations
- Home purchases, mortgages, homeowners insurance, property values and housing-market exposure
- Deterministic investment markets, positions and net-worth accounting
- v1/v2/v3/v4 → v5 save migrations
- Interactive Money dashboard for accounts, debt, bills, credit, investments, vehicles, property and financial history

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
