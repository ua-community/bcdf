import bcdf from './data/bcdf.json' with { type: 'json' };
import { features } from "web-features";
import getKeysInGroup from './getKeysInGroup.js';
import groupKeysByEarliestReleaseYear from './groupKeysByEarliestReleaseYear.js';


/*
const groupKey = 'web-components';
out = getKeysInGroup(groupKey);

//const sortedKeys = keys.map(key => key.key).sort();
//console.log(`Keys in group "${groupKey}":`, sortedKeys);

out = groupKeysByEarliestReleaseYear(out);
*/

let out = bcdf;
console.log(`Total keys: ${out.length}`);

out = bcdf.filter(k => k.key.startsWith('html.'));
console.log(`Keys starting with "html.": ${out.length}`);

out = groupKeysByEarliestReleaseYear(out);
console.log(`Keys starting with "html." grouped by earliest release year: ${out.length}`);

out.forEach(([year, count]) => {
  console.log(`${year},${count}`);
})
