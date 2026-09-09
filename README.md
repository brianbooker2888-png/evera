# EVERA

**Working title:** EVERA  
**Brand line:** Live one life. Shape generations.

EVERA is a local-first persistent life and world simulation. The player is one person inside a world that continues independently.

## Current build — v0.13.0 Game Modes, Onboarding, Accessibility & Recovery

### Foundation
- React + TypeScript + Vite
- Mobile-first dark UI
- Deterministic seeded simulation engine
- Local IndexedDB autosave and offline PWA shell
- Five primary areas: Life, People, World, Money, Timeline
- GitHub Actions release gate: production dependency security, strict simulation typecheck, cumulative Vitest suite, production build and temporary Capacitor wrapper generation
- Capacitor-compatible iOS and Android packaging from the same web codebase

### Phase 13: game configuration
- Canonical simulation schema is **v12**
- Persistent `gameConfiguration` stores mode, rules, serious-content preferences, accessibility preferences and onboarding state
- Explicit v11 → v12 migration
- All older supported saves continue through the cumulative migration ladder to v12
- Existing worlds migrate to standard Life Mode rather than being reinterpreted as a harder/easier mode

### Game modes
- **Life Mode** — standard persistent-life rules
- **Hard Life** — lower starting resources with stronger world/economic and mortality pressure
- **Sandbox** — increased starting resources, softer world shocks and no configured random premature mortality
- **Legacy** — standard life simulation with stronger dynasty/continuity focus
- **Scenario** — deterministic preset starting conditions
- Scenario foundations currently include Fresh Start, Career Rebuild and Legacy Seed
- The selected mode is part of the life and cannot be switched mid-save
- Modes modify simulation rules; they do not script hidden outcomes

### Guided character creation
- Five-step creator instead of one large form
- Identity, age, sex, orientation, hometown and socioeconomic background
- Major personality dimensions including ambition, discipline, empathy, analytical ability, emotional ability, creativity, confidence, patience, loyalty, impulsivity, risk tolerance and family orientation
- Six athletic dimensions: speed, strength, endurance, agility, coordination and reaction
- Simple defaults remain available so deep setup is optional
- Starting family configuration supports two-parent, single-parent, guardian and independent starts
- Configurable siblings and parent closeness
- Minor characters can begin inside the configured family household
- Adult characters retain family relationships without being forced to co-reside

### Serious-content preferences
Preferences are persisted per save and affect **future generated events** without rewriting history.

- Premature death can be disabled
- Pregnancy-loss generation can be disabled
- Violent crime can be disabled; assault is removed from player/background crime generation when off
- Severe-illness generation can be disabled; chronic severe-illness generation is blocked and ordinary acute generation is kept below the severe range
- Addiction-content preference is persisted for future addiction systems

**Important boundary:** v0.13.0 does not yet contain a full addiction/substance-use disorder generator. The preference is stored so future systems can honor it without another save-schema redesign.

### Accessibility
- Standard, large and extra-large text scaling
- High-contrast mode
- Reduced-motion mode
- Stronger keyboard focus outlines
- Preferences persist with the save and can change after world creation
- Accessibility settings do not change simulation outcomes
- First-life onboarding uses dialog semantics and a keyboard-focused primary action
- Restore feedback uses an announced status region
- Phase 13 setup/settings/recovery surfaces include responsive mobile layouts

### Onboarding and save recovery
- Concise first-life introduction before time begins
- Explains time controls, independent-world behavior and save-level preferences
- Timeline exposes in-save accessibility and serious-content settings
- Portable JSON backup contains canonical world state and schema metadata
- Portable restore accepts current v12 saves
- Supported older raw saves restore through the normal migration path
- Invalid/unsupported files fail safely
- Selecting a restore file does not overwrite the active life until explicit confirmation
- Restored accessibility preferences are applied immediately

### Deeper living world
- Country/city/neighborhood state with simplified tax, healthcare, education, labor, benefit, retirement, immigration and cost conditions
- Seeded launch geography across the United States, Canada, United Kingdom and Mexico plus deterministic custom-city fallback
- Location-aware wages, housing, unemployment, labor demand and healthcare access
- Persistent industries, companies, institutions, policies, residency, shocks, news and world history
- Deterministic recessions, housing changes, disasters, supply disruptions, labor shortages, technology shifts and strikes
- Domestic/international relocation with moving cost, housing/labor changes, residency consequences and possible onsite-job loss
- Geography is causal simulation state, not decoration

### Human simulation
- Multidimensional traits, needs, health, habits, goals and memories
- Tier 1 / Tier 2 / Tier 3 NPC fidelity
- Autonomous goal-directed NPC decisions
- Directional relationships
- Person-specific knowledge, beliefs and canonical secrets
- The world continues independently of the controlled character

### Relationships, family & households
- Dating → exclusivity → cohabitation → engagement → marriage → breakup/divorce
- Autonomous NPC-to-NPC romance
- Household schedules, labor and finance styles
- Offline free-text conversation intent/tone handling
- Pregnancy, children, parenting, step-family links, custody and co-parenting foundations
- Persistent starting-family relationships introduced in v0.13.0

