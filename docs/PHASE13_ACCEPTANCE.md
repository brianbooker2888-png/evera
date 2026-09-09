# Phase 13 Acceptance — Game Modes, Onboarding, Accessibility & Recovery

Phase 13 may be released only if all requirements in this document are true on the exact PR head merged to `main`.

## Canonical state and migration

- [x] Fresh worlds are schema v12.
- [x] `gameConfiguration` is persisted in the canonical world save.
- [x] v11 saves migrate explicitly to v12.
- [x] Earlier supported saves still migrate through the cumulative ladder before v12.
- [x] Existing v11 worlds default to standard Life Mode rather than being reinterpreted as another mode.
- [x] Existing Phase 12 geography, history and earlier subsystem state survive migration.

## Game modes

- [x] Life Mode is the standard baseline.
- [x] Hard Life changes starting resources, world pressure and mortality pressure through actual simulation rules.
- [x] Sandbox increases starting resources, softens shocks and disables configured random premature mortality.
- [x] Legacy activates dynasty-focused rules/goals without replacing the normal simulation.
- [x] Scenario mode supports deterministic preset starting conditions.
- [x] Fresh Start, Career Rebuild and Legacy Seed scenario foundations exist.
- [x] Selected game mode remains locked to that life after creation.
- [x] Mode rules remain deterministic from seed/state/date.

## Character creation and starting family

- [x] Character creation is a guided multi-step flow rather than one large form.
- [x] Player can configure major personality dimensions.
- [x] Player can configure the six primary athletic dimensions.
- [x] Player can configure family structure, sibling count and parent closeness.
- [x] Two-parent, single-parent, guardian and independent starts are supported.
- [x] Minor starts place configured resident family into the starting household.
- [x] Adult starts preserve family relationships without forcing co-residence.
- [x] Simple defaults remain available so advanced setup is optional.

## Serious-content preferences

- [x] Premature-death preference changes future random mortality generation.
- [x] Pregnancy-loss preference gates future generated pregnancy-loss events.
- [x] Violent-crime preference blocks player assault actions and removes assault from background crime generation.
- [x] Severe-illness preference prevents chronic severe-illness generation and caps ordinary acute-illness generation below the severe range.
- [x] Content-setting changes do not delete or rewrite existing world history.
- [x] Addiction-content preference is persisted for future systems.
- [x] v0.13.0 does not claim that an addiction generator exists.

## Accessibility

- [x] Text scale supports standard, large and extra-large modes.
- [x] High-contrast mode is persisted.
- [x] Reduced-motion mode is persisted.
- [x] Stronger focus outlines are persisted.
- [x] Accessibility choices apply during creation and after world creation.
- [x] Accessibility choices do not alter simulation state/results.
- [x] First-run onboarding uses dialog semantics and a keyboard-focused primary action.
- [x] Restore status uses an announced status region.
- [x] File input remains keyboard-operable through its visible trigger.
- [x] Phase 13 UI includes responsive mobile styling.

## Onboarding and recovery

- [x] New/migrated worlds can receive a concise first-life introduction before time begins.
- [x] Onboarding explains time control, independent world behavior and where preferences live.
- [x] Timeline exposes persistent accessibility and serious-content preferences.
- [x] Portable JSON export includes canonical world state and schema metadata.
- [x] Portable restore accepts current v12 saves.
- [x] Portable restore accepts supported older raw saves through the normal migration path.
- [x] Malformed/unsupported backups fail safely without changing the active life.
- [x] Selecting a valid backup does not replace the active life until explicit confirmation.
- [x] Restore applies the restored save's accessibility preferences.

## Regression gates

- [x] Dedicated Phase 13 tests cover v12 initialization and Life Mode defaults.
- [x] Dedicated tests cover actual mode-resource/rule differences.
- [x] Dedicated tests cover Sandbox mortality behavior.
- [x] Dedicated tests cover minor/adult starting-family behavior.
- [x] Dedicated tests cover deterministic Scenario starts.
- [x] Dedicated tests cover persisted accessibility/content preferences.
- [x] Dedicated tests cover mid-save comfort-setting updates without mode mutation.
- [x] Dedicated tests cover violent-crime, pregnancy-loss and severe-illness gates.
- [x] Dedicated tests cover v11 → v12 migration.
- [x] Dedicated tests cover portable-save round trip, legacy migration and malformed-file rejection.
- [x] Dedicated tests cover long-horizon mode determinism.
- [x] Production-dependency security gate passes on the final release candidate.
- [x] Strict simulation typecheck passes on the final release candidate.
- [x] Entire cumulative Vitest suite passes on the final release candidate: 78 tests.
- [x] Production web build passes on the final release candidate.
- [x] Temporary iOS and Android Capacitor wrapper generation passes on the final release candidate.

The exact acceptance head must pass the same automated gate before merge so the merged code is identical to a verified release candidate.

## Explicit deferrals

These are outside the v0.13.0 acceptance claim:

- complete addiction/substance-use disorder simulation
- arbitrary Sandbox rule sliders
- mid-life mode switching
- large authored Scenario library
- full 3D/visual character creator
- localization
- formal third-party accessibility certification
- automatic cross-device portable-file transfer

The release should not be described as including any deferred item simply because the schema or UI leaves room for it.
