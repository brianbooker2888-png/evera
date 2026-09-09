# EVERA Changelog

## v0.13.0 — Game Modes, Onboarding, Accessibility & Recovery

- Upgraded the canonical simulation world schema to v12.
- Added persistent game configuration covering mode, simulation rules, serious-content preferences, accessibility preferences and onboarding state.
- Added explicit v11 → v12 migration and extended every older supported migration path through the same v12 configuration upgrade.
- Existing saves migrate to standard Life Mode instead of being silently reinterpreted as Hard Life, Sandbox or Legacy.
- Added Life Mode, Hard Life, Sandbox, Legacy and Scenario configurations.
- Hard Life now reduces starting resources and increases world/economic and mortality pressure through actual deterministic simulation rules.
- Sandbox now increases starting resources, softens world shocks and disables configured random premature mortality.
- Legacy adds dynasty-focused rules/goals without replacing the normal simulation.
- Added Scenario foundations for Fresh Start, Career Rebuild and Legacy Seed.
- Locked the selected game mode to the life while allowing comfort/content preferences to change later.
- Rebuilt character creation as a five-step guided setup flow.
- Expanded explicit personality and six-dimension athletic setup while keeping simple defaults available.
- Added configurable two-parent, single-parent, guardian and independent starting-family structures.
- Added configurable siblings and parent closeness.
- Minor starts can now live with their configured starting family; adult starts retain family relationships without forced co-residence.
- Added persistent text-scale, high-contrast, reduced-motion and stronger-focus accessibility preferences.
- Added first-life onboarding explaining time controls, independent world behavior and where persistent preferences live.
- Added persistent serious-content preferences for premature death, pregnancy loss, violent crime, severe illness and future addiction content.
- Added simulation gates for premature death, pregnancy loss, violent-crime generation and severe-illness generation.
- Violent-crime-off blocks player assault actions and removes assault from background crime generation.
- Severe-illness-off blocks chronic severe-illness generation and keeps ordinary acute generated illness below the severe range.
- Added rare deterministic pregnancy-loss events when enabled, with persistent consequences/history.
- Kept the addiction preference honest: it is persisted for future systems, but v0.13.0 does not claim a complete addiction/substance-use disorder generator.
- Added in-save accessibility and serious-content controls in Timeline.
- Added portable JSON save export with schema metadata.
- Added safe portable restore through the normal migration path, including supported older raw saves.
- Restore now validates first and requires explicit replacement confirmation before changing the active life.
- Invalid/unsupported portable files fail safely without replacing the current world.
- Restored accessibility preferences apply immediately.
- Expanded Phase 13 regression coverage for mode rules, starting families, scenarios, configuration migration, content gates, accessibility mutations, portable-save round trips, malformed backups and long-horizon determinism.
- Added `docs/PHASE13_SCOPE.md` and `docs/PHASE13_ACCEPTANCE.md`.
- Bumped the PWA cache to v13 and the app version to v0.13.0.
- Arbitrary Sandbox sliders, mid-life mode switching, a large authored Scenario library, full 3D character creation, localization, formal third-party accessibility certification and a complete addiction system remain explicit future work.

## v0.12.0 — Deeper Living World & Locations

