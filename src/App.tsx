import { useEffect, useState } from 'react';
import type { WorldState } from './types/game';
import { createWorld, type CharacterDraft } from './simulation/createWorld';
import { deleteWorld, loadWorld } from './persistence/store';
import { CharacterCreator } from './components/CharacterCreator';
import { AppShell } from './components/AppShell';

export default function App() {
  const [world, setWorld] = useState<WorldState | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { loadWorld().then(setWorld).finally(() => setReady(true)); }, []);
  if (!ready) return <div className="loading">Loading your world…</div>;
  if (!world) return <CharacterCreator onCreate={(draft: CharacterDraft) => setWorld(createWorld(draft))} />;
  return <AppShell initial={world} onReset={() => { deleteWorld().finally(() => setWorld(null)); }} />;
}
