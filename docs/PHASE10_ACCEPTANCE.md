# Phase 10 Acceptance — Mortality, Law & Legacy

Phase 10 may merge only when every required invariant below is implemented and the repository's full release gate is green on the exact release head.

## Required simulation behavior

- [x] New worlds are canonical schema v9 worlds.
- [x] Existing v8 saves migrate explicitly to v9 without losing prior systems.
- [x] Controlled-character death stops further requested time advancement immediately.
- [x] High-fidelity NPC death can occur without stopping the world.
- [x] Death produces persistent death, funeral and ancestor history.
- [x] Grief affects living connected people rather than being a cosmetic notification only.
- [x] Wills and deterministic intestacy fallback exist.
- [x] Active life-insurance proceeds are captured before policy cleanup.
- [x] Estate debts, funeral cost and liquid distributions are recorded.
- [x] Property, vehicle and business ownership can transfer through an estate.
- [x] Deceased investment positions cannot regenerate value after settlement.
- [x] Eligible descendants are existing people, not newly generated replacement identities.
- [x] Descendant continuation preserves the descendant's existing identity/history and exact estate distribution.
- [x] Finance initialization is safe across controlled-generation changes.
- [x] Employment cannot silently respawn after resignation, conviction or another prior employment ending.
- [x] Crime incidents separate incident date from later discovery/investigation date.
- [x] Criminal cases support charge, representation, plea/trial and conviction/acquittal state.
- [x] Severe convictions can create incarceration and later release.
- [x] Active criminal records reduce job-application competitiveness.
- [x] Incarceration blocks ordinary hiring and can end pending hiring processes.
- [x] Civil cases support filing, negotiation, settlement, trial, judgment and dismissal foundations.
- [x] Legal costs and awards use canonical finance/ledger state.

## Required player experience

- [x] LIFE shows estate/legal state while the controlled character is alive.
- [x] LIFE becomes a clear continuation surface after controlled-character death.
- [x] Eligible descendant choices show relevant existing-person and estate context.
- [x] TIMELINE keeps permanent ancestor history after continuation.
- [x] TIMELINE keeps control-transition history across generations.
- [x] Phase 10 UI has a mobile-responsive layout.

## Regression requirements

The cumulative test suite must cover at minimum:

- fresh v9 state and true v8 → v9 migration
- death/estate ordering
- life-insurance capture before cleanup
- controlled-life freeze after death
- exact descendant inheritance on continuation
- crime determinism and delayed discovery
- conviction/incarceration consequences
- criminal-record hiring penalty
- deterministic civil settlement
- employment not being recreated after voluntary resignation
- all earlier human, relationship, family, education, career, finance, sports, business, narration, cloud and health regression tests

## Release gate

The exact release head must pass:

1. production dependency security gate
2. strict simulation typecheck
3. cumulative Vitest suite
4. production build
5. temporary Capacitor iOS wrapper generation
6. temporary Capacitor Android wrapper generation

No merge is allowed if any gate is skipped or red.

## Explicitly deferred depth

Phase 10 establishes reusable legal and legacy foundations. The following deeper systems remain roadmap work rather than being falsely claimed as complete:

- jurisdiction-specific probate and estate taxation
- trusts and contested-estate litigation
- full family-court case simulation beyond the existing divorce/custody foundations
- criminal-record effects on every housing/lending/immigration/relationship pathway
- long-form end-of-life care and terminal-decline interaction flows
- detailed arrest/jail/pretrial-bail simulation

Those systems should extend the existing canonical records instead of replacing them.
