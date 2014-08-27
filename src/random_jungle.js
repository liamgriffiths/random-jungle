'use strict';

import { empty, sample } from './utils';
const CART = require('./cart'); // TODO: how to import?

export {create, predict};

// Build an array of decision trees from the data by sampling from the available
// training data and a random feature subspace.
const create = (X, Y, labels, size) =>
  empty(size).map((_, i) => {
    // Sample the training date for this tree
    let indicies = sample(Y, 0.9);
    let [xs, ys] = [indicies.map(i => X[i]), indicies.map(i => Y[i])];

    // Sample the features to create a random subspace for this tree
    // let featureIndicies = sample(xs[0], 1);
    // let xss = xs.map(x => x.filter((_, i) => featureIndicies.indexOf(i) > -1));

    return CART.create(xs, ys, labels);
  });

// Aggregate the output from all the decision trees in the jungle.
const predict = (jungle, x) =>
  jungle.reduce((probs, tree, i) => {
    let out = CART.predict(tree, x);
    if (!probs.length) probs = out;
    return out.map((o, i) => o + probs[i]);
  }, []).map(p => p / jungle.length);
