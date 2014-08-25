'use strict';

import {
  uniq, entropy, perc, transpose, partition, pack, unpack, flatMap, values, map,
  flatten
} from './utils';

export { create, predict };

const {assign} = Object;

// Create a decision tree by recursively splitting on the feature value of each
// set of examples which results in the most information gain.
const create = (X, Y, labels) => {
  let score = entropy(Y);
  let probs = probabilities(Y, labels);
  let results = { probs };

  if (score > 0) {
    let {gain, partitions, index, value, fn} = getBestSplit(score, X, Y);
    let trees = map(partitions, ([x, y]) => create(x, y, labels));
    assign(results, {gain, trees, index, value, fn});
  }

  return results;
};

// Traverse the tree and finally return the probabilities for an example.
const predict = (tree, x) =>
  tree.trees ? predict(tree.trees[tree.fn([x])], x) : tree.probs;

// Return the difference between the score (previous entropy) and the sum of the
// weighted entropy of a set of partitions.
const informationGain = (score, partitions) => {
  let parts = values(partitions);
  let len = flatten(parts).length;
  return parts.reduce((g, [X, Y]) => g - (Y.length / len) * entropy(Y), score);
};

// Return an array of probabilities for each label.
const probabilities = (Y, labels) =>
  labels.map(label => perc(label, Y));

// For a feature matrix, return an array of unique feature values for each col.
// For example: [[1], [1]] -> [{ index: 0, value: 1 }]
const getFeaturesToSplitOn = (X) =>
  flatMap(transpose(X), (row, index) => {
    return uniq(row).map(value => { return {value, index}; });
  });

// Find the best partition by trying all possible partitions and keeping track
// of the one with the greated 'information gain' (less entropy post-partition).
const getBestSplit = (score, X, Y) =>
  getFeaturesToSplitOn(X).reduce((best, {value, index}) => {
    let fn = ([x, y]) => x[index] >= value;
    let partitions = map(partition(fn, pack(X, Y)), part => unpack(part));
    let gain = informationGain(score, partitions);

    if (!best.gain || gain > best.gain)
      assign(best, {gain, partitions, index, value, fn});

    return best;
  }, {});


