# EVERA Architecture v0.2

## Non-negotiable principles

1. The player exists inside the world; the world does not exist for the player.
2. Simulate deeply. Interact selectively.
3. Everything important should have a systemic cause.
4. Core gameplay is offline-capable.
5. Canonical state is deterministic and testable.
6. AI expresses reality; it does not determine reality.
7. Important decisions surface contextually; hidden information remains hidden until the character could know it.
8. Simulation packages remain UI-agnostic.
9. Save migrations are mandatory. New systems may not invalidate a player's existing life.

## Current architecture

- `src/simulation`: deterministic world and human rules using seeded RNG.
- `src/types`: canonical schemas for people, relationships, knowledge, secrets, goals, habits, memories and world state.
- `src/persistence`: local save/load plus schema migrations.
- `src/components`: presentation and player inputs only.
- IndexedDB currently stores the normalized world object as an offline autosave.
- Future worker: moves heavy world ticks off the UI thread.
- Future SQLite/OPFS: replaces object-save persistence once normalized world tables and larger populations land.
- Optional cloud layer: auth, backup and cross-device sync. Never required to run the world.
- Future AI adapter: online/provider-independent narration layer with procedural offline fallback.

## Human simulation

Every deeply simulated human can contain:

- traits
- values
- needs
- health state
- habits
- competing goals
- mood
- memories with significance, confidence, strength, privacy and emotional valence

Player-facing UI does not expose the raw psychological numbers. It converts them into observable signals.

## NPC simulation tiers

### Tier 1 — Deep
Closest family, friends, partners, rivals and other central people. They receive daily passive state simulation and weekly goal-directed decisions.

### Tier 2 — Active
People in the player's broader social/professional orbit. They keep deep state but make deliberate decisions at reduced frequency.

### Tier 3 — Background
Statistically represented people. Their deep human state is not held in memory until relevance promotes them.

Promotion/demotion must preserve canonical history and be deterministic.

## Relationships and social truth

Relationships are directional edges rather than one shared meter. Hidden dimensions include affection, respect, attraction, resentment, familiarity, dependency and domain-specific trust.

Information is also modeled separately from truth:

- `Secret` = canonical private fact.
- `KnowledgeFact` = what one specific person believes they know, plus source, confidence, privacy and distortion.

This allows EVERA to support secrecy, gossip, misinformation and different perspectives without giving the player omniscience.

## Memory

Human memory is separate from the public Life Timeline. Memories carry strength and significance and can decay. High-significance memories persist even when minor experiences disappear.

## Save compatibility

- v1: foundation world schema.
- v2: human simulation, relationship graph, knowledge graph, secrets, NPC activity and tiered state.

`migrateWorld` upgrades v1 saves into v2 deterministically. Every future schema change must ship with a migration and regression coverage.
