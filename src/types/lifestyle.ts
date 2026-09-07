export type FoodStrategy='budget'|'standard'|'healthy'|'premium'|'convenience';
export type StyleIdentity='practical'|'classic'|'sporty'|'fashion_forward'|'luxury';
export type HomeUpgradeKind='furniture'|'appliance'|'decor'|'office'|'fitness'|'entertainment'|'child_space';
export type HobbyKind='fitness'|'gaming'|'music'|'art'|'cooking'|'reading'|'outdoors'|'community'|'photography'|'sports';
export type PetSpecies='dog'|'cat'|'bird'|'small_pet';
export type TravelStatus='planned'|'active'|'completed'|'cancelled';
export type ServiceKind='cleaning'|'childcare'|'meal_service'|'landscaping'|'assistant'|'pet_care';
export type DeviceKind='phone'|'computer'|'tablet'|'tv'|'game_console';

export interface LifestyleProfile{
  personId:string;
  foodStrategy:FoodStrategy;
  cookingSkill:number;
  familyMealFrequency:number;
  styleIdentity:StyleIdentity;
  grooming:number;
  wardrobeQuality:number;
  socialSpending:number;
  conveniencePreference:number;
  travelInterest:number;
  homePride:number;
  timePressure:number;
  lastUpdatedDate:string;
}

export interface HomeLifestyle{
  householdId:string;
  bedrooms:number;
  bathrooms:number;
  comfort:number;
  organization:number;
  furnishingQuality:number;
  maintenance:number;
  privacy:number;
  spacePressure:number;
  upgradeIds:string[];
  lastMaintenanceDate:string;
}
export interface HomeUpgrade{
  id:string;
  householdId:string;
  kind:HomeUpgradeKind;
  name:string;
  purchaseDate:string;
  purchaseCost:number;
  condition:number;
  comfortImpact:number;
  active:boolean;
}
export interface VehicleUseProfile{
  vehicleId:string;
  practicality:number;
  reliability:number;
  customization:number;
  commuteFit:number;
  chargingOrFuelConvenience:number;
  lastServiceDate:string;
  nextServiceMileage:number;
  breakdowns:number;
}
export interface WardrobeItem{
  id:string;
  ownerId:string;
  category:'casual'|'work'|'formal'|'athletic'|'nightlife'|'seasonal';
  quality:number;
  condition:number;
  purchaseDate:string;
  cost:number;
}
export interface HobbyRecord{
  id:string;
  personId:string;
  kind:HobbyKind;
  name:string;
  skill:number;
  enjoyment:number;
  socialPotential:number;
  monthlyCost:number;
  lastPracticedDate:string|null;
  active:boolean;
}
export interface PetRecord{
  id:string;
  householdId:string;
  name:string;
  species:PetSpecies;
  birthDate:string;
  adoptedDate:string;
  health:number;
  training:number;
  attachmentByPerson:Record<string,number>;
  monthlyCost:number;
  status:'alive'|'deceased'|'rehomed';
  deathDate:string|null;
}
export interface TravelPlan{
  id:string;
  travelerIds:string[];
  origin:string;
  destination:string;
  startDate:string;
  endDate:string;
  lodging:'budget'|'standard'|'premium'|'luxury';
  purpose:'vacation'|'family'|'romantic'|'business'|'sports';
  budget:number;
  spent:number;
  status:TravelStatus;
  satisfaction:number|null;
}
export interface LifestyleOuting{
  id:string;
  date:string;
  personIds:string[];
  kind:'restaurant'|'date'|'family_meal'|'nightlife'|'community'|'entertainment'|'outdoors';
  venue:string;
  cost:number;
  satisfaction:number;
}
export interface HouseholdService{
  id:string;
  householdId:string;
  kind:ServiceKind;
  providerName:string;
  monthlyCost:number;
  timeSavedHours:number;
  active:boolean;
  startedDate:string;
}
export interface DeviceAsset{
  id:string;
  ownerId:string;
  kind:DeviceKind;
  name:string;
  purchaseDate:string;
  purchasePrice:number;
  condition:number;
  capability:number;
  status:'active'|'broken'|'replaced';
}
export interface CalendarCommitment{
  id:string;
  householdId:string|null;
  personId:string;
  date:string;
  startHour:number;
  endHour:number;
  label:string;
  category:'work'|'school'|'childcare'|'sports'|'health'|'social'|'travel'|'household';
  priority:number;
  status:'planned'|'completed'|'missed'|'cancelled';
}
export interface LifestyleMilestone{
  id:string;
  personId:string;
  date:string;
  category:'home'|'vehicle'|'travel'|'pet'|'hobby'|'style'|'technology'|'family';
  title:string;
  summary:string;
  significance:number;
}
export interface LifestyleWorldState{
  lifestyleProfiles:LifestyleProfile[];
  homeLifestyles:HomeLifestyle[];
  homeUpgrades:HomeUpgrade[];
  vehicleUseProfiles:VehicleUseProfile[];
  wardrobeItems:WardrobeItem[];
  hobbies:HobbyRecord[];
  pets:PetRecord[];
  travelPlans:TravelPlan[];
  lifestyleOutings:LifestyleOuting[];
  householdServices:HouseholdService[];
  deviceAssets:DeviceAsset[];
  calendarCommitments:CalendarCommitment[];
  lifestyleMilestones:LifestyleMilestone[];
}
