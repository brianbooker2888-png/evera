# EVERA

**Working title:** EVERA  
**Brand line:** Live one life. Shape generations.

EVERA is a local-first persistent life and world simulation. The player is one person inside a world that continues independently.

## Current build — v0.3.0 Relationships & Households

### Foundation
- React + TypeScript + Vite
- Mobile-first dark UI
- Deterministic seeded simulation engine
- Local IndexedDB autosave and offline PWA shell
- Five primary areas: Life, People, World, Money, Timeline

### Human simulation
- Multidimensional traits, values, needs, health, habits, goals and memories
- Tier 1 / Tier 2 / Tier 3 NPC simulation
- Autonomous goal-directed NPC decisions
- Directional relationships, person-specific knowledge and canonical secrets

### Relationships & households
- Dating → exclusivity → cohabitation → engagement → marriage → breakup/divorce
- Compatibility and deterministic chemistry foundations
- Autonomous NPC-to-NPC romance
- Canonical households, schedules, labor and finance styles
- Offline free-text conversation intent/tone handling
- Family planning, pregnancy and birth
- Children as full simulated people with development state
- Parenting, step-family links, custody and co-parenting foundations
- v1/v2 → v3 save migrations

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

## Architecture principle

> The database is truth. AI is narration.

Core simulation remains deterministic and fully playable offline. AI may enrich player-facing language later, but it may not invent canonical facts or decide outcomes.
