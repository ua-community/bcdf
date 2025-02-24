/**
 * This script reads the flattened browser compat data
 * and groups it by key segments.
 */

import bcdf from './data/bcdf.json' with { type: 'json' };

// Filter by a specific year
const year = 2017;
const filterByYear = (data) => {
  const earliestReleaseDate =
    data.support.sort((a, b) => a.release_date - b.release_date)[0].release_date;
  return earliestReleaseDate != null
    && earliestReleaseDate.startsWith(year);
};

const forYear = bcdf.filter(filterByYear);
console.log(forYear.length);

// Group by key segment, eg "api.URL"
// and index of how many times it appears
const groups = forYear.reduce((acc, data) => {
  const keySegments = data.key.split('.');
  const key = keySegments.slice(0, 2).join('.');
  const idx = acc.findIndex(group => group[0] === key);
  idx === -1 ? acc.push([ key, 1 ]) : acc[idx][1]++;
  return acc;
}, []).sort((a, b) => b[1] - a[1]);

console.log(groups);
