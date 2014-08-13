'use strict';

import {
  uniq,
  entropy,
  freqs,
  transpose,
  partition,
  pack,
  unpack
} from './utils';

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
    let key = x[tree.index] >= tree.value;
    return predict(tree.trees[key]);
  } else {
    return tree.probs
  }
};

const informationGain = (score, partitions) => {
  let arr = Object.keys(partitions).map(k => partitions[k]);
  let total = arr.reduce((len, partition) => len + partition.length, 0);

  return arr.reduce((gain, partition) => {
    let [_, Y] = unpack(partition); // jshint ignore:line
    return gain - (partition.length / total) * entropy(Y);
  }, score);
};

const probabilities = (Y, labels) => {
  let fs = freqs(Y);
  return labels.map(label => fs[label] ? fs[label] / Y.length : 0.0);
};

const create = (X, Y, labels) => {
  // calculate initial score for rows
  let score = entropy(Y);
  let probs = probabilities(Y, labels);
  let results = { probs };

  if (score > 0.25) {
    let { gain, partitions, index, value } = findBestPartitions(score, X, Y);

    let trees = Object.keys(partitions)
      .reduce((acc, key) => {
        let [X, Y] = unpack(partitions[key]);
        acc[key] = create(X, Y, labels);
        return acc;
      }, {});

    results = { probs, gain, trees, index, value }; // jshint ignore:line
  }

  return results;
};

const findBestPartitions = (score, X, Y) => {
  // create list of features and values for each feature and each feature value
  let features = transpose(X)
    .map((row, index) => uniq(row).map(val => [index, val]))
    .reduce((acc, val) => acc.concat(val), []);

  // apply partition fns to rows and find the feature/val with the most infoGain
  return features.reduce((acc, [index, value]) => {
    let fn = ([x, y]) => x[index] >= value;
    let partitions = partition(fn, pack(X, Y));
    let gain = informationGain(score, partitions);

    if (!acc.gain || gain > acc.gain) {
      acc = { gain, partitions, index, value }; // jshint ignore:line
    }

    return acc;
  }, {});
};