- Upgraded the canonical simulation world schema to v11.
- Added explicit v10 → v11 migration while preserving all prior relationship, family, finance, sports, business, narration, health, legal, lifestyle and timeline state.
- Extended every older migration path through the same v11 living-world upgrade.
- Added persistent country profiles for the United States, Canada, United Kingdom and Mexico with simplified tax, healthcare, education, labor, benefit, retirement, immigration and cost conditions.
- Added persistent city profiles for Phoenix, Seattle, Atlanta, Toronto, Vancouver, London, Manchester, Mexico City and Monterrey.
- Added deterministic custom-city fallback so an unseeded hometown remains distinct instead of being mapped to another city simply because it shares a state/region.
- Added neighborhood profiles with housing, safety, schools, transit, prestige and density tradeoffs.
- Made the living-world layer authoritative for local unemployment, housing, wage and labor-demand mirrors consumed by older systems.
- Added persistent industry demand, wage conditions, growth and automation pressure with deterministic monthly evolution.
- Added persistent employer/company world state with city footprints, company health, growth, headcount and growing/stable/contracting/failed states.
- Added factual company expansion/contraction/failure news and permanent world-history records.
- Made non-remote job availability respect employer city footprints while preserving remote-role portability.
- Made local wage conditions influence new job offers.
- Added simplified country-aware payroll withholding.
- Corrected payroll accounting so the ledger records gross Income and separate Tax outflow while controlled cash receives net pay.
- Added persistent policy snapshots for country tax, healthcare, education, labor, immigration and retirement conditions.
- Added location-aware healthcare access using city healthcare access, country healthcare model, socioeconomic circumstances and insurance.
- Added persistent city hospitals, universities, transit authorities and community networks with quality, capacity, reputation and operating status.
- Added infrastructure-driven institution strain and local news.
- Added deterministic recessions, housing booms/corrections, disasters, supply disruptions, labor shortages, technology shifts and strikes.
- Added active → recovering → resolved regional-shock lifecycle rather than one-day random events.
- Added canonical local/global/business world news generated from stored source entities and events.
- Added permanent world-history records for major shocks, company changes and migrations.
- Added player-directed domestic and international relocation with canonical moving cost, neighborhood housing cost, local labor/economic changes and residency updates.
- Added onsite-job loss when a move takes the player outside the employer's city footprint.
- Added persistent migration records, major move memories, world-history records and life events.
- Added an interactive WORLD interface for city/country/neighborhood context, industries, institutions, shocks, causal news and relocation.
- Added responsive Phase 12 styling.
- Added dedicated Phase 12 regression coverage for v11 creation, custom hometowns, deterministic long-horizon world evolution, domestic relocation, international residency, tax differences, healthcare-access differences and v10 → v11 migration.
- Added `docs/LIVING_WORLD_ARCHITECTURE.md` and `docs/PHASE12_ACCEPTANCE.md`.
- Bumped the PWA cache to v12 and the app version to v0.12.0.
- Currency conversion, detailed international tax/visa law, dynamic elections/legislation, climate simulation, pandemic generation, mergers/acquisitions, exhaustive geography and full distant-region fidelity tiers remain later depth rather than being claimed as complete.

## v0.11.0 — Lifestyle, Daily Life & Travel

- Upgraded the canonical simulation world schema to v10.
- Added an explicit v9 → v10 migration while preserving all prior mortality, legal, health, finance, family, career, sports, business, narration and timeline state.
- Added persistent lifestyle profiles for food strategy, cooking, family meals, style, grooming, social spending, convenience, travel interest, home pride and time pressure.
- Added household lifestyle state for bedrooms/bathrooms, comfort, organization, furnishing quality, maintenance, privacy and space pressure.
- Added persistent home upgrades with real checking-account spending, condition and comfort impact.
- Added food strategies that alter recurring grocery economics and create health/time tradeoffs.
- Added family-meal behavior and relationship effects without requiring meal-by-meal micromanagement.
- Added contextual style identity, grooming and persistent wardrobe-category state.
- Added persistent hobbies with skill, enjoyment, social potential and recurring cost.
- Added restaurants, entertainment and social outings with canonical spending and relationship effects.
- Added household pets with adoption cost, monthly care, individual attachment, aging, health and mortality.
- Added persistent travel plans with companions, origin/destination, dates, lodging tier, purpose, budget, departure funding, completion satisfaction and relationship effects.
- Added household services such as cleaning, childcare, meal service, landscaping, assistant and pet care as money-for-time tradeoffs.
- Added persistent device assets with condition/capability, wear, breakage and replacement.
- Added daily vehicle mileage/reliability/service state, service intervals, deterministic breakdown risk and repair costs on top of canonical vehicle assets.
- Added calendar commitments and deterministic time-conflict handling.
- Added lifestyle milestones for home, travel, pets, hobbies, style and technology and surfaced them in TIMELINE.
- Added an interactive Everyday Life panel inside LIFE for food, home, hobbies, pets, travel, services, technology, style and vehicle maintenance.
- Added responsive Phase 11 styling.
- Added dedicated deterministic regression tests including a 365-day lifestyle simulation.
- Added `docs/LIFESTYLE_ARCHITECTURE.md`, `docs/PHASE11_SCOPE.md` and `docs/PHASE11_ACCEPTANCE.md`.
- Bumped the PWA cache to v11 and app version to v0.11.0.
- Detailed room placement, rich destination databases, visas and fully visual wardrobe/travel presentation remain later world/visual-layer work rather than being claimed as complete.

## v0.10.0 — Mortality, Law & Legacy

