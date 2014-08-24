'use strict';

import { uniq, entropy, freqs, transpose, partition, pack, unpack, flatMap } from './utils'; // jshint ignore:line
export { predict, create, informationGain, probabilities, getBestSplit }; // jshint ignore:line

// Create a decision tree by recursively splitting on the feature/value of each
// set of examples which results in the most information gain.
const create = (X, Y, labels, options) => {
  // calculate initial score for rows
  let score = entropy(Y);
  let probs = probabilities(Y, labels);
  let results = { probs };

  if (score > (100/labels.length)/100) {
    let { gain, partitions, index, value, fn } = getBestSplit(score, X, Y);

    let trees = Object.keys(partitions).reduce((acc, key) => {
      let [X, Y] = unpack(partitions[key]);
      acc[key] = create(X, Y, labels);
      return acc;
    }, {});

    results = { probs, gain, trees, index, value, fn }; // jshint ignore:line
  }

  return results;
};

// Traverse the tree and when there are no more sub-trees return the 
// probabilities for all the possible categories.
const predict = (tree, x) =>
  tree.trees ? predict(tree.trees[tree.fn([x])], x) : tree.probs;

// Given a previous score (entropy) and a set of partitions, calculate the
// weighted entropy of each partition and find the difference from the previous
// score. The "information gain" represents the how much less entropy there is
// in a set of partitions than in the combined set.
const informationGain = (score, partitions) => {
  let arr = Object.keys(partitions).map(k => partitions[k]);
  let total = arr.reduce((len, partition) => len + partition.length, 0);

  return arr.reduce((gain, partition) => {
    let [_, Y] = unpack(partition); // jshint ignore:line
    return gain - (partition.length / total) * entropy(Y);
  }, score);
};

// Given an list of outcomes (Y) and list of possible outcomes (labels) return
// a list of the probability for each possible outcome
const probabilities = (Y, labels) => {
  let fs = freqs(Y);
  return labels.map(label => fs[label] ? fs[label] / Y.length : 0.0);
};

// Create a list of features and values for each feature and each feature value
// for example:
// [[1, 2], [1, 3]] ->
// [{index: 0, value: 1}, {index: 1, value: 2}, {index: 1: value: 3}]
const getFeaturesToSplitOn = (X) =>
  flatMap(transpose(X), (row, index) => {
    return uniq(row).map(value => { return { index, value }; });
  });

// For every feature value to split on, split the data on that value and
// compare to the previous entropy score for the split data. Return the values
// that created the split with the greated "information gain".
const getBestSplit = (score, X, Y) =>
  getFeaturesToSplitOn(X).reduce((acc, {index, value}) => {
    let fn = ([x, y]) => x[index] >= value;
    let partitions = partition(fn, pack(X, Y));
    let gain = informationGain(score, partitions);

    if (!acc.gain || gain > acc.gain) {
      acc = { gain, partitions, index, value, fn }; // jshint ignore:line
    }

    return acc;
  }, {});


