/**
 * This script reads the flattened browser compat data and outputs a CSV of the number of
 * new BCD keys added per year.
 */

import bcdf from './data/bcdf.json' with { type: 'json' };

const getYear = str => str.split('-')[0];

const keysPerYear = bcdf.reduce((acc, data) => {

  const earliestRelease = data.support
    .filter(s => s.release_date != null)
    .sort((a, b) => getYear(a.release_date) - getYear(b.release_date));

  if (earliestRelease.length === 0) {
    return acc;
  }

  const year = getYear(earliestRelease[0].release_date);

  const idx = acc.findIndex(entry => entry[0] === year);
  idx === -1 ? acc.push([ year, 1 ]) : acc[idx][1]++;

  return acc;

}, []).sort((a, b) => a[0] - b[0]);

// dump csv of new keys per year
keysPerYear.forEach(([year, count]) => {
  console.log(`${year},${count}`);
})