- Upgraded the canonical simulation world schema to v9.
- Added explicit v8 → v9 migration while preserving all prior relationship, family, education, career, finance, sports, business, narration, cloud and health state.
- Changed new-world creation so fresh games are born as true v9 worlds rather than being silently upgraded after initialization.
- Added persistent death records, funeral records, estate plans, estate cases, ancestor archives and controlled-generation transition history.
- Added deterministic age/health/circumstance-driven mortality for the controlled character and high-fidelity NPCs.
- Controlled-character death now hard-stops further requested time advancement until continuation is resolved.
- Added funeral/grief consequences that affect surviving connected people and active household/life systems.
- Added player wills and deterministic intestacy fallback.
- Added life-insurance settlement with ordering that captures proceeds before policy cleanup.
- Added estate settlement across cash, debts, funeral cost, property, vehicles and business ownership.
- Cleared deceased investment positions during estate settlement so market ticks cannot recreate a dead person's portfolio.
- Added permanent ancestor archives and Timeline dynasty/control-transition history.
- Added continuation as an eligible existing descendant without generating a replacement identity.
- Preserved the descendant's existing person ID, traits, health, memories, relationships and recorded history during control transfer.
- Added generation-aware finance initialization so a new controlled generation receives appropriate accounts/obligations without reviving the prior generation's bills or policies.
- Added crime incidents with separate incident and discovery dates, evidence strength, victims and delayed investigation.
- Added criminal charges, legal representation, pleas, trials, convictions, acquittals, fines, incarceration and release.
- Added persistent criminal records and integrated them into job-application competitiveness.
- Blocked ordinary hiring during incarceration and ended incompatible in-progress hiring processes.
- Fixed progression initialization so ending a job no longer silently recreates employment after resignation, conviction or future job-ending events.
- Added civil filing, negotiation, deterministic settlement, trial, judgment and dismissal foundations using canonical finance and ledger state.
- Added LIFE legal/estate controls while alive and a dedicated generational continuation surface after death.
- Added permanent ancestor/control-transition presentation to TIMELINE.
- Added responsive Phase 10 styling for legal and continuation interfaces.
- Expanded cumulative regression coverage with v8→v9 migration, estate ordering, life insurance, death freeze, exact descendant inheritance, crime discovery, conviction/incarceration, hiring penalties, civil settlement and persistent-unemployment tests.
- Added `docs/LEGACY_LEGAL_ARCHITECTURE.md` and `docs/PHASE10_ACCEPTANCE.md`.
- Bumped the PWA cache to v10 and the app version to v0.10.0.
- Deeper jurisdiction-specific probate, trusts/contested estates, full family-court case simulation and criminal-record effects across every housing/lending/immigration pathway remain explicit future depth rather than being claimed as complete.

## v0.9.0 — Health & Healthcare

- Upgraded the canonical simulation world schema to v8.
- Added persistent health profiles around the existing hidden human-health state.
- Added hidden preventive-adherence, nutrition, sleep, substance-risk, chronic-risk, accident-risk and care-access factors.
- Added persistent acute, chronic, mental-health and injury conditions.
- Added suspected vs diagnosed condition state so medical facts are not revealed before the world records a diagnosis.
- Added condition recovery, managed long-term conditions and treatment summaries.
- Added preventive, primary-care, urgent-care, emergency, specialist and therapy encounter records.
- Connected employer health benefits to a canonical active health-insurance policy.
- Added deductible-year tracking and simplified deductible/coinsurance patient responsibility.
- Routed healthcare costs through the same canonical checking account and ledger used by the rest of the finance simulation.
- Added persistent medical bills when available cash cannot cover patient responsibility.
- Added medical-bill payment attempts, past-due state and financial-security / mental-load consequences.
- Added persistent medications with monthly cost, effectiveness and adherence.
- Added deterministic daily illness/injury/long-term-condition simulation for the player and high-fidelity NPCs.
- Added preventive-care reminders and player-directed care actions.
- Added a dedicated Health & Healthcare interface inside LIFE with coverage, deductible usage, known conditions, care choices, medications, bills and recent encounters.
- Kept hidden health-risk percentages out of the player interface.
- Added health as a canonical life-event category.
- Added diagnosed health facts and recorded healthcare activity to the grounded narration context and Annual Life Chapters.
- Added effective-date handling so next-day encounters and January deductible resets remain chronologically correct.
- Added v7 → v8 migration while preserving prior relationship, family, education, career, finance, sports, business, narration and timeline history.
- Expanded the cumulative test suite with health initialization, preventive care, diagnosis/cost, deterministic 365-day health simulation, health narration and v7→v8 migration coverage.
- Added `docs/HEALTH_ARCHITECTURE.md` describing the hidden-risk / known-medical-history boundary.
- Bumped the PWA cache to v9 and the app version to v0.9.0.
- Mortality remains intentionally disabled until Phase 10 can ship death together with grief, estates, inheritance and descendant continuation.

