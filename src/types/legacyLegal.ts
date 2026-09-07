export type DeathCause='natural_age'|'illness'|'injury'|'accident'|'other';
export interface DeathRecord{ id:string; personId:string; date:string; age:number; cause:DeathCause; summary:string; unexpected:boolean; }
export interface FuneralRecord{ id:string; decedentId:string; date:string; cost:number; paidFromEstate:number; attendeeIds:string[]; summary:string; }
export interface EstateBeneficiary{ personId:string; share:number; }
export interface EstatePlan{ id:string; personId:string; hasWill:boolean; executorId:string|null; beneficiaries:EstateBeneficiary[]; createdDate:string; lastUpdatedDate:string; }
export interface EstateDistribution{ personId:string; amount:number; }
export interface EstateCase{ id:string; decedentId:string; openedDate:string; closedDate:string|null; status:'open'|'settled'; grossAssets:number; liabilitiesPaid:number; funeralCost:number; lifeInsuranceProceeds:number; netEstate:number; distributions:EstateDistribution[]; }
export interface AncestorArchive{ id:string; personId:string; name:string; birthDate:string; deathDate:string; ageAtDeath:number; career:string; location:string; netWorthAtDeath:number; childIds:string[]; summary:string; }
export interface ControlTransition{ id:string; fromPersonId:string; toPersonId:string; date:string; reason:'death_continuation'; inheritedAmount:number; }

export type OffenseKind='theft'|'fraud'|'assault'|'impaired_driving'|'property_offense';
export interface CrimeIncident{ id:string; actorId:string; date:string; offense:OffenseKind; severity:number; discovered:boolean; evidenceStrength:number; victimId:string|null; status:'undiscovered'|'investigating'|'charged'|'closed'; }
export interface CriminalCase{ id:string; defendantId:string; incidentId:string; filedDate:string; status:'charged'|'plea'|'trial'|'dismissed'|'convicted'|'acquitted'|'closed'; representation:'public_defender'|'private_attorney'|'self'; legalCost:number; outcomeDate:string|null; sentenceSummary:string|null; }
export interface CriminalRecord{ id:string; personId:string; caseId:string; offense:OffenseKind; convictionDate:string; severity:number; active:boolean; }
export interface CivilCase{ id:string; plaintiffId:string; defendantId:string; filedDate:string; category:'injury'|'contract'|'property'|'employment'|'estate'|'family'; amountClaimed:number; status:'filed'|'negotiating'|'settled'|'trial'|'judgment'|'dismissed'; outcomeDate:string|null; amountAwarded:number; legalCost:number; }

export interface LegacyLegalWorldState{
  deathRecords:DeathRecord[];
  funeralRecords:FuneralRecord[];
  estatePlans:EstatePlan[];
  estateCases:EstateCase[];
  ancestorArchives:AncestorArchive[];
  controlTransitions:ControlTransition[];
  crimeIncidents:CrimeIncident[];
  criminalCases:CriminalCase[];
  criminalRecords:CriminalRecord[];
  civilCases:CivilCase[];
}
