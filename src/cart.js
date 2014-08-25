'use strict';

import {
  uniq, entropy, perc, transpose, partition, pack, unpack, flatMap, values, map,
  flatten
} from './utils';

export { create, predict };

// Create a decision tree by recursively splitting on the feature value of each
// set of examples which results in the most information gain.
const create = (X, Y, labels) => {
  let score = entropy(Y);

  if (score > 0) {
    let {gain, partitions, value, i, fn} = getBestSplit(score, X, Y);
    let trees = map(partitions, ([x, y]) => create(x, y, labels));
    return { score, trees, fn };
  } else {
    return { probs: probabilities(Y, labels) };
  }
};

// Traverse the tree until we are at a leaf (has probabilities).
const predict = (tree, x) =>
  tree.probs || predict(tree.trees[tree.fn([x])], x);

// Return the difference between the score (previous entropy) and the sum of the
// weighted entropy of a set of partitions.
const informationGain = (score, count, ...partitions) =>
  partitions.reduce((g, [x, y]) => g - (y.length / count) * entropy(y), score);

// Return an array of probabilities for each label.
const probabilities = (Y, labels) =>
  labels.map(label => perc(label, Y));

// For a feature matrix, return an array of unique feature values for each col.
const getFeaturesToSplitOn = (X) =>
  flatMap(transpose(X), (row, i) => uniq(row).map(value => ({ value, i })));

// Find the best partition by trying all possible partitions and keeping track
// of the one with the greated 'information gain' (less entropy post-partition).
const getBestSplit = (score, X, Y) =>
  getFeaturesToSplitOn(X).reduce((best, { value, i }) => {
    let fn = ([x, y]) => x[i] >= value;
    let partitions = map(partition(fn, pack(X, Y)), part => unpack(part));
    let gain = informationGain(score, Y.length, ...values(partitions));

    if (!best.gain || gain > best.gain)
      Object.assign(best, { gain, partitions, value, i, fn });

    return best;
  }, {});


