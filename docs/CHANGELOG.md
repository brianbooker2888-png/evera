# EVERA Changelog

## v0.5.0 — Money, Housing & Wealth

- Upgraded the world save schema to v5.
- Added canonical checking, savings, brokerage and retirement accounts.
- Kept `character.cash` as a compatibility mirror while checking became the liquid-money source of truth.
- Added recurring household obligations with due dates, autopay, past-due balances and missed-payment history.
- Removed the legacy standalone monthly rent charge so housing bills have one authoritative owner.
- Added household-size grocery/utilities costs and childcare obligations for young children.
- Added household budget rules, emergency-fund targets and automatic savings/investment rates.
- Added credit profiles with score, utilization, payment history, account age, inquiries and derogatory marks.
- Added credit-card, student, auto, mortgage and personal liabilities.
- Added monthly interest, minimum payments, delinquency, default and secured-asset consequences.
- Added starter credit-card opening, purchases and extra principal paydown.
- Added insurance policies with monthly premiums and lapse behavior.
- Added vehicle assets, financing, insurance, mileage, condition, depreciation and repossession foundation.
- Added primary-home purchases, mortgages, homeowners insurance, property values and housing-market exposure.
- Added deterministic investment market state, brokerage positions, automated investing and net-worth accounting.
- Added bankruptcy records with unsecured-debt discharge and long-lived credit penalties.
- Added a dedicated interactive Money dashboard covering accounts, bills, debt, credit, investments, insurance, vehicles, property and financial history.
- Added v4 → v5 migration while preserving older v1/v2/v3 migration paths.
- Expanded deterministic regression coverage for finance, housing, investing, debt, bankruptcy and migration.

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
- Added v1/v2/v3 → v4 save migration and v4 normalization.

## v0.3.0 — Relationships & Households

- Added canonical partnership state separate from directional relationship feelings.
- Added attraction eligibility, compatibility and deterministic chemistry foundations.
- Added dating, exclusivity, cohabitation, engagement, marriage, breakup and divorce actions.
- Added autonomous NPC-to-NPC romance opportunities.
- Added household objects with housing cost, members, schedules, labor assignments and finance styles.
- Added household labor imbalance consequences.
- Added offline free-text conversation intent/tone parsing and procedural replies.
- Added romantic orientation to character creation and migrated NPC romantic profiles.
- Added negotiated family planning, pregnancy, children, parenting, blended-family and custody foundations.
- Added v1/v2 → v3 save migrations and GitHub Actions CI.

## v0.2.0 — Human Simulation Core

- Added multidimensional human values, needs, health state and mood.
- Added habits, competing goals, Tier 1/2/3 NPC simulation, autonomous NPC decisions, directional relationships, memories, secrets and person-specific knowledge.
- Added v1 → v2 save migration.
