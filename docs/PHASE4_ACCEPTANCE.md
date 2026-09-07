# Phase 4 Acceptance — Education, Careers & Labor Market

Phase 4 is accepted only when all of the following remain true under deterministic simulation and save migration.

## Education
- Schools and postsecondary institutions are persistent world entities.
- Minors begin in age-appropriate schooling rather than adult employment.
- The player can enroll in eligible university or trade programs.
- Enrollment tracks GPA, attendance, credits, scholarship aid, tuition and student debt.
- Academic progress advances on the world calendar and can end in a persistent credential.
- Children can become enrolled automatically as they reach school age.

## Careers
- Employers and job openings are persistent world entities.
- Job applications have deterministic qualification scores and move through submitted, interview, offer or rejection states.
- Offers require explicit player acceptance.
- Employment tracks title, employer, salary, schedule, work mode, benefits, performance and satisfaction.
- Leaving or accepting a job updates the canonical employment history and player schedule.
- Payroll comes from the active employment contract, not a global hard-coded paycheck.
- Workload can affect stress, energy, satisfaction and skill development.

## Economy and integration
- Labor demand responds to unemployment and the seeded world economy.
- Career and education schedules coexist with household schedules.
- Education expenses can create both cash outflow and student debt.
- Career/education events can become major life memories without AI determining their outcomes.

## Compatibility
- New worlds use save schema v4.
- v1, v2 and v3 saves migrate to v4.
- Migration preserves existing NPCs, relationships, memories, households, family links and ledger history.
- Offline deterministic simulation remains authoritative.

## Release gate
- Simulation TypeScript check passes.
- Full Vitest regression suite passes.
- React/Vite production build passes in GitHub Actions.
