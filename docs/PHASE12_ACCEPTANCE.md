# Phase 12 Acceptance — Deeper Living World, Locations & Institutions

Phase 12 may be released only if all requirements in this document are true on the exact PR head merged to `main`.

## Canonical state

- [x] Fresh worlds are schema v11.
- [x] Living-world geography is persisted in the canonical save.
- [x] v10 saves migrate explicitly to v11.
- [x] Earlier saves still migrate through the cumulative ladder before v11.
- [x] Existing Phase 11 lifestyle state survives the v10 → v11 upgrade.
- [x] Unknown hometowns are preserved through deterministic custom-city fallback.

## Geography

- [x] Country profiles store simplified tax, healthcare, education, labor, benefits, retirement and immigration conditions.
- [x] Multiple launch cities have distinct wages, housing, jobs, transit, safety, schools, healthcare, nightlife and cultural conditions.
- [x] Neighborhoods produce local housing/safety/school/transit tradeoffs.
- [x] The controlled character and active household have one canonical current city and neighborhood.

## Economy and labor

- [x] The living-world layer owns the local unemployment, housing, wage and labor-demand mirrors used by older systems.
- [x] Industries evolve deterministically over time.
- [x] Technology pressure and economic shocks can alter industry conditions.
- [x] Employers have persistent city footprints and company-world state.
- [x] Company growth/contraction/failure can generate stored news/history.
- [x] Non-remote job availability respects employer city footprint.
- [x] Local wage conditions influence new compensation offers.
- [x] Payroll withholding uses the simplified current-country tax rate.
- [x] Payroll ledger arithmetic records gross income and separate tax outflow while cash receives net pay.

## Institutions and healthcare

- [x] Cities seed hospitals, universities, transit and community institutions.
- [x] Institutions have persistent quality/capacity/reputation/status.
- [x] Infrastructure pressure can strain institutions.
- [x] Healthcare access responds to city access, country healthcare model, socioeconomic circumstances and insurance.
- [x] Existing hidden-health-information rules remain intact.

## Shocks, news and history

- [x] Regional shocks are deterministic from world state/seed/date.
- [x] Shocks can alter jobs, housing, economy or infrastructure.
- [x] Shocks have active, recovery and resolved states.
- [x] News is emitted from canonical source entities/events rather than independent flavor generation.
- [x] High-importance local/global news can surface as a life event.
- [x] Important world changes persist in a world-history archive.

## Moving and residency

- [x] Moving costs canonical checking cash.
- [x] Destination housing conditions change household housing cost.
- [x] Destination labor conditions update local economic mirrors.
- [x] Incompatible onsite employment can end after a move.
- [x] Crossing countries updates persistent residency state.
- [x] Migration creates a migration record, player memory, world-history record and major life event.
- [x] Moving remains deterministic and offline.

## Player experience

- [x] WORLD displays current city/neighborhood/country context.
- [x] WORLD displays local wage/housing/unemployment/transit/safety/school signals.
- [x] WORLD displays local industries and institutions.
- [x] WORLD displays active shocks.
- [x] WORLD displays causal world news.
- [x] Player can select destination city/neighborhood and execute a move from WORLD.
- [x] Phase 12 layout has responsive mobile styling.

## Regression gates

- [x] Dedicated Phase 12 tests cover v11 initialization.
- [x] Dedicated tests cover custom hometown fallback.
- [x] Dedicated tests cover long-horizon deterministic world evolution.
- [x] Dedicated tests cover domestic moving and onsite job consequences.
- [x] Dedicated tests cover cross-country residency.
- [x] Dedicated tests cover v10 → v11 migration.
- [x] Dedicated tests cover country-aware payroll tax behavior.
- [x] Dedicated tests cover location-aware healthcare access.
- [x] Production-dependency security gate passes on the release candidate.
- [x] Strict simulation typecheck passes on the release candidate.
- [x] Entire cumulative Vitest suite passes on the release candidate: 62 tests.
- [x] Production web build passes on the release candidate.
- [x] Temporary iOS and Android Capacitor wrapper generation passes on the release candidate.

The final documentation-only acceptance commit must pass the same automated gate before merge so the exact merged head remains verified.

## Explicit deferrals

These are outside the v0.12 acceptance claim and remain roadmap work:

- exchange-rate/FX simulation
- detailed international taxation
- detailed visa/citizenship law
- dynamic elections and legislation
- climate simulation
- pandemic generation
- mergers/acquisitions
- full entertainment/celebrity ecosystem
- comprehensive location-specific education and healthcare institution replacement
- explicit deep-vs-statistical distant-region fidelity tiers
- exhaustive global geography

The release should not be described as including any deferred item simply because the schema leaves room for it.