## v0.8.0 — Optional Cloud Sync & Native Packaging

- Kept the canonical simulation world schema at v7 because cloud/device metadata is infrastructure rather than gameplay state.
- Upgraded local IndexedDB storage to keep sync/device metadata separately from the world save.
- Added persistent device IDs, local revisions, last-synced revisions/checksums and sync status.
- Added deterministic stable-JSON checksums for world payload comparison.
- Added an optional cloud-save provider contract.
- Added an optional Supabase provider with persisted sessions, email-link authentication and per-user save transport.
- Added a Supabase `evera_saves` SQL schema with row-level-security policies.
- Added optimistic revision checking so stale devices cannot blindly overwrite newer cloud saves.
- Added conservative sync classification: same, upload, download or conflict.
- Added explicit divergent-history conflict handling instead of attempting unsafe field-level merging of two simulation timelines.
- Added Cloud & Device UI with sign-in, manual sync, sign-out and conflict-resolution actions.
- Kept local saving fully functional when cloud configuration, authentication or connectivity is absent.
- Added a same-origin Netlify narration gateway so optional provider credentials stay server-side.
- Added a Netlify remote narration provider client with the existing deterministic offline fallback.
- Added environment templates for optional Supabase and remote narration configuration.
- Added Capacitor core, iOS and Android packaging dependencies and configuration.
- Added scripts for generating, syncing and opening native projects.
- Added CI gates for production dependency security, native config typechecking and temporary iOS/Android wrapper generation.
- Added Phase 8 cloud synchronization tests covering stable checksums and divergent-history decisions.
- Added `docs/CLOUD_NATIVE.md` covering cloud setup, sync semantics, security boundaries and native packaging.
- Bumped the PWA cache to v8.
- External Supabase credentials, production narration-provider credentials and app-store signing remain deployment tasks rather than hard-coded repository state.

## v0.7.0 — Grounded Narration & Life Chapters

- Upgraded the world save schema to v7.
- Added narration settings and persistent annual Life Chapters to save state.
- Added a canonical scene-context compiler for dialogue and narrative generation.
- Separated canonical facts, remembered/believed information and rumors inside narration context.
- Added speaker-specific knowledge filtering so narration cannot reveal a secret the speaker does not know.
- Added personality-, age- and relationship-aware voice profiles.
- Added a deterministic offline narration provider that requires no network connection.
- Added a narration provider registry with mandatory offline fallback.
- Added a vendor-neutral remote-provider adapter that receives only sanitized scene context instead of the full save.
- Added grounding validation so provider responses may only cite fact IDs supplied in the approved context packet.
- Added a narration-safe conversation facade: deterministic relationship intent/tone and consequences are applied first, and only the stored reply text is narrated afterward.
- Routed the People conversation UI through grounded narration.
- Added Annual Life Chapters generated from recorded events, memories, careers, sports seasons and logistics-business history.
- Added automatic prior-year chapter creation at the January 1 simulation boundary.
- Added a Timeline autobiography UI with narration mode controls and archived chapters.
- Added Phase 7 responsive styling and bumped the PWA cache to v7.
- Added v6 → v7 migration while preserving all earlier migration paths.
- Added dedicated grounding regression tests for secret leakage, rumor certainty, narration immutability, deterministic output, annual chapter generation and v6 migration.
- Kept production online-model integration optional and deferred; v0.7 remains fully functional offline.

## v0.6.0 — Sports & Logistics Business

- Upgraded the world save schema to v6.
- Added persistent fictional soccer and American-football leagues, teams, rosters and season fixtures.
- Added age-aware soccer academy → professional and American-football prep → college → professional pathways.
- Added athlete profiles with position, rating, potential, fitness, fatigue, morale, injury state and career status.
- Added head-coach profiles with tactical, development, leadership, reputation and style state.
- Added one deterministic match engine shared by athlete and coach careers.
- Added soccer chances/goals and American-football drives, touchdowns, field goals, turnovers and big plays.
- Added stored match moments for future stylized visual playback.
- Added persistent team standings and player/coach season statistics.
- Added training, recovery, fatigue accumulation, injury risk and injury recovery.
- Added professional sports contracts and payroll integrated with the canonical checking account.
- Added an interactive sports career UI with athlete/coach entry, training/tactics, fixtures, key moments, season stats and league standings inside WORLD.
- Added the deep logistics/warehousing business module.
- Added business ownership with separate business cash, debt, reputation and valuation.
- Added warehouse facilities with square footage, pallet capacity, rent, condition, automation and utilization.
- Added persistent business employees with roles, compensation, productivity, reliability, morale and safety.
- Added logistics customer contracts with unit demand, price, service targets, complexity and duration.
- Added monthly productivity, inventory accuracy, service level, safety, labor cost, facility utilization, revenue and operating-profit KPIs.
- Added staffing, hiring, pricing, facility expansion and customer-contract opportunities.
- Added business borrowing pressure and business-failure state when losses/debt become unsustainable.
- Added v5 → v6 migration that preserves prior-system history and deterministically seeds Phase 6 world state.
- Expanded deterministic regression coverage through sports, business and v6 migration.
- Kept the stylized 2.5D sports renderer out of the v0.6 claim; it remains a presentation layer to be built on top of stored match moments.

