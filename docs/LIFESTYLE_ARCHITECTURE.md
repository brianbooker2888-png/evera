# Lifestyle Architecture

## Boundary

Phase 11 adds the day-to-day layer between the existing household, finance, health, relationship and world systems.

Lifestyle does not become a second money engine. Finance remains authoritative for cash, bills, debts, vehicles and property. Lifestyle references those assets and creates causes for spending, time use, comfort, relationships and memories.

## Canonical state

- `LifestyleProfile`: food, cooking, family meals, style, grooming, social spending, convenience, travel interest, home pride and time pressure.
- `HomeLifestyle`: bedrooms/bathrooms, comfort, organization, furnishing quality, maintenance, privacy and space pressure for a household.
- `HomeUpgrade`: persistent household improvements with cost, condition and comfort impact.
- `VehicleUseProfile`: practicality, reliability, commute fit, service interval and breakdown history layered around canonical vehicle assets.
- `WardrobeItem`: category, quality and condition. Outfit selection remains contextual/automatic.
- `HobbyRecord`: persistent skill, enjoyment, social potential and ongoing cost.
- `PetRecord`: household membership, age, health, training, individual attachment and mortality.
- `TravelPlan`: travelers, destination, dates, lodging, purpose, budget, spend and satisfaction.
- `HouseholdService`: money-for-time services such as cleaning and childcare.
- `DeviceAsset`: phones/computers/etc. with condition and capability.
- `CalendarCommitment`: dated commitments used for time-conflict detection.
- `LifestyleMilestone`: durable home/travel/pet/hobby/style/technology history.

## Simulation rules

- Deep state is automatic. The player is only prompted when a choice is meaningful.
- Household crowding can create autonomy/stress consequences.
- Grocery economics respond to food strategy and household size.
- Services reduce time pressure only when the household can actually pay.
- Travel charges canonical checking at departure and can be cancelled by insufficient funds.
- Vehicle and device condition decline gradually; failure is probabilistic and deterministic from the world seed/date.
- Pets age in world time and can die without being treated as disposable inventory.
- Hobbies build gradually and may intersect with health/social systems.
- Lifestyle milestones feed the same historical record as other major life events.

## Offline guarantee

No Phase 11 gameplay requires cloud services, external APIs or AI. Location-rich travel data can be expanded later, but the core lifestyle simulation remains deterministic and fully offline.
