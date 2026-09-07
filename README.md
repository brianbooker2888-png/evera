# EVERA

**Working title:** EVERA  
**Brand line:** Live one life. Shape generations.

EVERA is a local-first persistent life and world simulation. The player is one person inside a world that continues independently.

## Current build — v0.11.0 Lifestyle, Daily Life & Travel

### Foundation
- React + TypeScript + Vite
- Mobile-first dark UI
- Deterministic seeded simulation engine
- Local IndexedDB autosave and offline PWA shell
- Five primary areas: Life, People, World, Money, Timeline
- GitHub Actions release gate: production dependency security, strict simulation typecheck, cumulative Vitest suite, production build and temporary Capacitor wrapper generation

### Human simulation
- Multidimensional traits, values, needs, health, habits, goals and memories
- Tier 1 / Tier 2 / Tier 3 NPC simulation
- Autonomous goal-directed NPC decisions
- Directional relationships, person-specific knowledge and canonical secrets

### Lifestyle & everyday life
- Canonical schema-v10 lifestyle state layered around households, finance, health and relationships
- Household comfort, bedrooms/bathrooms, organization, maintenance, furnishing quality, privacy and space pressure
- Persistent home upgrades with real checking-account spending, wear and comfort impact
- Food strategies: budget, standard, healthy, premium and convenience
- Grocery economics respond to household size and food strategy
- Cooking skill and recurring family-meal behavior
- Contextual style identity, grooming and persistent wardrobe categories without daily outfit micromanagement
- Persistent hobbies with skill, enjoyment, social potential and ongoing cost
- Restaurants, entertainment and social outings with real spending and relationship effects
- Pets with household membership, individual attachment, monthly care, health, aging and mortality
- Travel plans with companions, dates, lodging tier, purpose, budget, funding at departure and completion satisfaction
- Household services such as cleaning, childcare and meal services trade money for time
- Phones, computers and other devices have condition/capability and can wear out or be replaced
- Owned vehicles gain mileage, reliability, maintenance intervals, repair risk and service actions
- Calendar commitments can conflict, forcing some plans to be missed
- Lifestyle milestones such as travel, pets, hobbies, home upgrades, style and technology persist in TIMELINE
- Dedicated interactive Everyday Life panel inside LIFE

### Mortality, estates & generations
- Canonical mortality/legal/legacy state
- Hidden age-, health- and circumstance-driven mortality for the controlled character and high-fidelity NPCs
- Persistent death records with cause, date and age at death
- Controlled-character death immediately stops further time advancement until continuation is resolved
- Funeral records, survivor grief and household/employment cleanup
- Wills and deterministic intestacy fallback
- Life-insurance proceeds captured before policy cleanup
- Estate settlement across cash, debts, property, vehicles and business ownership
- Permanent ancestor archive containing identity, life dates, career, location, net worth and descendants
- Existing eligible descendants can become the next controlled character without creating a replacement identity
- Control-transition history is preserved permanently in Timeline
- Generation-aware finance initialization prevents prior-generation bills, budgets and policies from being incorrectly reused

### Crime, law & consequences
- Persistent crime incidents with offense, severity, evidence, victim and discovery state
- Discovery is separate from the underlying incident, allowing delayed investigations
- Investigation, criminal charge, plea, trial, acquittal and conviction state
- Public-defender/private-attorney representation and legal costs
- Fines, legal debt, incarceration and release
- Active criminal records reduce job-application competitiveness
- Incarceration blocks ordinary hiring and ends affected hiring processes
- Employment history does not silently respawn jobs after resignation, conviction or another job-ending event
- Civil claims, negotiation, settlement, trial, judgment and dismissal foundations

### Health & healthcare
- Persistent health profiles around the hidden human-health model
- Hidden preventive, nutrition, sleep, substance, chronic-condition, accident and care-access factors
- Persistent acute, chronic, mental-health and injury conditions
- Separate suspected vs diagnosed state
- Preventive, primary-care, urgent-care, emergency, specialist and therapy encounter model
- Employer health coverage, deductible/coinsurance and medication state
- Medical bills feed into the same finance system
- Player-directed preventive care and treatment choices inside LIFE

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
- Criminal-history hiring friction integrated into application scoring

### Money, housing & wealth
- Canonical checking, savings, brokerage and retirement accounts
- Recurring obligations, childcare, budgets, savings/investment rules and past-due balances
- Credit cards, loans, APR, utilization, delinquency, default and bankruptcy
- Insurance, vehicles, auto financing, mortgages, homeownership and housing-market exposure
- Deterministic investment markets, retirement accounts and net-worth accounting
- Healthcare, legal and lifestyle spending use the same checking account and financial ledger
- Estates and inheritance operate on existing canonical assets and liabilities

### Sports
- Persistent fictional soccer and American-football leagues, teams, rosters and fixtures
- Soccer academy → professional pathway
- American football prep → college → professional pathway
- Athlete and head-coach careers using one deterministic match engine
- Training, fatigue, injuries, contracts, standings and season statistics
- Stored match moments for later 2.5D rendering

### Logistics & warehousing business
- Separate personal and business finances
- Warehouse facilities, employees, customer contracts and operating KPIs
- Productivity, inventory accuracy, service, safety, labor cost, utilization, revenue and profit
- Business reputation, valuation, debt pressure, opportunities and failure risk
- Business ownership can pass through the estate system

### Grounded narration
- Canonical fact / belief / rumor separation
- Speaker knowledge and secret filtering
- Personality-, age- and relationship-aware voice profiles
- Deterministic offline narration with mandatory fallback
- Annual Life Chapters and persistent autobiography
- Vendor-neutral remote-provider boundary and secure same-origin Netlify gateway

### Optional cloud & native packaging
- IndexedDB remains authoritative while offline
- Optional Supabase auth/cloud save transport with deterministic checksums and explicit conflict handling
- Capacitor shares the same web codebase across web/iOS/Android
- CI generates temporary iOS and Android wrappers to verify packaging compatibility

### Save compatibility
- Canonical simulation schema is **v10** in app v0.11 because lifestyle, possessions, travel and daily-life history are persistent gameplay state
- Explicit v1 → v2 → v3 → v4 → v5 → v6 → v7 → v8 → v9 → v10 migration remains supported
- v9 saves gain lifestyle state without deleting relationship, family, finance, sports, business, narration, health, legal or timeline history
- New games are created directly as true v10 worlds

See `docs/CLOUD_NATIVE.md`, `docs/HEALTH_ARCHITECTURE.md`, `docs/LEGACY_LEGAL_ARCHITECTURE.md`, `docs/LIFESTYLE_ARCHITECTURE.md` and the phase acceptance documents for system boundaries.

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

> Simulate deeply. Interact selectively.

> A generation ends. The world does not.

Core simulation remains deterministic and fully playable offline. AI, accounts and cloud services may enrich the experience, but they may not become prerequisites for the life simulation.
