export function Logo({ compact = false }: { compact?: boolean }) {
  return <div className="brand" aria-label="EVERA">
    <svg viewBox="0 0 72 40" aria-hidden="true"><path d="M4 20h18c8 0 12-5 17-12l7-8M22 20h25M22 20h16c8 0 12 5 17 12l4 6" /></svg>
    {!compact && <strong>EVERA</strong>}
  </div>;
}
