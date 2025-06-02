const groupKeysByEarliestReleaseYear = keys => {
  let out = keys;

  //console.log('start', out.length);

  const getYear = str => str.split('-')[0];

  // remove null release dates
  out = out.filter(k => {
    k.support = k.support.filter(r => r.release_date != null);
    return k;
  });

  //console.log('without null releases', out.length);

  // remove entries without releases 
  out = out.filter(k =>  k.support.some(r => r.hasOwnProperty('release_date')));

  //console.log('without zero releases', out.length);

  const getEarliestRelease = releases => {
    return releases.map(r => getYear(r.release_date))
      .sort((a, b) => a - b)[0];
  };

  // add earliest release date to each key
  out = out.map(k => {
    k.earliest_release = getEarliestRelease(k.support);
    return k;
  });

  //console.log('with earliest release year added as property', out.length);

  const groupByEarliestReleaseYear = keys => {
    return keys.reduce((acc, k) => {
      const year = k.earliest_release;
      if (acc.hasOwnProperty(year)) {
        acc[year].push(k);
      }
      else {
        acc[year] = [ k ];
      }
      return acc;
    }, [])
  };

  out = groupByEarliestReleaseYear(out);

  //console.log('grouped by earliest release year', Object.keys(out).length);

  const mapToCountPerYear = groupedByYear => {
    return Object.entries(groupedByYear).map(([year, keys]) => {
      return [ year, keys.length ];
    });
  };

  out = mapToCountPerYear(out);
  //console.log('mapped to count per year', out.length);

  // sort the grouped data by year
  out = out.sort((a, b) => a[0] - b[0]);
  //console.log('sorted by earliest release year', out.length);

  return out;
};

export default groupKeysByEarliestReleaseYear;
