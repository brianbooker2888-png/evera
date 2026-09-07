import { describe, expect, it } from 'vitest';
import { createWorld } from './createWorld';
import { stepWorld } from './engine';
import { currentCity, currentCountry, moveToCity } from './livingWorldEngine';
import { migrateWorld } from '../persistence/migrate';

const draft={firstName:'World',lastName:'Test',age:30,sex:'male' as const,orientation:'straight' as const,hometown:'Phoenix, Arizona',socioeconomicBackground:'stable' as const,ambition:72,discipline:68,empathy:64,athleticism:58};

describe('Phase 12 deeper living world',()=>{
  it('creates a true v11 world with causal geography and institutions',()=>{
    const world=createWorld(draft,12001);
    expect(world.version).toBe(11);
    expect(world.countries.length).toBeGreaterThanOrEqual(4);
    expect(world.cities.length).toBeGreaterThanOrEqual(9);
    expect(world.neighborhoods.some(n=>n.cityId===world.currentCityId)).toBe(true);
    expect(world.industries.length).toBeGreaterThan(4);
    expect(world.worldInstitutions.some(i=>i.cityId===world.currentCityId&&i.kind==='hospital')).toBe(true);
    expect(world.policies.some(p=>p.countryId==='country-us'&&p.kind==='tax')).toBe(true);
    expect(currentCity(world)?.name).toBe('Phoenix');
    expect(currentCountry(world)?.name).toBe('United States');
  });

  it('preserves distinct unknown hometowns through deterministic custom-city fallback',()=>{
    const flagstaff=createWorld({...draft,hometown:'Flagstaff, Arizona'},12002);
    expect(currentCity(flagstaff)?.name).toBe('Flagstaff');
    expect(flagstaff.character.location).toContain('Flagstaff');
    const boise=createWorld({...draft,hometown:'Boise, Idaho'},12003);
    expect(currentCity(boise)?.name).toBe('Boise');
    expect(boise.character.location).toContain('Boise');
  });

  it('keeps multi-year world evolution deterministic',()=>{
    const a=stepWorld(createWorld(draft,12004),365),b=stepWorld(createWorld(draft,12004),365);
    expect(a.cities).toEqual(b.cities);
    expect(a.industries).toEqual(b.industries);
    expect(a.companyWorldStates).toEqual(b.companyWorldStates);
    expect(a.regionalShocks).toEqual(b.regionalShocks);
    expect(a.worldNews).toEqual(b.worldNews);
  });

  it('makes domestic relocation change housing, labor context and an incompatible onsite job',()=>{
    const base=createWorld(draft,12005),before=base.financialAccounts.find(a=>a.id==='account-checking-player')!.balance;
    const moved=moveToCity(base,'city-seattle','neighborhood-city-seattle-family'),home=moved.households.find(h=>!h.endedDate&&h.memberIds.includes(moved.character.id))!;
    expect(moved.currentCityId).toBe('city-seattle');
    expect(moved.character.location).toContain('Seattle');
    expect(moved.financialAccounts.find(a=>a.id==='account-checking-player')!.balance).toBeLessThan(before);
    expect(home.monthlyHousingCost).toBeGreaterThan(1450);
    expect(moved.laborMarket.wageIndex).toBeGreaterThan(1);
    expect(moved.employments.find(e=>e.personId===moved.character.id&&e.status==='active')).toBeUndefined();
    expect(moved.migrationRecords[0]?.toCityId).toBe('city-seattle');
    expect(moved.worldHistory.some(h=>h.kind==='migration'&&h.locationId==='city-seattle')).toBe(true);
  });

  it('creates a new residency record when crossing countries',()=>{
    const base=createWorld({...draft,socioeconomicBackground:'affluent'},12006),moved=moveToCity(base,'city-toronto','neighborhood-city-toronto-family');
    expect(moved.currentCityId).toBe('city-toronto');
    expect(moved.residencyRecords.some(r=>r.personId===moved.character.id&&r.countryId==='country-ca'&&r.endDate===null)).toBe(true);
    expect(moved.residencyRecords.find(r=>r.countryId==='country-us')?.endDate).toBe(moved.date);
  });

  it('changes payroll withholding when the controlled life moves countries',()=>{
    let us=createWorld({...draft,socioeconomicBackground:'affluent'},12008);const usJob=us.employments.find(e=>e.personId===us.character.id&&e.status==='active')!;usJob.remote='remote';us=stepWorld(us,14);const usTax=Math.abs(us.ledger.find(l=>l.category==='Tax')?.amount??0);
    let ca=createWorld({...draft,socioeconomicBackground:'affluent'},12008);const caJob=ca.employments.find(e=>e.personId===ca.character.id&&e.status==='active')!;caJob.remote='remote';ca=moveToCity(ca,'city-toronto','neighborhood-city-toronto-family');ca=stepWorld(ca,14);const caTax=Math.abs(ca.ledger.find(l=>l.category==='Tax')?.amount??0);
    expect(usTax).toBeGreaterThan(0);expect(caTax).toBeGreaterThan(usTax);
  });

  it('lets country and city healthcare context affect care access',()=>{
    let us=createWorld({...draft,socioeconomicBackground:'stable'},12009),ca=createWorld({...draft,socioeconomicBackground:'affluent'},12009);const before=us.healthProfiles.find(p=>p.personId===us.character.id)!.careAccess;ca=moveToCity(ca,'city-toronto','neighborhood-city-toronto-family');ca=stepWorld(ca,30);us=stepWorld(us,30);expect(ca.healthProfiles.find(p=>p.personId===ca.character.id)!.careAccess).toBeGreaterThan(before);expect(ca.healthProfiles.find(p=>p.personId===ca.character.id)!.careAccess).toBeGreaterThan(us.healthProfiles.find(p=>p.personId===us.character.id)!.careAccess);
  });

  it('migrates a true v10 save into v11 without losing Phase 11 history',()=>{
    const current=createWorld(draft,12007);
    const {countries,cities,neighborhoods,industries,worldInstitutions,companyWorldStates,policies,residencyRecords,regionalShocks,worldNews,worldHistory,migrationRecords,currentCityId,currentNeighborhoodId,...v10}=current;
    void countries;void cities;void neighborhoods;void industries;void worldInstitutions;void companyWorldStates;void policies;void residencyRecords;void regionalShocks;void worldNews;void worldHistory;void migrationRecords;void currentCityId;void currentNeighborhoodId;
    const migrated=migrateWorld({...v10,version:10});
    expect(migrated?.version).toBe(11);
    expect(migrated?.lifestyleProfiles.length).toBe(current.lifestyleProfiles.length);
    expect(migrated?.countries.length).toBeGreaterThan(0);
    expect(migrated?.currentCityId).toBeTruthy();
    expect(migrated?.homeLifestyles.length).toBe(current.homeLifestyles.length);
  });
});
