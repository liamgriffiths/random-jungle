'use strict';

import {
  uniq, entropy, perc, transpose, partition, pack, unpack, flatMap, values, map,
  flatten, sample
} from './utils';

export {
  create, predict, informationGain, probabilities, getFeaturesToSplitOn,
  getBestSplit
};

// Create a decision tree by recursively splitting on the feature value of each
// set of examples which results in the most information gain.
const create = (X, Y, labels, opts = { randomSubspace: false }) => {
  let score = entropy(Y);

  if (score > 0) {
    let {gain, partitions, value, i, fn} = getBestSplit(score, X, Y, opts);
    let trees = map(partitions, ([x, y]) => create(x, y, labels));
    return { score, trees, value, i };
  }

  return { score, probs: probabilities(Y, labels) };
};

// Traverse the tree until we are at a leaf (has probabilities).
const predict = (tree, x) => {
  let fn = ([x, y]) => x[tree.i] >= tree.value;
  return tree.probs || predict(tree.trees[fn([x])], x);
}

// Return the difference between the score (previous entropy) and the sum of the
// weighted entropy of a set of partitions.
const informationGain = (score, count, ...partitions) =>
  partitions.reduce((g, [x, y]) => g - (y.length / count) * entropy(y), score);

// Return an array of probabilities for each label.
const probabilities = (Y, labels) =>
  labels.map(label => perc(label, Y));

const sampleFeatures = (X, opts = { percent: 0.75, replacement: false }) => {
  let featureIndicies = sample(X[0], 0.75, false);
  return X.map(x => x.filter((_, i) => featureIndicies.indexOf(i) > -1));
};

// For a feature matrix, return an array of unique feature values for each col.
const getFeaturesToSplitOn = (X, opts = { randomSubspace: false }) => {
  let features = opts.randomSubspace ? sampleFeatures(X) : X;

  return flatMap(transpose(features), (row, i) => {
    return uniq(row).map(value => ({ value, i }));
  });
};

// Find the best partition by trying all possible partitions and keeping track
// of the one with the greated 'information gain' (less entropy post-partition).
const getBestSplit = (score, X, Y, opts = { randomSubspace: false }) =>
  getFeaturesToSplitOn(X, opts).reduce((best, { value, i }) => {
    let fn = ([x, y]) => x[i] >= value;
    let partitions = map(partition(fn, pack(X, Y)), part => unpack(part));
    let gain = informationGain(score, Y.length, ...values(partitions));

    if (!best.gain || gain > best.gain)
      Object.assign(best, { gain, partitions, value, i });

    return best;
  }, {});
