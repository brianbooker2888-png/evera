# Phase 14 Scope — Visual Experiences, Sports Presentation & Memory Cards

Phase 14 adds a presentation layer to EVERA without creating a second simulation or allowing visuals to invent canonical facts.

## In scope

- stylized-realism presentation language for important life scenes
- deterministic visual-person descriptors derived from canonical identity, age, family links and lifestyle state
- age-band presentation changes across childhood, adolescence, adulthood and later life
- family-resemblance cues derived from canonical family-network membership
- automatic contextual outfit presentation using canonical wardrobe categories and quality/condition state
- soccer match-moment visualization using stored deterministic `MatchMoment` records
- American-football match-moment visualization using the same shared sports-state model
- Full, Extended, Key moments and Result-only viewing modes
- deterministic replay navigation and autoplay over stored match moments
- clear indication when the controlled character was the recorded actor in a match moment
- next-match athlete preparation using existing canonical training actions
- next-match coach approach using the existing canonical coaching-style action
- visual Memory Cards derived only from recorded memories and lifestyle milestones
- family album combining living canonical family links with archived prior generations
- major-scene presentation categories for birth, graduation, proposal, wedding, home, promotion, hospital, divorce, funeral and retirement
- responsive and reduced-motion behavior for Phase 14 presentation surfaces
- deterministic presentation regression coverage
- v0.14.0 version/cache/documentation release hygiene

## Core constraints

- The simulation remains authoritative.
- A completed match replay may never change a result, score, statistic, injury or canonical event.
- Viewing modes only filter or sequence stored moments.
- Visual-person presentation may not infer race, ethnicity, religion or other sensitive identity attributes that are not canonical game state.
- Family resemblance is a visual family-language cue, not a genetic or demographic claim.
- Outfit presentation must use existing wardrobe/style state or a neutral category fallback; it may not create owned clothing assets in canonical state.
- Memory cards must originate from recorded simulation memories or lifestyle milestones.
- Major-scene classification changes presentation only and never rewrites the underlying event.
- Accessibility preferences from Phase 13 remain authoritative, including reduced motion, text scaling, contrast and focus behavior.
- Offline play remains complete.
- No save-schema bump is required unless a later Phase 14 feature introduces genuinely canonical state.

## Explicitly deferred

- photorealistic or fully 3D character rendering
- user-uploaded face likenesses
- licensed real-world teams, kits, stadiums or player likenesses
- joystick-controlled sports gameplay
- real-time physics simulation
- cinematic video generation
- editable genetic appearance traits that do not yet exist in canonical person state
- a full room-by-room 3D home renderer
- automatic generation of new canonical memories from the presentation layer

Phase 14 should be described as a deterministic stylized presentation system layered over the existing simulation, not as a separate visual simulation engine.
