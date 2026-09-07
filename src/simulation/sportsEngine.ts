import type { LifeEvent, WorldState } from '../types/game';
import type { AthleteProfile, CoachProfile, MatchMoment, SportKind, SportsFixture, SportsLeague, SportsSeasonStat, SportsTeam } from '../types/sports';
import { SeededRng } from './rng';
import { deriveSeed } from './humanEngine';
import { ageAt } from './familyEngine';
import { initializeSports } from './sportsSeed';

const clamp=(v:number,min=0,max=100)=>Math.max(min,Math.min(max,v));
const addYears=(date:string,years:number)=>{const d=new Date(`${date}T12:00:00Z`);d.setUTCFullYear(d.getUTCFullYear()+years);return d.toISOString().slice(0,10);};
const daysBetween=(a:string,b:string)=>Math.round((new Date(`${b}T12:00:00Z`).getTime()-new Date(`${a}T12:00:00Z`).getTime())/86_400_000);
const playerAge=(world:WorldState)=>ageAt(world.character.birthDate,world.date);
const playerName=(world:WorldState)=>`${world.character.firstName} ${world.character.lastName}`;

function leagueForPlayer(world:WorldState,sport:SportKind){
  const age=playerAge(world);
  if(sport==='soccer')return world.sportsLeagues.find(l=>l.sport===sport&&l.tier===(age<18?'youth':'professional'));
  const tier=age<18?'youth':age<=22?'college':'professional';
  return world.sportsLeagues.find(l=>l.sport===sport&&l.tier===tier);
}
function athleteRating(world:WorldState,sport:SportKind){
  const a=world.character.athleticism,t=world.character.traits;
  const physical=(a.speed+a.strength+a.endurance+a.agility+a.coordination+a.reaction)/6;
  return Math.round(clamp(physical*.68+t.discipline*.13+t.confidence*.09+t.ambition*.1+(sport==='soccer'?a.coordination*.08:a.reaction*.06),30,92));
}
function chooseTeam(world:WorldState,league:SportsLeague,rating:number){
  const teams=league.teamIds.map(id=>world.sportsTeams.find(t=>t.id===id)).filter((t):t is SportsTeam=>Boolean(t)).sort((a,b)=>a.reputation-b.reputation);
  const index=rating>=80?teams.length-1:rating>=68?Math.min(2,teams.length-1):0;
  return teams[index]??teams[0];
}
function contractSalary(sport:SportKind,tier:SportsLeague['tier'],rating:number,role:'athlete'|'coach'){
  if(tier!=='professional')return 0;
  if(role==='coach')return sport==='soccer'?95_000+rating*2_200:180_000+rating*5_500;
  return sport==='soccer'?35_000+rating*2_400:450_000+rating*18_000;
}
function closeNormalEmployment(world:WorldState){
  for(const employment of world.employments.filter(e=>e.personId===world.character.id&&e.status==='active')){
    employment.status='ended';employment.endDate=world.date;
  }
}
function addSportsContract(world:WorldState,team:SportsTeam,role:'athlete'|'coach',rating:number){
  const league=world.sportsLeagues.find(l=>l.id===team.leagueId);
  if(!league)return null;
  const salary=contractSalary(team.sport,league.tier,rating,role);
  if(salary<=0)return null;
  const id=`sports-contract-${role}-${team.sport}-${world.date}`;
  world.sportsContracts.push({id,personId:world.character.id,teamId:team.id,role,salaryAnnual:salary,startDate:world.date,endDate:addYears(world.date,2),status:'active'});
  return id;
}

