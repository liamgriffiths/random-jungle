'use strict';

import { uniq, entropy, freqs, transpose, partition } from './utils';

export {
  predict, 
  create, 
  informationGain, 
  probabilities, 
  getRowsFeatures,
  findBestPartitions
};

const predict = (tree, x) => {
  if (tree.trees) {
    let fn = (row) => row[tree.index] >= tree.value;
    let next = tree.trees[fn(x)];
    return predict(next, x);
  } else {
    return tree.probabilities;
  }
};

const informationGain = (score, partitions) => {
  let arr = Object.keys(partitions).map(k => partitions[k]);
  let total = arr.reduce((len, part) => len + part.length, 0);

  return arr.reduce((gain, rows) => {
    return gain - (rows.length / total) * entropy(rows);
  }, score);
};

const probabilities = (rows, labels) => {
  let fs = freqs(rows.labels);
  return labels.map(label => (label in fs) ? fs[label] / rows.length : 0.0);
};

const getRowsFeatures = (rows) =>
  transpose(rows.features);

const create = (rows, labels) => {
  // calculate initial score for rows
  let score = entropy(rows);
  let results = {
    probabilities: probabilities(rows, labels)
  };

  if (score > 0.25) {
    let best = findBestPartitions(score, rows);
    best.trees = Object.keys(best.partitions).reduce((acc, key) => {
      acc[key] = create(best.partitions[key], labels);
      return acc;
    }, {});
    results.gain = best.gain;
    results.trees = best.trees;
    results.index = best.index;
    results.value = best.value;
  }

  return results;
};

const findBestPartitions = (score, rows) => {
  let rowsFeatures = getRowsFeatures(rows);
  // create list of features and values for each feature and each feature value
  let values = rowsFeatures
    .map((row, i) => uniq(row).map(val => [i, val]))
    .reduce((acc, val) => acc.concat(val), []);

  // apply partition fns to rows and find the fn with the most infoGain
  return values.reduce((acc, value) => {
    let fn = (row) => row.features[value.index] >= value.val;
    let partitions = partition(fn, rows);
    let gain = informationGain(score, partitions);

    if (!acc.gain || gain > acc.gain) {
      acc = {
        gain: gain,
        partitions: partitions,
        index: value.index,
        value: value.val
      };
    }

    return acc;
  }, {});
};



