import { UserRound } from 'lucide-react';
import type { WorldState } from '../types/game';
import type { VisualContext } from '../presentation/visualPresentation';
import { visualPerson } from '../presentation/visualPresentation';

export function VisualPerson({world,personId,date,context='casual',compact=false,caption}:{world:WorldState;personId:string;date?:string;context?:VisualContext;compact?:boolean;caption?:string}){
  const visual=visualPerson(world,personId,date,context);if(!visual)return null;
  return <article className={`visual-person palette-${visual.palette} face-${visual.faceShape} hair-${visual.hairShape} age-${visual.ageBand} ${compact?'compact':''}`}>
    <div className="portrait-stage" aria-hidden="true"><div className="portrait-hair"/><div className="portrait-head"><span className="portrait-eye left"/><span className="portrait-eye right"/><span className="portrait-mouth"/></div><div className={`portrait-body outfit-${visual.outfit}`}/></div>
    <div className="visual-person-copy"><span className="eyebrow">AGE {visual.age} · {visual.outfit.replace('_',' ').toUpperCase()}</span><h3>{visual.name}</h3>{caption&&<p>{caption}</p>}<small>{visual.archived?'Archived life':'Current world'} · wardrobe {visual.outfitQuality}/100</small></div>
  </article>;
}

export function VisualPersonFallback({name}:{name:string}){return <article className="visual-person compact"><div className="portrait-stage fallback" aria-hidden="true"><UserRound/></div><div className="visual-person-copy"><h3>{name}</h3></div></article>;}