### Education & careers
- Persistent schools, universities, trade schools, employers and job openings
- Tuition, scholarships, GPA, credits, student debt and credentials
- Skills, applications, interviews, offers and employment history
- Employment contracts with salary, schedules, benefits, performance and satisfaction
- Contract-driven payroll
- Location-aware job availability and wage conditions
- Criminal-history hiring friction

### Money, housing & wealth
- Canonical checking, savings, brokerage and retirement accounts
- Recurring obligations, childcare, budgets, savings/investment rules and past-due balances
- Credit cards, loans, APR, utilization, delinquency, default and bankruptcy
- Insurance, vehicles, auto financing, mortgages, homeownership and housing-market exposure
- Deterministic investment markets and net-worth accounting
- Healthcare, legal, lifestyle and moving costs use the same canonical ledger
- Estates and inheritance operate on existing assets/liabilities

### Lifestyle & everyday life
- Household comfort, maintenance, furnishing quality, privacy and space pressure
- Home upgrades with canonical spending
- Food strategies and grocery economics
- Cooking and recurring family-meal behavior
- Contextual style/grooming and wardrobe-category state
- Hobbies, restaurants, entertainment and social outings
- Pets with care, attachment, aging and mortality
- Travel plans with companions, dates, lodging, budget and completion state
- Household services that trade money for time
- Devices with condition/capability
- Vehicle mileage, reliability, maintenance and repair risk
- Calendar conflicts and persistent lifestyle milestones

### Health & healthcare
- Persistent health profiles around hidden human-health state
- Preventive, nutrition, sleep, chronic, accident and care-access factors
- Acute, chronic, mental-health and injury conditions
- Suspected vs diagnosed state
- Preventive, primary, urgent, emergency, specialist and therapy encounters
- Employer health coverage, deductible/coinsurance, medications and medical bills
- Location/country healthcare context
- Phase 13 severe-illness generation preference applies at the simulation boundary

### Mortality, estates & generations
- Hidden age-, health- and circumstance-driven mortality for controlled/high-fidelity people
- Persistent death/funeral records and survivor consequences
- Controlled-character death freezes time until continuation is resolved
- Wills, intestacy fallback and life-insurance settlement
- Estate settlement across cash, debts, property, vehicles and business ownership
- Permanent ancestor archive
- Continue as an eligible existing descendant without creating a replacement identity
- Generation-aware finance initialization
- Phase 13 mode/content rules can alter random mortality availability/pressure without replacing the estate system

### Crime & law
- Persistent crime incidents with separate discovery/evidence state
- Investigation, charges, plea, trial, acquittal and conviction
- Legal representation/costs, fines, legal debt, incarceration and release
- Criminal-record employment consequences
- Civil filing, negotiation, settlement, trial, judgment and dismissal foundations
- Phase 13 violent-crime preference removes assault from future player/background generation when disabled

### Sports
- Persistent fictional soccer and American-football leagues, teams, rosters and fixtures
- Soccer academy → professional pathway
- American football prep → college → professional pathway
- Athlete and head-coach careers using one deterministic match engine
- Training, fatigue, injuries, contracts, standings and season statistics
- Stored match moments for later richer visual rendering

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
- Simulation owns facts/outcomes; narration cannot invent authoritative state

### Optional cloud & native packaging
- IndexedDB remains authoritative while offline
- Optional Supabase auth/cloud-save transport with deterministic checksums and explicit conflict handling
- Cloud and AI remain enhancements, not prerequisites
- CI verifies temporary iOS and Android Capacitor wrapper generation

## Save compatibility

- Current canonical schema: **v12**
- Explicit cumulative migration remains supported from v1 through v12
- v11 saves gain standard Life Mode configuration, accessibility/content defaults and onboarding state without deleting prior world history
- New games are created directly as v12 worlds
- Portable restore uses the same migration function as ordinary local-load compatibility

## Explicit Phase 13 boundaries

v0.13.0 does **not** claim:
- complete addiction/substance-use disorder simulation
- arbitrary Sandbox rule sliders
- mid-life game-mode switching
- a large authored Scenario campaign library
- full 3D/visual character creation
- localization
- formal third-party accessibility certification
- automatic cross-device portable-file transfer

See `docs/PHASE13_SCOPE.md`, `docs/PHASE13_ACCEPTANCE.md`, `docs/LIVING_WORLD_ARCHITECTURE.md`, `docs/CLOUD_NATIVE.md`, `docs/HEALTH_ARCHITECTURE.md`, `docs/LEGACY_LEGAL_ARCHITECTURE.md` and `docs/LIFESTYLE_ARCHITECTURE.md` for boundaries and prior-system architecture.

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

> Geography is a cause, not decoration.

> A generation ends. The world does not.

> The world does not exist for the player. The player exists inside the world.

Core simulation remains deterministic and fully playable offline. AI, accounts and cloud services may enrich the experience, but they may not become prerequisites for the life simulation.
