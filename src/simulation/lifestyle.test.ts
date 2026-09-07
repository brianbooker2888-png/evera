import { describe, expect, it } from 'vitest';
import { createWorld } from './createWorld';
import { stepWorld } from './engine';
import { adoptPet, buyDevice, dineOut, improveHome, planTravel, practiceHobby, serviceVehicle, setFoodStrategy, subscribeHouseholdService } from './lifestyleEngine';
import { buyVehicle } from './financeEngine';
import { initializeLifestyle } from './lifestyleSeed';

const draft={firstName:'Lifestyle',lastName:'Test',age:31,sex:'male' as const,orientation:'straight' as const,hometown:'Phoenix, Arizona',socioeconomicBackground:'stable' as const,ambition:70,discipline:68,empathy:64,athleticism:61};
function addDays(date:string,days:number){const d=new Date(`${date}T12:00:00Z`);d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10);}

describe('Phase 11 lifestyle and daily life',()=>{
  it('keeps Phase 11 lifestyle state inside schema v11 worlds',()=>{
    const world=createWorld(draft,11001);
    expect(world.version).toBe(11);
    expect(world.lifestyleProfiles.some(p=>p.personId===world.character.id)).toBe(true);
    expect(world.homeLifestyles.length).toBeGreaterThan(0);
    expect(world.wardrobeItems.length).toBeGreaterThan(0);
    expect(world.deviceAssets.length).toBeGreaterThan(0);
    expect(world.hobbies.length).toBeGreaterThan(0);
  });

  it('changes grocery economics when food strategy changes',()=>{
    let world=createWorld(draft,11002);
    world=setFoodStrategy(world,'premium');world=stepWorld(world,1);
    const premium=world.recurringObligations.find(o=>o.category==='Groceries'&&o.active)!.amount;
    world=setFoodStrategy(world,'budget');world=stepWorld(world,1);
    const budget=world.recurringObligations.find(o=>o.category==='Groceries'&&o.active)!.amount;
    expect(premium).toBeGreaterThan(budget);
  });

  it('turns home upgrades into canonical spending and comfort',()=>{
    const base=createWorld(draft,11003),home=base.homeLifestyles[0]!,cash=base.character.cash;
    const world=improveHome(base,'furniture');
    expect(world.homeUpgrades).toHaveLength(1);
    expect(world.homeLifestyles[0]!.comfort).toBeGreaterThan(home.comfort);
    expect(world.character.cash).toBeLessThan(cash);
  });

  it('supports hobbies, social outings, household services and devices',()=>{
    let world=createWorld(draft,11004),hobby=world.hobbies[0]!;
    const before=hobby.skill;world=practiceHobby(world,hobby.id);expect(world.hobbies.find(h=>h.id===hobby.id)!.skill).toBeGreaterThan(before);
    world=dineOut(world,['npc-friend']);expect(world.lifestyleOutings.length).toBeGreaterThan(0);
    world=subscribeHouseholdService(world,'cleaning');expect(world.householdServices.some(s=>s.kind==='cleaning'&&s.active)).toBe(true);
    world=buyDevice(world,'tablet');expect(world.deviceAssets.some(d=>d.kind==='tablet'&&d.status==='active')).toBe(true);
  });

  it('adopts a persistent pet and charges ongoing care',()=>{
    let world=createWorld(draft,11005);world=adoptPet(world,'dog','Milo');
    const pet=world.pets.find(p=>p.name==='Milo')!;expect(pet.status).toBe('alive');
    world.date=`${world.date.slice(0,8)}28`;world=stepWorld(world,5);
    expect(world.ledger.some(l=>l.description==='Milo care')).toBe(true);
  });

  it('plans travel, pays at departure, and creates a completed milestone',()=>{
    let world=createWorld({...draft,socioeconomicBackground:'affluent'},11006),start=addDays(world.date,1);
    world=planTravel(world,'San Diego, California',start,3,['npc-friend'],'standard','vacation');
    world=stepWorld(world,3);
    const trip=world.travelPlans[0]!;expect(['active','completed']).toContain(trip.status);
    world=stepWorld(world,1);expect(world.travelPlans[0]!.status).toBe('completed');
    expect(world.lifestyleMilestones.some(m=>m.category==='travel')).toBe(true);
  });

  it('adds vehicle-use state and lets maintenance restore reliability',()=>{
    let world=buyVehicle(createWorld({...draft,socioeconomicBackground:'affluent'},11007),'suv',32000,5000);
    world=initializeLifestyle(world);const vehicle=world.vehicles[0]!,use=world.vehicleUseProfiles.find(p=>p.vehicleId===vehicle.id)!;
    use.reliability=40;vehicle.condition=45;const before=use.reliability;
    world=serviceVehicle(world,vehicle.id);expect(world.vehicleUseProfiles.find(p=>p.vehicleId===vehicle.id)!.reliability).toBeGreaterThan(before);
  });

  it('keeps long-horizon lifestyle simulation deterministic',()=>{
    const a=stepWorld(createWorld(draft,11008),365),b=stepWorld(createWorld(draft,11008),365);
    expect(a.lifestyleProfiles).toEqual(b.lifestyleProfiles);
    expect(a.homeLifestyles).toEqual(b.homeLifestyles);
    expect(a.deviceAssets).toEqual(b.deviceAssets);
    expect(a.lifestyleMilestones).toEqual(b.lifestyleMilestones);
  });
});
