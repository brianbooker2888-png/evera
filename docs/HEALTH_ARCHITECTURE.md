# EVERA Health & Healthcare Architecture

Phase 9 turns health from a handful of hidden human-state numbers into persistent medical history without making the player omniscient.

## Core rule

The simulation may know more than the character knows.

Hidden state can influence whether illness, injury or long-term health problems emerge. The player-facing interface should show symptoms, diagnoses, treatment, coverage, medications and bills only when the character could reasonably know them.

## Two layers, one health system

### Human health state

The pre-existing human simulation owns broad condition signals such as:

- physical condition
- mental load
- sleep debt
- fitness
- injury burden

These values are simulation inputs and consequences. They are not a medical chart and are not presented as clinical measurements.

### Canonical medical history

Phase 9 adds persistent records around that human state:

- health profiles
- medical conditions
- diagnosis state
- encounters
- medications
- medical bills
- deductible progress

A medical condition begins as `suspected` unless the simulation has recorded a qualifying healthcare encounter. A diagnosis is therefore an event in the world, not free information given to the player.

## Determinism

Health events use the same seeded world RNG as the rest of EVERA. Given the same save, seed and player decisions, offline health outcomes remain reproducible.

The system uses broad simulated categories instead of attempting real-world diagnosis prediction. Current examples include acute respiratory/viral illness, accidental injury, chronic metabolic conditions and persistent anxiety/depressive symptom patterns.

## Healthcare economics

Player healthcare uses the same finance system as rent, payroll and other expenses.

- active employment can provide an employer health policy
- preventive care can be fully covered under the current simplified policy model
- non-preventive care applies deductible and simplified coinsurance
- patient responsibility is paid from canonical checking when possible
- unpaid responsibility becomes a persistent medical bill
- medication costs recur through the same checking/ledger flow
- unresolved medical bills can increase financial-security pressure and mental load

Country-specific healthcare systems, public programs and richer insurance designs belong to the deeper-world phase rather than being hard-coded into Phase 9.

## NPC fidelity

Tier 1 and Tier 2 instantiated NPCs receive health profiles. Tier 1 NPCs can currently experience offscreen health conditions during daily simulation. Background-population health remains statistical until a person becomes relevant.

NPC healthcare finances are intentionally lighter than player finances in Phase 9. Their medical history can exist without pretending every background person has a fully reconciled household balance sheet.

## Narration boundary

Narration remains downstream of simulation truth.

- hidden risk factors are never sent as player-facing medical facts
- a diagnosed condition can become canonical narration context
- suspected or private information is not promoted to objective truth
- annual Life Chapters may mention recorded diagnoses and healthcare encounters
- an AI narration provider cannot diagnose a condition or change medical state

## Mortality boundary

Phase 9 does not kill the controlled character.

Mortality is intentionally deferred until Phase 10, where death can be implemented together with:

- funerals and grief
- wills and intestacy
- insurance and estates
- inheritance
- permanent ancestor records
- eligible-descendant continuation

This prevents a health event from ending a save before EVERA has a valid post-death gameplay path.

## Product boundary

EVERA's health mechanics are game simulation systems, not medical advice or a diagnostic tool. The model deliberately abstracts real medicine and healthcare economics for gameplay consistency.
