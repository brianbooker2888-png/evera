export type FinancialAccountType='checking'|'savings'|'investment'|'retirement';
export interface FinancialAccount{ id:string; ownerIds:string[]; institution:string; name:string; type:FinancialAccountType; balance:number; apy:number; status:'open'|'closed'; openedDate:string; }

export type ObligationFrequency='weekly'|'monthly'|'annual';
export interface RecurringObligation{ id:string; ownerId:string|null; householdId:string|null; name:string; category:'Housing'|'Utilities'|'Groceries'|'Childcare'|'Transportation'|'Insurance'|'Debt'|'Subscription'|'Other'; amount:number; frequency:ObligationFrequency; dueDay:number; autopay:boolean; essential:boolean; active:boolean; nextDueDate:string; pastDueAmount:number; missedPayments:number; }
export interface BudgetRule{ id:string; householdId:string; category:string; monthlyLimit:number; }
export interface HouseholdFinancePlan{ householdId:string; emergencyFundTargetMonths:number; savingsRate:number; investmentRate:number; debtStrategy:'minimums'|'highest_apr'|'lowest_balance'; }

export interface CreditProfile{ personId:string; score:number; paymentHistory:number; utilization:number; averageAgeMonths:number; inquiries:number; derogatoryMarks:number; lastUpdatedDate:string; }
export type LiabilityKind='credit_card'|'student'|'auto'|'mortgage'|'personal';
export interface Liability{ id:string; borrowerIds:string[]; lender:string; kind:LiabilityKind; principal:number; apr:number; minimumPayment:number; creditLimit:number|null; dueDay:number; status:'current'|'delinquent'|'default'|'paid'; missedPayments:number; openedDate:string; termMonths:number|null; securedAssetId:string|null; }

export type InsuranceKind='health'|'auto'|'renters'|'homeowners'|'life'|'disability';
export interface InsurancePolicy{ id:string; ownerIds:string[]; kind:InsuranceKind; provider:string; premiumMonthly:number; deductible:number; coverageLimit:number; active:boolean; }

export interface PropertyAsset{ id:string; ownerIds:string[]; kind:'primary_home'|'rental'; location:string; description:string; purchaseDate:string; purchasePrice:number; marketValue:number; mortgageLiabilityId:string|null; propertyTaxAnnual:number; hoaMonthly:number; condition:number; status:'owned'|'sold'; }
export interface VehicleAsset{ id:string; ownerIds:string[]; kind:'economy'|'sedan'|'suv'|'truck'|'ev'|'sports'|'luxury'|'van'; description:string; purchaseDate:string; purchasePrice:number; marketValue:number; mileage:number; condition:number; fuelType:'gas'|'hybrid'|'electric'; financingLiabilityId:string|null; status:'owned'|'sold'|'repossessed'; }

export type InvestmentAssetClass='us_equity'|'international_equity'|'bond'|'cash';
export interface InvestmentPosition{ id:string; accountId:string; assetClass:InvestmentAssetClass; units:number; price:number; costBasis:number; }
export interface MarketState{ usEquityIndex:number; internationalEquityIndex:number; bondIndex:number; volatility:number; regime:'bull'|'neutral'|'bear'; lastUpdatedDate:string; }

export interface BankruptcyRecord{ id:string; personId:string; filedDate:string; chapter:'liquidation'|'reorganization'; dischargedLiabilityIds:string[]; status:'filed'|'discharged'; creditPenaltyUntil:string; }

export interface FinanceWorldState{
  financialAccounts:FinancialAccount[];
  recurringObligations:RecurringObligation[];
  budgetRules:BudgetRule[];
  householdFinancePlans:HouseholdFinancePlan[];
  creditProfiles:CreditProfile[];
  liabilities:Liability[];
  insurancePolicies:InsurancePolicy[];
  properties:PropertyAsset[];
  vehicles:VehicleAsset[];
  investmentPositions:InvestmentPosition[];
  bankruptcyRecords:BankruptcyRecord[];
  market:MarketState;
}
