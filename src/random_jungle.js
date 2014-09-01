'use strict';

import { empty, sample, transpose } from './utils';
const CART = require('./cart'); // TODO: how to import?

export {create, predict};

// Build an array of decision trees from the data by sampling from the available
// training data and a random feature subspace.
const create = (X, Y, labels, opts = { size: 5}) =>
  empty(opts.size).map((_, i) => {
    // Sample the training date for this tree
    let indicies = sample(Y, 1);
    let [xs, ys] = [indicies.map(i => X[i]), indicies.map(i => Y[i])];
    return CART.create(xs, ys, labels, { useRandomSubspace: true });
  });

// Aggregate the output from all the decision trees in the jungle.
const predict = (jungle, x) => {
  let out = jungle.reduce((acc, tree, i) => {
    let out = CART.predict(tree, x);
    acc.push(out);
    return acc;
  }, []);

  return transpose(out)
    .map(row => row.reduce((a, b) => a + b, 0) / row.length);
};