## v0.5.0 — Money, Housing & Wealth

- Upgraded the world save schema to v5.
- Added canonical checking, savings, brokerage and retirement accounts.
- Kept `character.cash` as a compatibility mirror while checking became the liquid-money source of truth.
- Added recurring household obligations with due dates, autopay, past-due balances and missed-payment history.
- Removed the legacy standalone monthly rent charge so housing bills have one authoritative owner.
- Added household-size grocery/utilities costs and childcare obligations for young children.
- Added household budget rules, emergency-fund targets and automatic savings/investment rates.
- Added credit profiles with score, utilization, payment history, account age, inquiries and derogatory marks.
- Added credit-card, student, auto, mortgage and personal liabilities.
- Added monthly interest, minimum payments, delinquency, default and secured-asset consequences.
- Added starter credit-card opening, purchases and extra principal paydown.
- Added insurance policies with monthly premiums and lapse behavior.
- Added vehicle assets, financing, insurance, mileage, condition, depreciation and repossession foundation.
- Added primary-home purchases, mortgages, homeowners insurance, property values and housing-market exposure.
- Added deterministic investment market state, brokerage positions, automated investing and net-worth accounting.
- Added bankruptcy records with unsecured-debt discharge and long-lived credit penalties.
- Added a dedicated interactive Money dashboard covering accounts, bills, debt, credit, investments, insurance, vehicles, property and financial history.
- Added v4 → v5 migration while preserving older v1/v2/v3 migration paths.
- Expanded deterministic regression coverage for finance, housing, investing, debt, bankruptcy and migration.

## v0.4.0 — Education, Careers & Labor Market

- Upgraded the world save schema to v4.
- Added persistent public/charter school, university and trade-school institutions.
- Added age-appropriate automatic school enrollment for minors.
- Added postsecondary enrollment with admission logic, tuition, scholarships, GPA, attendance, credits and student debt.
- Added persistent credentials earned through completed education programs.
- Added transferable skill records for Communication, Analysis, Operations, Leadership and Technology.
- Added persistent employers and job openings with compensation, schedule, work mode and qualification requirements.
- Added deterministic job applications that can progress through submitted, interview, offer and rejection states.
- Added explicit player acceptance of job offers.
- Added canonical employment history with salary, pay frequency, benefits, workload, schedule, performance and satisfaction.
- Replaced the Phase 1 fixed Friday paycheck with payroll generated from the active employment contract.
- Added skill development from work experience and workload effects on stress/energy.
- Added a labor-market model for demand, wage conditions and remote-work share.
- Integrated work and education schedules with household schedules.
- Added Career and Education player interfaces within LIFE and institution visibility within WORLD.
- Added v1/v2/v3 → v4 save migration and v4 normalization.

## v0.3.0 — Relationships & Households

- Added canonical partnership state separate from directional relationship feelings.
- Added attraction eligibility, compatibility and deterministic chemistry foundations.
- Added dating, exclusivity, cohabitation, engagement, marriage, breakup and divorce actions.
- Added autonomous NPC-to-NPC romance opportunities.
- Added household objects with housing cost, members, schedules, labor assignments and finance styles.
- Added household labor imbalance consequences.
- Added offline free-text conversation intent/tone parsing and procedural replies.
- Added romantic orientation to character creation and migrated NPC romantic profiles.
- Added negotiated family planning, pregnancy, children, parenting, blended-family and custody foundations.
- Added v1/v2 → v3 save migrations and GitHub Actions CI.

## v0.2.0 — Human Simulation Core

- Added multidimensional human values, needs, health state and mood.
- Added habits, competing goals, Tier 1/2/3 NPC simulation, autonomous NPC decisions, directional relationships, memories, secrets and person-specific knowledge.
- Added v1 → v2 save migration.
