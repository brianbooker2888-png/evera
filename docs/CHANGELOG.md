# EVERA Changelog

## v0.4.0 — Education, Careers & Labor Market

- Upgraded the world save schema to v4.
- Added persistent public/charter school, university and trade-school institutions.
- Added age-appropriate automatic school enrollment for minors.
- Added postsecondary enrollment with admission logic, tuition, scholarships, GPA, attendance, credits and student debt.
- Added persistent credentials earned through completed education programs.
- Added transferable skill records for Communication, Analysis, Operations, Leadership and Technology.
- Added persistent employers and job openings with compensation, schedule, work mode and qualification requirements.
- Added deterministic job applications that can progress through submitted, interview, offer and rejection states.
- Added explicit player acceptance of job offers.
- Added canonical employment history with salary, pay frequency, benefits, workload, schedule, performance and satisfaction.
- Replaced the Phase 1 fixed Friday paycheck with payroll generated from the active employment contract.
- Added skill development from work experience and workload effects on stress/energy.
- Added a labor-market model for demand, wage conditions and remote-work share.
- Integrated work and education schedules with household schedules.
- Added Career and Education player interfaces within LIFE and institution visibility within WORLD.
- Added student debt visibility in MONEY.
- Added v1/v2/v3 → v4 save migration and v4 normalization.
- Expanded deterministic regression tests for education, applications, employment, payroll and migration.

## v0.3.0 — Relationships & Households

- Added canonical partnership state separate from directional relationship feelings.
- Added attraction eligibility, compatibility and deterministic chemistry foundations.
- Added dating, exclusivity, cohabitation, engagement, marriage, breakup and divorce actions.
- Added autonomous NPC-to-NPC romance opportunities.
- Added household objects with housing cost, members, schedules, labor assignments and finance styles.
- Added household labor imbalance consequences.
- Added offline free-text conversation intent/tone parsing and procedural replies.
- Added romantic orientation to character creation and migrated NPC romantic profiles.
- Added negotiated family planning.
- Added pregnancy records, due dates and birth processing.
- Added children as Tier 1 simulated people with inherited traits and child-development state.
- Added parenting actions with gradual development effects.
- Added biological, spouse, step-family and sibling links.
- Added blended-household support.
- Added divorce household splitting, shared custody and child-support ledger hooks.
- Added family-network, household, conversation, parenting and custody UI.
- Added v1/v2 → v3 save migrations and v3 normalization.
- Added GitHub Actions CI for simulation typecheck, tests and production build.

## v0.2.0 — Human Simulation Core

- Added multidimensional human values, needs, health state and mood.
- Added habits with consistency and reinforcement.
- Added competing goals and player reprioritization.
- Added Tier 1, Tier 2 and Tier 3 NPC simulation.
- Added autonomous NPC goal-directed decisions.
- Added directional relationship edges and domain-specific trust.
- Added human memories with strength/significance decay.
- Added canonical secrets and person-specific knowledge facts.
- Added deterministic private disclosure pathway.
- Added tier promotion/demotion foundation.
- Added observable human-state signals in the UI instead of raw psychological scores.
- Added v1 → v2 save migration.
