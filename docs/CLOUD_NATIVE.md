# EVERA Cloud & Native Architecture

EVERA remains a local-first game. Cloud saves, account sign-in, enhanced narration and native wrappers are optional distribution features around the deterministic simulation, not prerequisites for play.

## Cloud saves

### Supabase setup

1. Create a Supabase project.
2. Run `docs/supabase-schema.sql` in the SQL editor.
3. Configure the public client values in the web/native build environment:

```text
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Never place a Supabase service-role key in the web or native client.

The database uses row-level security so an authenticated user can only access rows whose `user_id` matches `auth.uid()`.

### Sync behavior

The canonical world JSON is still stored locally in IndexedDB. Device and sync metadata are stored separately and never become gameplay facts.

EVERA computes a deterministic checksum for the world and compares three states:

- the current local checksum
- the last checksum successfully shared by both sides
- the current remote checksum

The sync engine behaves conservatively:

- identical local/remote: no-op
- only local changed: upload a new cloud revision
- only remote changed: restore the cloud revision locally
- both changed: report a conflict and require an explicit choice

EVERA intentionally does not attempt field-level merging of divergent simulation histories. Two worlds that advanced independently may contain incompatible random events, finances, relationships, sports outcomes and family state.

## Authentication

The initial provider uses Supabase email OTP/magic-link authentication. Authentication is optional. Signing out never removes the local save.

## Enhanced narration

The browser/mobile client never receives a private narration-provider credential.

When enhanced narration is enabled, the client can POST an already-sanitized narration packet to:

```text
/api/narrate
```

Netlify routes that request to `netlify/functions/narrate.mjs`. Configure the function with server-only environment variables:

```text
EVERA_NARRATION_PROVIDER_URL=...
EVERA_NARRATION_PROVIDER_TOKEN=...
```

The gateway forwards only the narration packet, not the full EVERA save. It also filters returned fact IDs against the IDs the context compiler approved. If the remote path is disabled or fails, the client falls back to deterministic offline narration.

## Native wrappers

EVERA uses Capacitor so iOS, Android and web share the same React/Vite application and simulation engine.

The working native identifier is:

```text
com.evera.game
```

This is provisional while EVERA remains a working brand and should be replaced before app-store submission if brand/legal clearance changes the final product name.

### Generate platforms locally

```bash
npm install
npm run build
npm run native:add:ios
npm run native:add:android
npm run native:sync
```

Open the platform projects with:

```bash
npm run native:ios
npm run native:android
```

Xcode/macOS is required for final iOS signing/build submission. Android Studio/JDK/Android SDK are required for final Android signing/build submission.

The repository deliberately keeps generated platform directories out of the Phase 8 source release. CI generates temporary iOS and Android projects and runs Capacitor sync to prove the web build is wrapper-compatible without making generated native project files the primary source of truth.

## Security boundaries

- Local play never needs Supabase.
- Cloud failures never block IndexedDB saving.
- Cloud metadata never alters simulation truth.
- Divergent histories are never silently merged.
- Supabase service credentials never enter the client.
- Narration-provider secrets stay server-side.
- Remote narration sees sanitized context, not the full save.
- Offline narration remains the mandatory fallback.
