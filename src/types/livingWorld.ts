export type HealthcareModel='private_insurance'|'mixed_public'|'universal';
export type ResidencyKind='citizen'|'permanent_resident'|'work_visa'|'student_visa'|'visitor';
export type InstitutionKind='school'|'university'|'hospital'|'community'|'transit'|'entertainment';
export type WorldShockKind='recession'|'housing_boom'|'housing_correction'|'disaster'|'pandemic'|'supply_disruption'|'labor_shortage'|'technology_shift'|'strike';

export interface CountryProfile{id:string;name:string;currency:string;taxRate:number;healthcareModel:HealthcareModel;educationIndex:number;laborProtection:number;benefitGenerosity:number;retirementAge:number;immigrationOpenness:number;costIndex:number;}
export interface CityProfile{id:string;countryId:string;name:string;region:string;population:number;wageIndex:number;housingIndex:number;unemploymentRate:number;transit:number;safety:number;schoolQuality:number;healthcareAccess:number;nightlife:number;culture:number;industryIds:string[];growthRate:number;}
export interface NeighborhoodProfile{id:string;cityId:string;name:string;housingCostIndex:number;safety:number;schoolQuality:number;transit:number;prestige:number;density:number;}
export interface IndustryState{id:string;name:string;demandIndex:number;wageIndex:number;automationPressure:number;growth:number;cityIds:string[];lastUpdatedDate:string;}
export interface WorldInstitution{id:string;cityId:string;kind:InstitutionKind;name:string;quality:number;capacity:number;reputation:number;status:'open'|'strained'|'closed';lastUpdatedDate:string;}
export interface CompanyWorldState{id:string;employerId:string;cityIds:string[];health:number;growth:number;headcountIndex:number;status:'growing'|'stable'|'contracting'|'failed'|'acquired';lastUpdatedDate:string;}
export interface PolicyState{id:string;countryId:string;kind:'tax'|'healthcare'|'education'|'labor'|'housing'|'immigration'|'retirement';name:string;value:number;effectiveDate:string;}
export interface ResidencyRecord{id:string;personId:string;countryId:string;kind:ResidencyKind;startDate:string;endDate:string|null;}
export interface RegionalShock{id:string;kind:WorldShockKind;locationType:'country'|'city'|'global';locationId:string;startDate:string;endDate:string|null;severity:number;economicImpact:number;housingImpact:number;employmentImpact:number;infrastructureImpact:number;status:'active'|'recovering'|'resolved';}
export interface WorldNewsItem{id:string;date:string;scope:'local'|'national'|'global'|'business'|'technology'|'culture';locationId:string|null;title:string;summary:string;sourceId:string;importance:number;}
export interface WorldHistoryRecord{id:string;date:string;kind:WorldShockKind|'policy'|'company'|'migration'|'institution';locationId:string|null;title:string;summary:string;importance:number;}
export interface MigrationRecord{id:string;personId:string;fromCityId:string|null;toCityId:string;date:string;cost:number;reason:'player_choice'|'career'|'family'|'education'|'displacement';}
export interface LivingWorldState{countries:CountryProfile[];cities:CityProfile[];neighborhoods:NeighborhoodProfile[];industries:IndustryState[];worldInstitutions:WorldInstitution[];companyWorldStates:CompanyWorldState[];policies:PolicyState[];residencyRecords:ResidencyRecord[];regionalShocks:RegionalShock[];worldNews:WorldNewsItem[];worldHistory:WorldHistoryRecord[];migrationRecords:MigrationRecord[];currentCityId:string;currentNeighborhoodId:string|null;}
