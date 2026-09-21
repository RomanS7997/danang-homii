import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {recommendAreas,calculateMoveBudget,neighbourhoods,priorities} from '../src/enrichment-content.js';

test('Recommendations explain selected priorities, with unique results and no fabricated scores',()=>{
  assert.deepEqual(recommendAreas([]),[]);
  const result=recommendAreas(['sea','nature']);
  assert.equal(result[0].area.id,'son-tra');
  assert.deepEqual(result[0].matched,['sea','nature']);
  assert.equal(new Set(result.map(r=>r.area.id)).size,result.length);
  for(const choice of priorities){
    const matches=recommendAreas([choice.id]);
    assert.ok(matches.length>0&&matches.length<=2);
    for(const match of matches)assert.deepEqual(match.matched,[choice.id]);
  }
  assert.deepEqual(recommendAreas(['unknown']),[]);
});
test('Budget separates refundable deposit from recurring costs and rejects incomplete inputs',()=>{
  assert.deepEqual(calculateMoveBudget('600','1200','75.50'),{monthly:675.5,initial:1875.5});
  assert.deepEqual(calculateMoveBudget(0,0,0),{monthly:0,initial:0});
  for(const invalid of ['',null,undefined,-1,'NaN',Infinity])assert.equal(calculateMoveBudget(invalid,100,30),null);
});
test('Every neighbourhood has a distinct production image, three day scenes and a source',()=>{
  assert.equal(new Set(neighbourhoods.map(a=>a.image)).size,5);
  for(const area of neighbourhoods){
    assert.equal(area.day.length,3);
    assert.ok(area.source.startsWith('https://'));
    assert.ok(fs.existsSync(new URL(`../public/assets/editorial/${area.image}.webp`,import.meta.url)));
  }
});
