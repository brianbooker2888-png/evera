import { useEffect, useState } from 'react';
import type { WorldState } from './types/game';
import { createWorld, type CharacterDraft } from './simulation/createWorld';
import { applyAccessibilityPreferences } from './simulation/gameConfig';
import { deleteWorld, loadWorld } from './persistence/store';
import { CharacterCreator } from './components/CharacterCreator';
import { AppShell } from './components/AppShell';
import { OnboardingOverlay } from './components/OnboardingOverlay';

export default function App() {
  const [world, setWorld] = useState<WorldState | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { loadWorld().then(setWorld).finally(() => setReady(true)); }, []);
  useEffect(()=>{if(world)applyAccessibilityPreferences(world.gameConfiguration);},[world]);
  if (!ready) return <div className="loading">Loading your world…</div>;
  if (!world) return <CharacterCreator onCreate={(draft: CharacterDraft) => setWorld(createWorld(draft))} />;
  if(!world.gameConfiguration.onboarding.completed)return <OnboardingOverlay world={world} onChange={setWorld}/>;
  return <AppShell initial={world} onReset={() => { deleteWorld().finally(() => setWorld(null)); }} />;
}
