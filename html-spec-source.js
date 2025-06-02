import bcdf from './data/bcdf.json' with { type: 'json' };
import { features } from "web-features";
import getKeysInGroup from './getKeysInGroup.js';

let out = bcdf;
console.log(`Total keys: ${out.length}`);

out = bcdf.filter(k => k.key.startsWith('html.'));
console.log(`Keys starting with "html.": ${out.length}`);

//out = out.forEach(k => console.log(k.spec_url));

out = out.reduce((acc, k) => {
  const specs = Array.isArray(k.spec_url) ? k.spec_url : [k.spec_url];
  specs.forEach(url => {
    if (url != undefined) {
      acc.push(new URL(k.spec_url).hostname);
    }
  });
  return acc;
}, []);

out = new Set(out);

console.log(out);
