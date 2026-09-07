export type ConditionKind='acute'|'chronic'|'mental'|'injury';
export type ConditionStatus='active'|'managed'|'resolved';
export type DiagnosisStatus='suspected'|'diagnosed';

export interface HealthProfile{
  personId:string;
  preventiveAdherence:number;
  nutritionQuality:number;
  sleepQuality:number;
  substanceRisk:number;
  chronicRisk:number;
  accidentRisk:number;
  careAccess:number;
  deductibleSpentYear:number;
  deductibleYear:number;
  lastPreventiveDate:string|null;
  lastUpdatedDate:string;
}

export interface MedicalCondition{
  id:string;
  personId:string;
  name:string;
  kind:ConditionKind;
  severity:number;
  diagnosisStatus:DiagnosisStatus;
  status:ConditionStatus;
  onsetDate:string;
  diagnosedDate:string|null;
  resolvedDate:string|null;
  recurrenceRisk:number;
  symptomSummary:string;
  treatmentSummary:string|null;
}

export type EncounterKind='preventive'|'primary_care'|'urgent_care'|'emergency'|'specialist'|'therapy';
export interface MedicalEncounter{
  id:string;
  personId:string;
  date:string;
  kind:EncounterKind;
  provider:string;
  reason:string;
  conditionIds:string[];
  grossCost:number;
  insurancePaid:number;
  patientResponsibility:number;
  paidNow:number;
  outcome:string;
}

export interface MedicalBill{
  id:string;
  personId:string;
  encounterId:string;
  originalAmount:number;
  balance:number;
  openedDate:string;
  status:'current'|'past_due'|'paid';
  missedMonths:number;
}

export interface MedicationRecord{
  id:string;
  personId:string;
  conditionId:string;
  name:string;
  monthlyCost:number;
  effectiveness:number;
  adherence:number;
  startDate:string;
  endDate:string|null;
  active:boolean;
}

export interface HealthWorldState{
  healthProfiles:HealthProfile[];
  medicalConditions:MedicalCondition[];
  medicalEncounters:MedicalEncounter[];
  medicalBills:MedicalBill[];
  medications:MedicationRecord[];
}
