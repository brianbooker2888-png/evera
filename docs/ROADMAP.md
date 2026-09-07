# EVERA Roadmap

## Phase 1 — Foundation / vertical slice
- [x] App shell, character creation, seeded deterministic engine
- [x] Local autosave, time controls, events, memories and ledger
- [x] Economy baseline, PWA shell, determinism tests

## Phase 2 — Human simulation core
- [x] Deep trait / value / need model
- [x] Goal planner, habits, health/mental-load and memory
- [x] Tier 1/2/3 NPC simulation and promotion/demotion
- [x] Directional relationships, social knowledge and secrets
- [x] v1 → v2 migration and player-facing human signals

## Phase 3 — Relationships / households
- [x] Attraction and compatibility foundation
- [x] Dating, exclusivity, cohabitation, marriage and breakups
- [x] Offline free-text conversations with deterministic intent handling
- [x] Household schedules, labor and finance agreements
- [x] Pregnancy, parenting and child development foundation
- [x] Blended families, custody and co-parenting foundation
- [x] Family-network persistence
- [x] v2 → v3 migration

## Phase 4 — Education / careers / labor market
- [x] Persistent schools, universities, trade schools and employers
- [x] Qualifications, skills, applications, interviews, offers and employment history
- [x] Employment contracts, payroll, schedules, benefits, performance and satisfaction
- [x] Education enrollment, tuition, scholarships, GPA, credits, debt and credentials
- [x] Labor-demand, wage and remote-work market foundations
- [x] Work / school schedule integration with households
- [x] v3 → v4 migration

## Phase 5 — Money / housing / wealth
- [x] Bank accounts, recurring bills, budgets and household money rules
- [x] Credit reports, credit cards, loans, delinquency and bankruptcy
- [x] Insurance and emergency-fund mechanics
- [x] Rent obligations, homeownership, mortgages and housing-market exposure
- [x] Vehicles, financing, depreciation, insurance and repossession foundations
- [x] Investments, retirement accounts, deterministic markets and wealth compounding
- [x] Family-size household expenses and childcare costs
- [x] v4 → v5 migration and finance regression suite

## Phase 6 — Deep modules
- [x] Soccer athlete / coach simulation module
- [x] American football athlete / coach simulation module
- [x] Shared deterministic match engine, season stats, injuries and stored match moments
- [x] Logistics / warehousing business simulation module
- [x] Separate business finance, facilities, employees, contracts and operating KPIs
- [x] v5 → v6 migration and Phase 6 regression coverage
- [ ] Stylized 2.5D match-moment renderer (presentation layer; scheduled for Phase 14)

## Phase 7 — Grounded narration
- [x] Narration provider abstraction and registry
- [x] Canonical scene-context compiler
- [x] Canonical fact / belief / rumor separation
- [x] Speaker knowledge and secret-access filtering
- [x] Offline free-text intent parser foundation
- [x] Personality-, age- and relationship-aware voice profiles
- [x] Deterministic offline narration with mandatory fallback
- [x] Narration-safe conversation wrapper: simulate first, narrate second
- [x] Vendor-neutral remote-provider adapter
- [x] Annual Life Chapters and autobiography UI
- [x] v6 → v7 migration and narration regression coverage

## Phase 8 — Optional cloud and native distribution
- [x] Local sync metadata separated from canonical world state
- [x] Deterministic save checksum and revision model
- [x] Optional Supabase email-link authentication / cloud save provider
- [x] Supabase row-level-security schema
- [x] Cross-device upload/download sync
- [x] Explicit divergent-history conflict detection and resolution
- [x] Cloud & Device UI inside Timeline
- [x] Capacitor iOS / Android configuration and scripts
- [x] CI native-wrapper generation gate
- [x] Server-side Netlify narration gateway and same-origin remote adapter
- [ ] Provision production Supabase project/environment values
- [ ] Provision a production enhanced-narration provider endpoint/secret
- [ ] App-store signing, bundle-ID finalization and store submission assets

## Phase 9 — Health & healthcare
- [x] Canonical health-profile and medical-history schema
- [x] Hidden health-risk model layered around existing human-health state
- [x] Acute illness, chronic condition, mental-health and injury foundations
- [x] Suspected vs diagnosed conditions
- [x] Preventive, primary, urgent, emergency, specialist and therapy encounter model
- [x] Employer health coverage, deductible and coinsurance integration
- [x] Medication cost/effectiveness/adherence state
- [x] Medical bills and financial-stress consequences
- [x] Player-directed care interface inside LIFE
- [x] Health-aware grounded narration and Life Chapters
- [x] v7 → v8 migration and deterministic health regression coverage
- [x] Mortality integration delivered in Phase 10

