/**
 * This script reads the flattened browser compat data and outputs a CSV of the number of
 * new BCD keys added per year.
 */

import bcdf from './data/bcdf.json' with { type: 'json' };
import groupKeysByEarliestReleaseYear from './groupKeysByEarliestReleaseYear.js';

const out = groupKeysByEarliestReleaseYear(bcdf);

// dump csv of new keys per year
out.forEach(([year, count]) => {
  console.log(`${year},${count}`);
})
