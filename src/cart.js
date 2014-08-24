'use strict';

import { uniq, entropy, perc, transpose, partition, pack, unpack, flatMap, values } from './utils'; // jshint ignore:line
export { predict, create, informationGain, probabilities, getBestSplit }; // jshint ignore:line

// Create a decision tree by recursively splitting on the feature/value of each
// set of examples which results in the most information gain.
const create = (X, Y, labels, options) => {
  let score = entropy(Y);
  let probs = probabilities(Y, labels);

  if (score > (100/labels.length)/100) {
    let { gain, partitions, index, value, fn } = getBestSplit(score, X, Y);

    let trees = Object.keys(partitions).reduce((acc, key) => {
      let [X, Y] = unpack(partitions[key]);
      acc[key] = create(X, Y, labels);
      return acc;
    }, {});

    return { probs, gain, trees, index, value, fn }; // jshint ignore:line
  } else {
    return { probs };
  }
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
  let parts = values(partitions).map(part => unpack(part));
  let len = parts.reduce((sum, part) => sum + part.length, 0);
  return parts.reduce((g, [X, Y]) => g - (Y.length / len) * entropy(Y), score);
};

// Given an list of outcomes (Y) and list of possible outcomes (labels) return
// a list of the probability for each possible outcome
const probabilities = (Y, labels) =>
  labels.map(label => perc(label, Y));

// Create a list of features and values for each feature and each feature value
// for example:
// [[1, 2], [1, 3]] ->
// [{index: 0, value: 1}, {index: 1, value: 2}, {index: 1: value: 3}]
const getFeaturesToSplitOn = (X) =>
  flatMap(transpose(X), (row, index) => {
    return uniq(row).map(value => { return { value, index }; });
  });

// For every feature value to split on, split the data on that value and
// compare to the previous entropy score for the split data. Return the values
// that created the split with the greated "information gain".
const getBestSplit = (score, X, Y) =>
  getFeaturesToSplitOn(X).reduce((acc, {value, index}) => {
    let fn = ([x, y]) => x[index] >= value;
    let partitions = partition(fn, pack(X, Y));
    let gain = informationGain(score, partitions);

    if (!acc.gain || gain > acc.gain) {
      acc = { gain, partitions, index, value, fn }; // jshint ignore:line
    }

    return acc;
  }, {});


