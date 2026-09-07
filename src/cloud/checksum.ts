function stable(value:unknown):string{
  if(value===null||typeof value!=='object')return JSON.stringify(value);
  if(Array.isArray(value))return`[${value.map(stable).join(',')}]`;
  const object=value as Record<string,unknown>;
  return`{${Object.keys(object).sort().map(k=>`${JSON.stringify(k)}:${stable(object[k])}`).join(',')}}`;
}

export function stableJson(value:unknown){return stable(value);}

export function checksum(value:unknown):string{
  const text=stable(value);let h1=0x811c9dc5,h2=0x9e3779b9;
  for(let i=0;i<text.length;i++){
    const c=text.charCodeAt(i);h1=Math.imul(h1^c,0x01000193);h2=Math.imul(h2^(c+i),0x85ebca6b);
  }
  return`${(h1>>>0).toString(16).padStart(8,'0')}${(h2>>>0).toString(16).padStart(8,'0')}`;
}
