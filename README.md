# EVERA

**Working title:** EVERA  
**Brand line:** Live one life. Shape generations.

EVERA is a local-first persistent life and world simulation. The player is one person inside a world that continues independently.

## Current build — v0.2 Human Simulation Core

### Foundation
- React + TypeScript + Vite
- Mobile-first dark UI
- Character creation with player-selected starting circumstances
- Deterministic seeded simulation engine
- Day-based time progression with pause / 1x / 5x / 20x controls
- Local IndexedDB autosave
- Offline PWA shell and service worker
- Five primary areas: Life, People, World, Money, Timeline

### Human simulation
- Multidimensional traits and values
- Hidden needs, mental load, fitness and sleep debt
- Habits that strengthen or weaken through repeated behavior
- Competing personal goals
- Player goal reprioritization
- Human memories with significance and decay
- Tier 1 / Tier 2 / Tier 3 NPC simulation
- Autonomous goal-directed NPC decisions
- Directional relationships and domain-specific trust
- Social knowledge with source/confidence/privacy
- Canonical secrets that can remain unknown to the player
- Deterministic disclosure pathway
- v1 → v2 save migration

## Run

```bash
npm install
npm run dev
```

## Verify

```bash
npm test
npm run build
```

The simulation-only layer can also be type-checked independently with:

```bash
tsc -p tsconfig.simulation.json
```

## Architecture principle

> The database is truth. AI is narration.

Core simulation must remain deterministic and fully playable offline. AI can enrich player-facing language but may not invent canonical facts.
