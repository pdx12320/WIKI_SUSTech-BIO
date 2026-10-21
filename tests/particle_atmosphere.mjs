import assert from 'node:assert/strict';
import {atmospherePose} from '../static/onetake/particle-atmosphere.mjs';
assert.equal(atmospherePose(-.19).opacity,0,'snow opening remains unchanged');
assert.equal(atmospherePose(1.05).opacity,0,'light does not carry into the project directory');
assert.equal(atmospherePose(.5).opacity,1);
assert.notDeepEqual(atmospherePose(.5,1,1).lights,atmospherePose(.5,-1,-1).lights,'pointer moves the light');
assert.notDeepEqual(atmospherePose(.2).lights,atmospherePose(.7).lights,'scroll changes the depth offset');
for(let take=-.2;take<=1.1;take+=.01){
 for(const light of atmospherePose(take,20,-20).lights){assert(Math.abs(light.x)<60);assert(Math.abs(light.y)<60);}
 for(const light of atmospherePose(take,1,-1,true).lights){assert.equal(Math.abs(light.x),0);assert.equal(Math.abs(light.y),0);}
}
assert(atmospherePose(.5).lights[0].x*atmospherePose(.5).lights[1].x<0,'separate depths move in opposite directions');
assert(Number.isFinite(atmospherePose(NaN,Infinity,NaN).opacity));
console.log('Passed bounded pointer/scroll parallax, layered depth, opening/directory handoff and reduced-motion stability.');
