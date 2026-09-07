# EVERA Mortality, Law & Legacy Architecture

## Purpose

Phase 10 makes death, estates, legal cases and generational continuation canonical simulation state. The core rule is simple:

> A generation can end without ending the world.

The simulation remains deterministic and offline-first. Legal and mortality systems operate on existing people, finances, households, careers and relationships instead of creating parallel currencies or disposable replacement characters.

## Canonical schema

App v0.10 uses world schema v9. The v9 additions are:

- death records
- funeral records
- estate plans
- estate cases
- ancestor archives
- control transitions
- crime incidents
- criminal cases
- criminal records
- incarceration records
- civil cases

A true v8 world contains none of these collections. The explicit v8 → v9 migration adds them empty and then hydrates normal simulation systems. Older v1–v7 saves continue through the existing migration ladder before entering v9.

## Mortality boundary

Mortality is simulation state, not narration state. Age, health state, recorded conditions and deterministic seeded randomness can produce death. Exact lifespan is never exposed to the player.

When a high-fidelity NPC dies, the world continues and the person is removed from active employment, household, partnership and other living-person systems while their history remains.

When the controlled character dies, the current simulation day completes only through the death event. Additional requested time advancement stops immediately. The player must resolve continuation before the ordinary daily loop resumes.

## Estate ordering

Death settlement order is intentionally strict:

1. Record the death.
2. Capture the deceased controlled character in the ancestor archive.
3. Resolve spouse/heir state while the legal relationship still exists.
4. Capture active life-insurance proceeds before policies are deactivated.
5. Calculate gross assets, debts, funeral cost and available estate value.
6. Settle liabilities and liquid financial balances.
7. Transfer canonical property, vehicle and business ownership.
8. Clear investment positions tied to settled deceased accounts so later market ticks cannot recreate value.
9. Record distributions, funeral state and grief consequences.
10. Clean up living-person contracts, schedules, policies and active relationship state.

This order prevents two classes of bugs: losing a valid spouse/insurance beneficiary because cleanup ran too early, and resurrecting a deceased portfolio because market positions survived after account balances were zeroed.

## Wills and intestacy

A player can create a simple estate plan selecting known living beneficiaries. Shares are normalized across selected beneficiaries.

If there is no valid will beneficiary, the current deterministic intestacy fallback prioritizes:

- surviving spouse and children
- surviving spouse alone
- children alone
- then an eligible parent fallback

This is a game-system abstraction, not a jurisdiction-specific legal simulator. Deeper country/state probate law, trusts, contested estates and tax treatment remain future living-world/legal modules.

## Generational continuation

Continuation never creates a fresh replacement person. An eligible existing descendant is promoted into the controlled-character role.

The transition preserves:

- the descendant's person ID
- birth date and age
- traits and human state
- memories and relationships
- health state
- education/career records already attached to that person
- the exact estate cash distribution already recorded for that heir

The deceased controlled character remains in `ancestorArchives`, and the handoff is recorded in `controlTransitions`.

Finance initialization is owner/household-aware so a new generation receives appropriate checking/budget/obligation/insurance state without reviving the prior generation's bills or silently duplicating them.

## Employment invariant

Progression initialization may seed a starting employment only when the controlled person has no employment history at all.

It must never infer that `no active employment` means `never employed`.

This prevents employment from being silently recreated after:

- resignation
- firing or layoff
- incarceration/conviction
- death cleanup
- future job-ending systems

## Crime and criminal cases

Crime incidents are canonical events with an actor, offense, severity, evidence strength, optional victim and separate discovery state.

Incident date and discovery date are intentionally separate. A crime may remain undiscovered for days or months, and investigation timing is measured from discovery rather than the original event.

The current criminal flow supports:

- undiscovered incident
- investigation
- charge
- plea or trial
- conviction or acquittal
- financial penalties
- incarceration for sufficiently severe outcomes
- release
- persistent criminal record

Legal representation changes outcome pressure and cost but does not guarantee a result.

## Career consequences

Active criminal records reduce job-application competitiveness. Incarceration blocks ordinary job applications and ends in-progress hiring processes.

A conviction can end active employment. The progression invariant above ensures that employment remains ended until a later valid hiring action creates a new contract.

Additional housing, lending, immigration and relationship consequences can be layered onto the same criminal-record collection in future modules without changing the canonical legal history.

## Civil cases

Civil cases support filing, negotiation, deterministic settlement, trial, judgment and dismissal foundations. Awards and legal costs use the same checking account, liability and ledger systems as ordinary finance.

The current civil model is intentionally abstract. It establishes a reusable legal-case lifecycle for later business, injury, employment, property, family and estate disputes.

## Player interface

LIFE exposes legal/legacy state contextually:

- while alive: estate planning, active criminal/civil matters, records and legal choices
- after controlled-character death: death summary, estate context and eligible descendant continuation

TIMELINE preserves permanent ancestor cards and control-transition history after continuation.

## Determinism and AI boundary

Mortality, inheritance, legal outcomes, convictions, settlements and control transitions are determined by simulation code and seeded state.

AI or narration may describe these outcomes, but it may not create, alter or adjudicate canonical legal or mortality facts.
