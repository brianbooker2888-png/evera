# Phase 13 Scope — Game Modes, Onboarding, Accessibility & Recovery

Phase 13 turns EVERA's starting experience and save-level rules into canonical simulation systems rather than UI-only preferences.

## In scope

- schema v12 with persistent `gameConfiguration`
- explicit v11 → v12 migration and cumulative migration from all older supported saves
- Life Mode, Hard Life, Sandbox, Legacy and Scenario configurations
- deterministic mode rules for starting resources, world-shock pressure, economic pressure and premature mortality
- Scenario starts for Fresh Start, Career Rebuild and Legacy Seed
- guided five-step character creation
- configurable starting family structure, sibling count and parent closeness
- explicit personality and athletic-dimension setup controls
- persistent serious-content preferences
- simulation gates for premature death, pregnancy loss, violent crime and severe-illness generation
- persistent addiction-content preference for future addiction systems without claiming an addiction generator exists today
- persistent accessibility preferences for text scale, high contrast, reduced motion and stronger focus outlines
- first-life onboarding
- in-save preference controls
- portable JSON backup and two-step restore
- mode remains locked to the life while comfort/content preferences can change
- v0.13.0 PWA/cache/version release hygiene

## Design constraints

- Offline play remains complete.
- Deterministic simulation remains authoritative.
- Modes change simulation inputs/rules, not hidden narrative outcomes.
- Serious-content preferences affect future generated events and do not rewrite history.
- Accessibility settings may never change simulation results.
- Restoring a save must use the normal migration path rather than bypassing schema validation.
- Selecting a restore file must not overwrite the active life until the player explicitly confirms the replacement.
- Existing worlds migrate to standard Life Mode rather than being reinterpreted as Hard Life, Sandbox or Legacy.

## Explicitly deferred

- a complete addiction/substance-use disorder simulation
- arbitrary custom Sandbox rule sliders
- mid-life game-mode switching
- a large library of authored Scenario campaigns
- cloud backup replacement for local-first saves
- cross-device automatic portable-file transfer
- full visual character creator / 3D avatar editor
- localization of onboarding and settings UI
- exhaustive accessibility certification across every future platform wrapper

The schema may leave room for these items, but v0.13.0 must not claim them as complete.
