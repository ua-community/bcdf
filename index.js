import * as fs from 'fs';
import bcd from '@mdn/browser-compat-data' with { type: 'json' };

const OUTPUT_FILE = 'data/bcdf.json';

// List of the BCD top-level keys that are actually feature data, not
// BCD system metadata.
const keyRoots = {
  //'__meta',
  api: bcd.api,
  //'browsers',
  css: bcd.css,
  html: bcd.html,
  http: bcd.http,
  javascript: bcd.javascript,
  mathml: bcd.mathml,
  svg: bcd.svg,
  webassembly: bcd.webassembly,
  //'webdriver',
  //'webextensions'
};

const getReleaseDate = (key, browser, support) => {
  // this may be:
  // - false: not supported
  // - null: unknown
  // - string: version number
  // - string: '≤' + version number
  // - string: 'preview' (for preview versions)
  const versionStr = support.version_added;

  // If not supported or unknown, set to null
  if (versionStr === false || versionStr === null) {
    return null;
  }

  // If version is 'preview', set to null
  if (versionStr === 'preview') {
    return null;
  }

  // Remove the ≤ prefix if there, doesn't matter for this mapping.
  const version = versionStr.replace('≤', '');

  // This should not happen, but new string values may happen...
  if (!bcd.browsers[browser].releases[version]) {
    //console.log('no version for', key, browser, versionStr, version, support);
    return null;
  }

  // This key is not released, that's ok, it happens.
  if (!bcd.browsers[browser].releases[version].release_date) {
    //console.log('no release for', key, browser, versionStr, version, support);
    return null;
  }

  return bcd.browsers[browser].releases[version].release_date;
};

// Process the support object for a given key:
//
// - Flatten support, hoisting up the entries that are arrays
// - Get a release date for each entry, based on the `browser` metadata
// - Fill `mirror` entries with the release date of the upstream browser
const processSupport = (key, entry) => {
  // Array of support objects, keyed off browser+version
  let flatSupport = [];

  for (const browser in entry.support) {

    const support = entry.support[browser];

    // Anther entry will be the valid one, so ignore for now,
    // get in pass 2.
    if (support === 'mirror') {
      // get upstream browser from bcd.browsers
      const upstream = bcd.browsers[browser].upstream;
      // get the support object from the upstream browser
      const upstreamSupport = entry.support[upstream];
      // get the release date from the upstream browser
      support.release_date = getReleaseDate(key, upstream, upstreamSupport);
      support.browser = browser;
      flatSupport.push(support);
    }
    else if (Array.isArray(support)) {
      support.forEach((supp, i) => {
        support[i].release_date = getReleaseDate(key, browser, supp);
        support[i].browser = browser;
        flatSupport.push(support[i]);
      });
    }
    else {
      support.release_date = getReleaseDate(key, browser, support);
      support.browser = browser;
      flatSupport.push(support);
    }
  }

  entry.support = flatSupport;
  return entry;
};

// Create list of BCD key paths for each entry in the tree which
// has a `__compat` object.
//
// The list key is the path in the BCD folder structure, separated by `.` eg:
//
// api.AbortController.abort.reason_parameter
//
// The value is the `__compat` object for that key.

const out = [];

const recursivelyGenPaths = (obj, keyArray) => {
  // Iterate over the object keys
  for (const key in obj) {
    // If the key is __compat
    if (key === '__compat') {
      const keyStr = keyArray.join('.');
      let updated = processSupport(keyStr, obj[key]);
      updated.key = keyStr;
      out.push(updated);
    }
    else if (typeof obj[key] === 'object') {
      recursivelyGenPaths(obj[key], keyArray.concat(key));
    }
  }
}

recursivelyGenPaths(keyRoots, []);

//console.log(JSON.stringify(out[0]))
console.log(out[0])
//console.log(out)

console.log('total keys:', Object.keys(out).length);

// Write `out` to `OUTPUT_FILE`
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(out, null, 2));
