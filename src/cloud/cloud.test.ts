import { describe, expect, it } from 'vitest';
import { checksum, stableJson } from './checksum';
import { classifySync } from './syncEngine';

describe('Phase 8 cloud synchronization',()=>{
  it('produces stable checksums independent of object key order',()=>{
    const a={b:2,a:1,nested:{z:true,y:['x',3]}},b={nested:{y:['x',3],z:true},a:1,b:2};
    expect(stableJson(a)).toBe(stableJson(b));expect(checksum(a)).toBe(checksum(b));
  });
  it('does nothing when local and remote saves are identical',()=>expect(classifySync('same','previous','same')).toBe('same'));
  it('downloads when only cloud changed',()=>expect(classifySync('base','base','remote-new')).toBe('download'));
  it('uploads when only local changed',()=>expect(classifySync('local-new','base','base')).toBe('upload'));
  it('flags divergent histories instead of auto-merging',()=>expect(classifySync('local-new','base','remote-new')).toBe('conflict'));
  it('treats unrelated first-time local and cloud histories as a conflict',()=>expect(classifySync('local',null,'remote')).toBe('conflict'));
});
