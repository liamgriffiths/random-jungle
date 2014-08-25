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
    let {gain, partitions, i, value, fn} = getBestSplit(score, X, Y);
    let trees = map(partitions, ([x, y]) => create(x, y, labels));
    assign(results, { gain, trees, i, value, fn });
  }

  return results;
};

// Traverse the tree and finally return the probabilities for an example.
const predict = (tree, x) =>
  tree.trees ? predict(tree.trees[tree.fn([x])], x) : tree.probs;

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
      assign(best, { gain, partitions, i, value, fn });

    return best;
  }, {});


