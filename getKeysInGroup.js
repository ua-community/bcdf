import bcdf from './data/bcdf.json' with { type: 'json' };
import { features } from "web-features";

const groupKey = 'web-components';

const getFeaturesAsArray = features => {
  return Object.keys(features).map(featureKey => {
    const feature = features[featureKey];
    feature.key = featureKey;
    return feature;
  });
};

const getKeysInGroup = groupKey => {

  const featuresArray = getFeaturesAsArray(features);

  const getFeaturesInGroup = group => featuresArray.filter(f => f.group && f.group.includes(groupKey));

  const featuresInGroup = getFeaturesInGroup(groupKey);

  const featureKeys = featuresInGroup.map(f => f.key).sort();

  const tags = featureKeys.map(key => `web-features:${key}`);

  const keysInGroup = bcdf.filter(key => key.tags && key.tags.some(tag => tags.includes(tag)));

  return keysInGroup;;
};

export default getKeysInGroup;