## Phase 10 — Mortality, crime, law, estates & generational continuation
- [x] Age/health/circumstance-driven mortality model with hidden lifespan
- [x] Sudden and illness-related death foundations
- [ ] Expanded terminal-decline and end-of-life care interaction flows
- [x] High-fidelity NPC mortality with world continuation while offscreen
- [x] Funeral, grief, survivor and household consequences
- [x] Wills, intestacy, life insurance, estates and inheritance
- [ ] Trusts, jurisdiction-specific probate/tax and contested-estate litigation
- [ ] Expanded narrative death life review beyond the permanent ancestor archive
- [x] Continue as an eligible existing descendant or start a new world
- [x] Permanent ancestor archive and dynasty/control-transition continuity
- [x] Crime choices, victimization, delayed discovery, investigation and evidence foundations
- [x] Legal representation, plea/trial and conviction/acquittal state
- [ ] Detailed arrest, jail, bail and pretrial procedure simulation
- [x] Persistent criminal-record effects on job applications and hiring
- [ ] Criminal-record integration across every housing, lending, immigration and relationship pathway
- [x] Civil lawsuits and settlement/trial/judgment foundations
- [ ] Full family-court case simulation and estate disputes beyond existing divorce/custody foundations
- [x] Generation-aware finance and inheritance integration
- [x] Employment-history invariant preventing silent job recreation after resignation/conviction
- [x] LIFE death/estate/legal interface and TIMELINE dynasty history
- [x] v8 → v9 migration and mortality/legal regression suite
- [x] Phase 10 architecture and acceptance documentation

## Phase 11 — Lifestyle, daily life, possessions & travel
- [ ] Broader home types, space pressure and household-quality effects
- [ ] Furnishing/upgrades/home maintenance without mandatory micromanagement
- [ ] Vehicle practicality, maintenance, breakdowns and customization
- [ ] Contextual automatic wardrobe/outfit system and grooming/style identity
- [ ] Household food strategy, cooking and family meals
- [ ] Restaurants, outings, hosting and social spending
- [ ] Travel planning, destinations, hotels, activities and companion dynamics
- [ ] Hobbies with skill/social/career crossover
- [ ] Pets, care, attachment and pet aging/death
- [ ] Household calendar conflicts across work/school/daycare/sports/appointments
- [ ] Buy-back-time services such as childcare, cleaning and household help
- [ ] Phones/computers/technology ownership and replacement
- [ ] Lifestyle milestones in Timeline

## Phase 12 — Deeper living world, locations & institutions
- [ ] Country-level tax, healthcare, education, labor, benefit and retirement profiles
- [ ] City-level wages, housing, industries, schools, transit, crime and culture
- [ ] Neighborhood-level housing/safety/schools/commute/social context
- [ ] Moving between cities/countries and immigration/residency foundations
- [ ] Persistent company growth, contraction, relocation, failure, merger and acquisition
- [ ] Industry rise/fall and technology disruption
- [ ] Richer local/world news generated from actual simulation state
- [ ] Politics/policy changes as world inputs without making politics the core game
- [ ] Geographic disasters, infrastructure disruption and long-tail recovery
- [ ] Schools, universities, hospitals and community institutions that evolve over time
- [ ] Entertainment, celebrity, media and social-trend ecosystem
- [ ] Labor shortages, strikes/unionization and supply-chain disruption
- [ ] World-history archive and starting-year conditions
- [ ] Relevant-region deep simulation with distant statistical approximation

## Phase 13 — Game modes, onboarding, controls & accessibility
- [ ] Life Mode
- [ ] Hard Life
- [ ] Sandbox
- [ ] Legacy Mode
- [ ] Scenario framework
- [ ] Character-creation expansion for full starting-family/background control
- [ ] New-player onboarding without exposing optimal choices
- [ ] Serious-content settings and optional premature-death controls
- [ ] Scalable type, high contrast, reduced motion and color-safe information design
- [ ] Screen-reader landmarks, labels and keyboard navigation
- [ ] Large-touch-target and mobile usability audit
- [ ] Save/export/import/recovery UX

## Phase 14 — Visual experiences, sports presentation & memory cards
- [ ] Stylized-realism visual system for important life scenes
- [ ] 2.5D soccer match-moment renderer using stored deterministic match events
- [ ] 2.5D American-football match-moment renderer using the same shared match state
- [ ] Full / extended / key-moments / result sports viewing modes
- [ ] Contextual athlete/coach match decisions in presentation layer
- [ ] Visual aging and family resemblance presentation foundation
- [ ] Automatic contextual outfit presentation
- [ ] Visual Memory Cards for major milestones
- [ ] Family albums and generational visual history
- [ ] Major-scene presentation for birth, graduation, proposal, wedding, home, promotion, hospital, divorce, funeral and retirement

## Phase 15 — Full integration, performance, deployment & release hardening
- [ ] Full v1→current save-migration matrix fixtures
- [ ] Multi-year / multi-decade long-horizon simulation performance tests
- [ ] Memory/storage-growth and IndexedDB durability tests
- [ ] Async enhanced-narration UI handoff and failure-state audit
- [ ] Responsive-device and accessibility release audit
- [ ] Content/serious-topic review
- [ ] Supabase staging and sync-conflict staging validation
- [ ] Production narration-provider staging validation
- [ ] Netlify production deployment and installable PWA verification
- [ ] Native signing, store assets and iOS/Android release builds
- [ ] Crash/error reporting and recovery strategy
- [ ] Release-candidate checklist and launch gate

The roadmap remains modular by design. Each phase must keep offline deterministic play intact, preserve older saves through explicit migration, and pass the cumulative release gate before merge.