export function startAthletePath(input:WorldState,sport:SportKind,position:string):WorldState{
  const world=initializeSports(structuredClone(input));
  if(world.athleteProfiles.some(p=>p.personId===world.character.id&&p.sport===sport&&p.careerStatus!=='retired')||world.coachProfiles.some(c=>c.personId===world.character.id&&c.sport===sport))return world;
  if(playerAge(world)<14)return world;
  const league=leagueForPlayer(world,sport);if(!league)return world;
  const rating=athleteRating(world,sport),team=chooseTeam(world,league,rating);if(!team)return world;
  closeNormalEmployment(world);
  const profile:AthleteProfile={id:`athlete-${world.character.id}-${sport}`,personId:world.character.id,sport,position,teamId:team.id,rating,potential:Math.min(97,rating+Math.round((100-world.character.traits.discipline)*.05+12)),fitness:Math.round((world.character.energy+world.character.human.health.fitness)/2),fatigue:8,morale:70,injuryStatus:'healthy',injuryDaysRemaining:0,careerStatus:league.tier==='professional'?'professional':league.tier==='college'?'college':'amateur',contractId:null};
  profile.contractId=addSportsContract(world,team,'athlete',rating);
  world.athleteProfiles.push(profile);
  world.character.career=`${sport==='soccer'?'Soccer':'Football'} Player · ${position}`;
  world.events.unshift({id:`evt-sport-athlete-${sport}-${world.date}`,date:world.date,title:`You joined ${team.name}`,body:`Your ${sport==='soccer'?'soccer':'American football'} career is now tied to training, match performance, fitness, team results and injury risk.`,type:'opportunity',priority:'major'});
  return world;
}

export function startCoachPath(input:WorldState,sport:SportKind):WorldState{
  const world=initializeSports(structuredClone(input));
  if(playerAge(world)<22||world.coachProfiles.some(c=>c.personId===world.character.id&&c.sport===sport)||world.athleteProfiles.some(p=>p.personId===world.character.id&&p.sport===sport&&p.careerStatus!=='retired'))return world;
  const league=world.sportsLeagues.find(l=>l.sport===sport&&l.tier==='professional');if(!league)return world;
  const t=world.character.traits,rating=Math.round((t.analytical+t.emotional+t.confidence+t.ambition)/4),team=chooseTeam(world,league,Math.max(30,rating-12));if(!team)return world;
  closeNormalEmployment(world);
  const profile:CoachProfile={id:`coach-${world.character.id}-${sport}`,personId:world.character.id,sport,teamId:team.id,tactical:Math.round((t.analytical+t.creativity)/2),development:Math.round((t.empathy+t.discipline)/2),leadership:Math.round((t.confidence+t.emotional+t.ambition)/3),reputation:45,style:'balanced',contractId:null};
  profile.contractId=addSportsContract(world,team,'coach',rating);
  world.coachProfiles.push(profile);team.coachProfileId=profile.id;
  world.character.career=`${sport==='soccer'?'Soccer':'Football'} Coach`;
  world.events.unshift({id:`evt-sport-coach-${sport}-${world.date}`,date:world.date,title:`You became head coach of ${team.name}`,body:'Lineups, development, tactical choices, locker-room results and match decisions now shape your career.',type:'opportunity',priority:'major'});
  return world;
}

export type TrainingFocus='fitness'|'skills'|'recovery';
export function trainSport(input:WorldState,sport:SportKind,focus:TrainingFocus):WorldState{
  const world=structuredClone(input),profile=world.athleteProfiles.find(p=>p.personId===world.character.id&&p.sport===sport&&p.careerStatus!=='retired');
  if(!profile||profile.injuryStatus==='major')return world;
  if(focus==='recovery'){profile.fatigue=clamp(profile.fatigue-18);profile.fitness=clamp(profile.fitness+2);world.character.energy=clamp(world.character.energy+5);}
  else if(focus==='fitness'){profile.fitness=clamp(profile.fitness+1.8);profile.fatigue=clamp(profile.fatigue+8);world.character.energy=clamp(world.character.energy-7);}
  else{const gain=Math.max(.25,(profile.potential-profile.rating)/35);profile.rating=clamp(profile.rating+gain,0,profile.potential);profile.fatigue=clamp(profile.fatigue+10);world.character.energy=clamp(world.character.energy-8);}
  return world;
}
export function setCoachStyle(input:WorldState,sport:SportKind,style:CoachProfile['style']):WorldState{
  const world=structuredClone(input),coach=world.coachProfiles.find(c=>c.personId===world.character.id&&c.sport===sport);if(coach)coach.style=style;return world;
}

