# Phase 14 Acceptance — Visual Experiences, Sports Presentation & Memory Cards

Phase 14 may be released only if all requirements below are true on the exact PR head merged to `main`.

## Presentation architecture

- [x] Visual presentation is derived from canonical state rather than stored as a second simulation.
- [x] No Phase 14 visual helper mutates a completed match result.
- [x] No Phase 14 visual helper creates canonical memories, clothing, family links or demographic attributes.
- [x] Presentation helpers are deterministic for the same world/date/context.
- [x] Phase 14 does not require a save-schema bump for presentation-only state.

## Sports presentation

- [x] Soccer completed fixtures can be visualized from stored match moments.
- [x] American-football completed fixtures use the same shared match-viewer model.
- [x] Full viewing mode shows every stored match moment.
- [x] Extended mode filters to meaningful stored chances/big plays/scores.
- [x] Key-moments mode filters to high-importance stored moments.
- [x] Result-only mode presents the final score without replay moments.
- [x] Replay controls support previous, next, restart and autoplay.
- [x] Player-authored match moments can identify the controlled character visually.
- [x] Athlete match preparation uses existing canonical training actions before future matches.
- [x] Coach match preparation uses the existing canonical coaching-style action before future matches.
- [x] Completed-match viewing cannot retroactively change the fixture.

## Visual people, aging and outfits

- [x] Visual-person descriptors show deterministic age-band changes.
- [x] Current canonical family members share a family visual key.
- [x] Unrelated people do not inherit the controlled family's visual key.
- [x] Family resemblance does not infer race, ethnicity or another sensitive demographic attribute.
- [x] Contextual outfit selection maps to canonical wardrobe categories.
- [x] Wardrobe quality/condition influences presentation metadata when an owned matching item exists.
- [x] Neutral presentation fallback works when no matching wardrobe item exists.
- [x] Archived lives can be represented without inventing missing demographic fields.

## Memory cards and family history

- [x] Visual Memory Cards are derived only from canonical memories and lifestyle milestones.
- [x] Duplicate same-date/same-title visual cards are suppressed without deleting canonical source records.
- [x] Family album uses living family links plus ancestor archives.
- [x] Birth presentation category exists.
- [x] Graduation presentation category exists.
- [x] Proposal presentation category exists.
- [x] Wedding presentation category exists.
- [x] Home/move presentation category exists.
- [x] Promotion/career-change presentation category exists.
- [x] Hospital/medical presentation category exists.
- [x] Divorce/separation presentation category exists.
- [x] Funeral/death presentation category exists.
- [x] Retirement presentation category exists.

## Accessibility and responsive presentation

- [x] Phase 14 presentation uses semantic buttons for replay controls and viewing modes.
- [x] Reduced-motion preference disables match-marker animation.
- [x] Phase 14 surfaces have mobile breakpoints.
- [x] Text remains actual DOM text rather than being baked into decorative imagery.
- [x] Match visualization has a text description/scoreboard alongside the visual field.
- [ ] Manual keyboard-navigation sanity check completed on the final release candidate.
- [ ] Manual mobile-layout sanity check completed on the final release candidate.

## Regression and release gates

- [x] Dedicated tests cover deterministic visual-person derivation.
- [x] Dedicated tests cover family visual-key behavior.
- [x] Dedicated tests cover sports viewing-mode filtering.
- [x] Dedicated tests cover soccer/football chronological progress mapping.
- [x] Dedicated tests cover major-scene classification.
- [x] Dedicated tests cover visual-memory derivation from canonical records.
- [ ] Production-dependency security gate passes on final v0.14.0 candidate.
- [ ] Strict simulation typecheck passes on final v0.14.0 candidate.
- [ ] Entire cumulative Vitest suite passes on final v0.14.0 candidate.
- [ ] Production web build passes on final v0.14.0 candidate.
- [ ] Temporary iOS and Android Capacitor wrapper generation passes on final v0.14.0 candidate.

## Explicit deferrals

The release must not be described as including:

- photorealistic/fully 3D character rendering
- user face uploads or likeness generation
- licensed real teams/kits/stadiums/player likenesses
- joystick sports gameplay
- real-time physics
- generated cinematic video
- editable genetic appearance systems not present in canonical state
- full 3D home interiors

The exact docs/version/cache head must pass the same automated release gate before merge.
