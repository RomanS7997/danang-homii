import test from 'node:test';
import assert from 'node:assert/strict';
import {createMapNavigation} from '../src/map-navigation.js';

// Exercise the same Leaflet event contract used by wheel, buttons and dragging.
function fixture() {
  const handlers=new Map(), calls=[];
  let zoom=13;
  const map={
    on(events,fn){for(const event of events.split(' ')){if(!handlers.has(event))handlers.set(event,new Set());handlers.get(event).add(fn);}},
    off(events,fn){for(const event of events.split(' '))handlers.get(event)?.delete(fn);},
    fire(event){for(const fn of handlers.get(event)||[])fn();},
    getZoom:()=>zoom, getMaxZoom:()=>18,
    invalidateSize(options){calls.push(['resize',options]);},
    fitBounds(bounds,options){calls.push(['fit',bounds,options]);this.fire('zoomstart');zoom=13.5;this.fire('zoomend');},
    setView(coords,value,options){calls.push(['locate',coords,value,options]);this.fire('movestart');zoom=value;this.fire('zoomend');},
    userZoom(value){this.fire('zoomstart');zoom=value;this.fire('zoomend');},
  };
  return {map,calls,handlers};
}

test('Opening resizes fit listings; wheel zoom and panning survive later resizes',()=>{
  const {map,calls}=fixture();
  const observed=[];
  const controller=createMapNavigation(map,{bounds:()=>['listings'],fitOptions:()=>({maxZoom:14.5}),onZoom:value=>observed.push(value)});
  controller.resize();controller.resize();
  assert.equal(calls.filter(c=>c[0]==='fit').length,2);
  map.userZoom(16);
  controller.resize();
  assert.equal(map.getZoom(),16);
  assert.equal(observed.at(-1),16);
  assert.equal(calls.filter(c=>c[0]==='fit').length,2);
  assert.deepEqual(calls.at(-1),['resize',{animate:false,pan:true}]);
  controller.overview();
  assert.equal(map.getZoom(),13.5);
  controller.resize();
  assert.equal(calls.filter(c=>c[0]==='fit').length,4);
  map.fire('movestart');controller.resize();
  assert.equal(calls.filter(c=>c[0]==='fit').length,4);
});

test('Locate shows street context without zooming out an already detailed view',()=>{
  const {map,calls}=fixture();
  const controller=createMapNavigation(map,{bounds:()=>[],fitOptions:()=>({}),animate:()=>false});
  controller.locate([16.05,108.24]);
  assert.deepEqual(calls.at(-1),['locate',[16.05,108.24],15,{animate:false}]);
  map.userZoom(17);
  controller.locate([16.08,108.22]);
  assert.equal(calls.at(-1)[2],17);
  controller.resize();
  assert.equal(calls.filter(c=>c[0]==='fit').length,0);
});

test('Explicit overview reads current bounds and viewport padding; teardown removes handlers',()=>{
  const {map,calls,handlers}=fixture();
  let bounds=['first'],padding=40;
  const controller=createMapNavigation(map,{bounds:()=>bounds,fitOptions:()=>({padding:[padding,padding]})});
  controller.overview();
  bounds=['second'];padding=80;
  controller.overview();
  assert.deepEqual(calls.at(-1),['fit',['second'],{padding:[80,80],animate:false}]);
  controller.destroy();
  for(const listeners of handlers.values())assert.equal(listeners.size,0);
});
