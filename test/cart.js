'use strict';

var assert = require('assert');
var sinon = require('sinon');
var CART = require('..').CART;
var utils = require('..').utils;

describe('CART', function() {
  describe('getFeaturesToSplitOn', function() {
    var getFeaturesToSplitOn = CART.getFeaturesToSplitOn;

    it('it returns only unique feature values per feature', function() {
      var matrix = [
        [1, 2, 3],
        [1, 2, 4],
        [1, 2, 5],
      ];
      var out = getFeaturesToSplitOn(matrix);
      assert.equal(5, out.length);
      assert.deepEqual([0,1,2,2,2], out.map(function(x) { return x.i; }));
      assert.deepEqual([1,2,3,4,5], out.map(function(x) { return x.value; }));
    });
  });

  describe('probabilities', function() {
    var probabilities = CART.probabilities;
    it('return probabilities for outcomes and possible outcomes', function() {
      var outcomes = [1, 1, 1, 1, 2, 2, 2, 3];
      var possible = [1, 2, 3, 4];

      var probs = probabilities(outcomes, possible);
      assert.equal(possible.length, probs.length);
      assert.deepEqual([4/8, 3/8, 1/8, 0/8], probs);
    });
  });

  describe('informationGain', function() {
    var informationGain = CART.informationGain;
    var entropy = utils.entropy;
    it('calculates the diff in entropy and entropy of partitions', function() {
      var score = 1;
      var numItems = 5;
      var parts = {
        a: [[], [1, 0]], // entropy of 1, weighted by 2/5
        b: [[], [1, 1, 0]] // entropy of 0.9182958340544894, weighted by 3/5
      };

      var gain = informationGain(score, numItems, parts.a, parts.b);
      var pscore = (entropy(parts.a[1]) * 2/5) + (entropy(parts.b[1]) * 3/5);
      assert.equal(score - pscore, gain);
    });
  });

  describe('getBestSplit', function() {
    var getBestSplit = CART.getBestSplit;
    var score = 1;
    var X = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 5], // 5 is the only value here that could identify this row
    ];
    var Y = [1, 1, 0];

    it('returns an object containing partitions, and split values', function() {
      var best = getBestSplit(score, X, Y);
      assert.deepEqual(['gain', 'partitions', 'value', 'i'], Object.keys(best));
    });

    it('retuns partitions which result in the most info gain', function() {
      var best = getBestSplit(score, X, Y);
      assert.equal(best.value, 5);
      assert.equal(best.i, 2);
      assert.deepEqual(best.partitions[true], [[[1,1,5]], [0]]);
      assert.deepEqual(best.partitions[false], [[[1,1,1], [1,1,1]], [1,1]]);
    });
  });

  describe('create', function() {
    var create = CART.create;
    var X = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 5]
    ];
    var Y = [1, 1, 0];
    var labels = [1, 0];

    it('returns an tree object', function() {
      var tree = create(X, Y, labels);
      assert.deepEqual(Object.keys(tree), ['score', 'trees', 'value', 'i']);
      assert.deepEqual(Object.keys(tree.trees), ['false', 'true']);
    });

    it('leaf nodes should contain probabilities', function() {
      // create a shallow tree where all the next nodes are leaf nodes
      var tree = create(X, Y, labels);
      assert(tree.trees[true].probs);
      assert(tree.trees[false].probs);
    });

    it('non-leaf nodes should contain a `trees` property', function() {
      var tree = create(X, Y, labels);
      assert(!tree.probs);
    });
  });

  describe('predict', function() {
    var create = CART.create;
    var predict = CART.predict;
    var X = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 5]
    ];
    var Y = [1, 1, 0];
    var labels = [1, 0];
    var tree = create(X, Y, labels);

    it('returns the correct result', function() {
      assert.deepEqual(predict(tree, X[0]), [1, 0]);
      assert.deepEqual(predict(tree, X[1]), [1, 0]);
      assert.deepEqual(predict(tree, X[2]), [0, 1]);
    });

    it('returns a list of probabilities', function() {
      assert(predict(tree, [5, 5, 5]) instanceof Array)
      assert.equal(predict(tree, [5, 5, 5]).length, labels.length);
    });
  });
});