function participantStrength(world:WorldState,team:SportsTeam){
  const roster=team.rosterIds.map(id=>world.sportsParticipants.find(p=>p.id===id)).filter((p):p is NonNullable<typeof p>=>Boolean(p));
  const base=roster.reduce((s,p)=>s+p.rating*(p.fitness/100)*(1-p.fatigue/140),0)/Math.max(1,roster.length);
  const athlete=world.athleteProfiles.find(p=>p.teamId===team.id&&p.injuryStatus==='healthy');
  const coach=world.coachProfiles.find(c=>c.teamId===team.id);
  const athleteBoost=athlete?(athlete.rating-base)/Math.max(8,roster.length):0;
  const styleBoost=coach?(coach.tactical-50)/18+(coach.style==='aggressive'?1.2:coach.style==='conservative'?.4:0):0;
  return base+athleteBoost+styleBoost;
}
function moment(id:string,clock:number,period:number,teamId:string,type:MatchMoment['type'],description:string,importance:number,actorId:string|null=null):MatchMoment{return{id,clock,period,teamId,actorId,type,description,importance};}
function simulateSoccer(world:WorldState,fixture:SportsFixture,rng:SeededRng){
  const home=world.sportsTeams.find(t=>t.id===fixture.homeTeamId),away=world.sportsTeams.find(t=>t.id===fixture.awayTeamId);if(!home||!away)return;
  const hs=participantStrength(world,home),as=participantStrength(world,away);let h=0,a=0;const moments:MatchMoment[]=[];
  for(let i=0;i<18;i++){
    const clock=5+Math.floor(rng.next()*85),homeChance=clamp(.5+(hs-as)/120,.3,.7),team=rng.chance(homeChance)?home:away,strength=team.id===home.id?hs:as,opp=team.id===home.id?as:hs;
    moments.push(moment(`${fixture.id}-chance-${i}`,clock,clock<=45?1:2,team.id,'chance',`${team.name} created a dangerous chance.`,35));
    if(rng.chance(clamp(.12+(strength-opp)/250,.06,.24))){if(team.id===home.id)h++;else a++;moments.push(moment(`${fixture.id}-goal-${i}`,clock,clock<=45?1:2,team.id,'score',`${team.name} scored.`,88));}
  }
  fixture.homeScore=h;fixture.awayScore=a;fixture.moments=moments.sort((x,y)=>x.clock-y.clock);
}
function simulateFootball(world:WorldState,fixture:SportsFixture,rng:SeededRng){
  const home=world.sportsTeams.find(t=>t.id===fixture.homeTeamId),away=world.sportsTeams.find(t=>t.id===fixture.awayTeamId);if(!home||!away)return;
  const hs=participantStrength(world,home),as=participantStrength(world,away);let h=0,a=0;const moments:MatchMoment[]=[];
  for(let drive=0;drive<20;drive++){
    const team=drive%2===0?home:away,strength=team.id===home.id?hs:as,opp=team.id===home.id?as:hs,clock=Math.max(1,60-Math.floor(drive*3+rng.next()*3)),period=Math.min(4,Math.floor((60-clock)/15)+1);
    if(rng.chance(.16))moments.push(moment(`${fixture.id}-big-${drive}`,clock,period,team.id,'big_play',`${team.name} broke a big play into open field.`,55));
    const scoreRoll=rng.next(),tdChance=clamp(.22+(strength-opp)/180,.1,.4),fgChance=.16;
    if(scoreRoll<tdChance){if(team.id===home.id)h+=7;else a+=7;moments.push(moment(`${fixture.id}-td-${drive}`,clock,period,team.id,'score',`${team.name} scored a touchdown.`,90));}
    else if(scoreRoll<tdChance+fgChance){if(team.id===home.id)h+=3;else a+=3;moments.push(moment(`${fixture.id}-fg-${drive}`,clock,period,team.id,'score',`${team.name} converted a field goal.`,60));}
    else if(rng.chance(.13))moments.push(moment(`${fixture.id}-turn-${drive}`,clock,period,team.id,'turnover',`${team.name} turned the ball over.`,65));
  }
  fixture.homeScore=h;fixture.awayScore=a;fixture.moments=moments.sort((x,y)=>y.clock-x.clock);
}
function seasonStat(world:WorldState,sport:SportKind,year:number):SportsSeasonStat{
  let stat=world.sportsSeasonStats.find(s=>s.personId===world.character.id&&s.sport===sport&&s.seasonYear===year);
  if(!stat){stat={id:`stat-${world.character.id}-${sport}-${year}`,personId:world.character.id,sport,seasonYear:year,games:0,starts:0,minutes:0,goals:0,assists:0,saves:0,passingYards:0,rushingYards:0,receivingYards:0,touchdowns:0,tackles:0,interceptions:0,wins:0,losses:0};world.sportsSeasonStats.push(stat);}
  return stat;
}
function applyAthletePerformance(world:WorldState,fixture:SportsFixture,athlete:AthleteProfile,rng:SeededRng,events:LifeEvent[]){
  if(!athlete.teamId)return;
  const teamId=athlete.teamId,teamScore=teamId===fixture.homeTeamId?fixture.homeScore:fixture.awayScore,oppScore=teamId===fixture.homeTeamId?fixture.awayScore:fixture.homeScore,stat=seasonStat(world,fixture.sport,fixture.seasonYear);
  stat.games++;stat.starts++;stat.minutes+=fixture.sport==='soccer'?90:60;if(teamScore>oppScore)stat.wins++;else if(teamScore<oppScore)stat.losses++;
  athlete.fatigue=clamp(athlete.fatigue+16);athlete.morale=clamp(athlete.morale+(teamScore>oppScore?5:teamScore<oppScore?-3:1));
  if(fixture.sport==='soccer'){
    const attackWeight=['ST','RW','LW','AM'].includes(athlete.position)?.55:.18;
    if(teamScore>0&&rng.chance(clamp(attackWeight+athlete.rating/300,.1,.85))){stat.goals++;const scoring=fixture.moments.find(m=>m.type==='score'&&m.teamId===teamId);if(scoring){scoring.actorId=world.character.id;scoring.description=`${playerName(world)} scored for ${world.sportsTeams.find(t=>t.id===teamId)?.name??'the team'}.`;}}
    if(rng.chance(.25))stat.assists++;if(athlete.position==='GK')stat.saves+=Math.floor(2+rng.next()*6);
  }else if(athlete.position==='QB'){stat.passingYards+=Math.floor(180+rng.next()*220);stat.touchdowns+=Math.floor(rng.next()*4);}
  else if(athlete.position==='RB'){stat.rushingYards+=Math.floor(45+rng.next()*125);stat.touchdowns+=rng.chance(.55)?1:0;}
  else if(['WR','TE'].includes(athlete.position)){stat.receivingYards+=Math.floor(35+rng.next()*130);stat.touchdowns+=rng.chance(.5)?1:0;}
  else{stat.tackles+=Math.floor(2+rng.next()*9);if(rng.chance(.12))stat.interceptions++;}
  if(rng.chance(clamp(.008+athlete.fatigue/2200,.006,.06))){athlete.injuryStatus=rng.chance(.12)?'major':rng.chance(.35)?'moderate':'minor';athlete.injuryDaysRemaining=athlete.injuryStatus==='major'?45+Math.floor(rng.next()*90):athlete.injuryStatus==='moderate'?14+Math.floor(rng.next()*28):3+Math.floor(rng.next()*10);events.push({id:`evt-sport-injury-${fixture.id}`,date:fixture.date,title:'An injury interrupted your season',body:`You suffered a ${athlete.injuryStatus} injury and may miss time.`,type:'opportunity',priority:'major'});}
}
function applyCoachPerformance(world:WorldState,fixture:SportsFixture,coach:CoachProfile){
  if(!coach.teamId)return;
  const teamScore=coach.teamId===fixture.homeTeamId?fixture.homeScore:fixture.awayScore,oppScore=coach.teamId===fixture.homeTeamId?fixture.awayScore:fixture.homeScore,stat=seasonStat(world,fixture.sport,fixture.seasonYear);
  stat.games++;stat.starts++;if(teamScore>oppScore){stat.wins++;coach.reputation=clamp(coach.reputation+1.2);}else if(teamScore<oppScore){stat.losses++;coach.reputation=clamp(coach.reputation-.7);}
  coach.tactical=clamp(coach.tactical+.08);
}
function updateStandings(world:WorldState,fixture:SportsFixture){
  const home=world.sportsTeams.find(t=>t.id===fixture.homeTeamId),away=world.sportsTeams.find(t=>t.id===fixture.awayTeamId);if(!home||!away)return;
  home.pointsFor+=fixture.homeScore;home.pointsAgainst+=fixture.awayScore;away.pointsFor+=fixture.awayScore;away.pointsAgainst+=fixture.homeScore;
  if(fixture.homeScore>fixture.awayScore){home.wins++;away.losses++;}else if(fixture.awayScore>fixture.homeScore){away.wins++;home.losses++;}else{home.draws++;away.draws++;}
}
function processContracts(world:WorldState,date:string){
  for(const contract of world.sportsContracts.filter(c=>c.personId===world.character.id&&c.status==='active')){
    if(contract.endDate<date){contract.status='ended';continue;}
    const elapsed=daysBetween(contract.startDate,date);if(elapsed<=0||elapsed%14!==0)continue;
    const amount=Math.round(contract.salaryAnnual/26),checking=world.financialAccounts.find(a=>a.id==='account-checking-player');
    if(checking){checking.balance+=amount;world.character.cash=checking.balance;}else world.character.cash+=amount;
    world.ledger.unshift({id:`sports-pay-${contract.id}-${date}`,date,description:'Sports contract payroll',amount,category:'Income'});
  }
}
function recoverAthletes(world:WorldState){
  for(const profile of world.athleteProfiles){profile.fatigue=clamp(profile.fatigue-2.3);profile.fitness=clamp(profile.fitness+(profile.fatigue<25?.12:-.05));if(profile.injuryDaysRemaining>0){profile.injuryDaysRemaining--;if(profile.injuryDaysRemaining===0)profile.injuryStatus='healthy';}}
}
function rollSeasonCounters(world:WorldState,date:string){
  const year=Number(date.slice(0,4));if(Number(date.slice(5,7))!==1||Number(date.slice(-2))!==1)return;
  for(const league of world.sportsLeagues.filter(l=>l.seasonYear<year)){league.seasonYear=year;for(const id of league.teamIds){const team=world.sportsTeams.find(t=>t.id===id);if(team){team.wins=0;team.losses=0;team.draws=0;team.pointsFor=0;team.pointsAgainst=0;}}}
}

