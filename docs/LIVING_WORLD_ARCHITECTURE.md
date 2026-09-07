# EVERA Living World Architecture

## Purpose

Phase 12 turns location from descriptive text into canonical simulation state. The player lives inside countries, cities and neighborhoods that have independent labor, housing, institutional and industry conditions. Those conditions evolve whether or not the player is actively looking at the WORLD screen.

The governing rule is:

> Geography is a cause, not decoration.

A move can change housing cost, local wages, job availability, healthcare access, residency state and the institutions surrounding the household. World news is emitted from stored simulation facts rather than generated as disconnected flavor text.

## Canonical schema

App v0.12.0 uses world schema v11.

`LivingWorldState` is persisted as part of the save and contains:

- country profiles
- city profiles
- neighborhood profiles
- industries
- world institutions
- employer/company world state
- policy snapshots
- residency records
- regional shocks
- world news
- world-history records
- migration records
- current city and neighborhood IDs

The v10 → v11 migration adds these collections deterministically and infers the controlled character's starting city from the existing location string. Earlier saves continue through the existing migration ladder before the same v11 upgrade.

## Country layer

The launch foundation includes profiles for the United States, Canada, the United Kingdom and Mexico.

Country profiles currently own simplified values for:

- currency metadata
- household income-tax environment
- healthcare model
- education conditions
- labor protection
- benefit generosity
- retirement age
- immigration openness
- overall cost index

These are simulation abstractions, not claims to reproduce every real statute or tax rule.

Phase 12 uses country tax rates for simplified payroll withholding and country healthcare models as an input to healthcare access. Policy snapshots are persistent but dynamic elections and legislative changes are not yet simulated.

## City layer

Launch city profiles include:

- Phoenix
- Seattle
- Atlanta
- Toronto
- Vancouver
- London
- Manchester
- Mexico City
- Monterrey

Each city stores:

- population
- wage index
- housing index
- unemployment
- transit quality
- safety
- school quality
- healthcare access
- nightlife
- culture
- industry footprint
- growth rate

A hometown that does not correspond to a seeded city is preserved through a deterministic custom-city fallback instead of being silently mapped to another city in the same state or region.

## Neighborhood layer

Each seeded or custom city receives neighborhood profiles that create local tradeoffs rather than one citywide housing value.

The initial framework differentiates central, family-oriented and value districts through:

- housing cost
- safety
- schools
- transit
- prestige
- density

The controlled household has one canonical current neighborhood.

## Local economic authority

Phase 12 makes the living-world layer authoritative for the local values mirrored into older systems:

- `economy.unemploymentRate`
- `economy.housingIndex`
- `laborMarket.wageIndex`
- `laborMarket.demandIndex`

The core engine no longer independently drifts unemployment and housing after the living-world simulation runs.

This prevents two different systems from fighting over the same economic facts.

## Industries

Industries have persistent:

- demand
- wage conditions
- automation pressure
- growth
- city footprints

Launch industries include logistics/supply chain, healthcare, technology, finance, media/entertainment and manufacturing.

Monthly evolution is deterministic from world seed and date. Recessions, labor shortages, technology shifts and supply disruptions can alter industry trajectories.

## Companies and jobs

Existing employers receive a persistent company-world record with:

- operating cities
- health
- growth
- headcount index
- status

Company conditions can evolve into growing, stable, contracting or failed states. Employer stability and wage conditions are updated from that company state.

Non-remote job applications now respect employer city footprints. Moving can therefore close one labor path while opening another. Remote roles remain geographically portable.

Phase 12 does not yet simulate mergers/acquisitions despite reserving an `acquired` state for later expansion.

## Payroll and taxes

Payroll uses the current country's simplified tax environment.

For ledger consistency:

- gross payroll is recorded as positive Income
- estimated payroll tax is recorded as a separate negative Tax entry
- checking/cash receives net pay

This keeps the ledger's arithmetic equal to the cash effect.

This is a simplified game model, not a tax preparation system. Multi-jurisdiction tax filing, deductions, brackets, exchange rates and treaty handling remain later depth.

## Healthcare integration

Healthcare access now considers:

- socioeconomic circumstances
- active insurance
- current city's healthcare-access value
- current country's healthcare model

Universal and mixed-public systems can provide access advantages that do not depend entirely on employer insurance. Outcomes remain probabilistic and the existing hidden-health-information rules are unchanged.

## Institutions

Cities currently seed persistent:

- hospitals
- universities
- transit authorities
- community networks

Institutions have quality, capacity, reputation and status. Infrastructure pressure can reduce quality and create a strained state. Important strain can generate local news.

This is the world-institution foundation. It does not yet replace every existing education or healthcare interaction with a location-specific institution object.

## Regional shocks

The Phase 12 engine can currently create deterministic:

- recessions
- housing booms
- housing corrections
- disasters
- supply disruptions
- labor shortages
- technology shifts
- strikes

Shocks can affect economic, housing, employment and infrastructure conditions. They progress from active to recovering to resolved rather than disappearing immediately.

The type system reserves pandemic support, but pandemic generation is not included in the v0.12 release claim.

## Causal news and history

World news is produced from canonical entities and events such as:

- company expansion/contraction/failure
- industry movement
- institution strain
- regional shocks

Every item stores a source ID and location/scope. High-importance local or global items can surface as ordinary life events.

Important shocks, company changes and migrations are also written to permanent world history so the world can develop an archive across generations.

## Moving and residency

A player-directed move:

1. verifies available checking cash
2. charges a housing-index-adjusted moving cost
3. updates country residency when crossing borders
4. changes the canonical city/neighborhood
5. changes character and household location
6. recalculates household housing cost
7. ends incompatible non-remote employment when the employer has no destination footprint
8. refreshes household finance
9. updates local economic mirrors
10. records migration, memory, world history and a major life event

International residency is intentionally simplified in v0.12. A destination currently receives a baseline work-visa or visitor state based on immigration openness. Detailed visa eligibility, renewals, citizenship law and deportation processes remain future work.

## Simulation order

The living-world simulation executes before careers, lifestyle, finance and health on each day.

That ordering lets downstream systems consume current local conditions instead of yesterday's values.

## Offline and determinism guarantees

No Phase 12 system requires network access or an LLM.

City evolution, company changes, shocks, moving consequences and causal news are deterministic from canonical state, seed and date.

Narration can later describe these facts, but narration is not permitted to create them.

## Explicit v0.12 boundaries

The following are intentionally not claimed as complete:

- currency conversion and FX markets
- detailed international tax systems
- full immigration/visa/citizenship law
- dynamic elections or legislation
- climate-change simulation
- pandemic generation
- full company merger/acquisition mechanics
- full entertainment/celebrity ecosystem
- complete location-specific replacement of education/medical institution gameplay
- full distant-region statistical simulation tiers
- every world country or city

These should extend the v11 architecture rather than create parallel location systems.