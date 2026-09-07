# Phase 2 Acceptance Criteria

Phase 2 is complete when all of the following remain true:

1. Same seed + same player actions + same elapsed days = identical canonical world state.
2. Tier 1 NPCs make autonomous goal-directed choices without player commands.
3. Tier 2 NPCs preserve human state while using lower decision frequency.
4. Tier 3 NPCs do not allocate full HumanState until promoted.
5. NPC motives and relationship math are not exposed directly in normal UI.
6. Human needs are surfaced as contextual signals rather than meters used for optimization.
7. Relationship state is directional and supports domain-specific trust.
8. Canonical secrets can exist without the player knowing them.
9. Player knowledge records source/confidence/privacy separately from canonical truth.
10. Memories can decay without deleting high-significance experiences.
11. Player goals can be reprioritized without mutating prior state objects.
12. v1 saves migrate to v2 rather than being rejected.
13. Core simulation remains independent of React, cloud services and AI APIs.
14. A 365-day deterministic smoke test passes.