export function simulateSports(world:WorldState,date:string,rng:SeededRng):LifeEvent[]{
  initializeSports(world);const events:LifeEvent[]=[];recoverAthletes(world);rollSeasonCounters(world,date);
  for(const fixture of world.sportsFixtures.filter(f=>f.status==='scheduled'&&f.date<=date)){
    const matchRng=new SeededRng(deriveSeed(world.seed,`fixture:${fixture.id}`));
    if(fixture.sport==='soccer')simulateSoccer(world,fixture,matchRng);else simulateFootball(world,fixture,matchRng);
    fixture.status='complete';updateStandings(world,fixture);
    const athlete=world.athleteProfiles.find(p=>p.personId===world.character.id&&p.sport===fixture.sport&&p.teamId!==null&&[fixture.homeTeamId,fixture.awayTeamId].includes(p.teamId));
    const coach=world.coachProfiles.find(c=>c.personId===world.character.id&&c.sport===fixture.sport&&c.teamId!==null&&[fixture.homeTeamId,fixture.awayTeamId].includes(c.teamId));
    if(athlete)applyAthletePerformance(world,fixture,athlete,matchRng,events);
    if(coach)applyCoachPerformance(world,fixture,coach);
    if(athlete||coach){const home=world.sportsTeams.find(t=>t.id===fixture.homeTeamId),away=world.sportsTeams.find(t=>t.id===fixture.awayTeamId);if(home&&away)events.push({id:`evt-match-${fixture.id}`,date,title:`${home.name} ${fixture.homeScore} – ${fixture.awayScore} ${away.name}`,body:`The match is complete. ${fixture.moments.filter(m=>m.importance>=60).length} key moments were recorded for review.`,type:'opportunity',priority:'medium'});}
  }
  processContracts(world,date);void rng;return events;
}
