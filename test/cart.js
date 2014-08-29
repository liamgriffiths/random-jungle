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

  // describe('getBestSplit', function() {
  //   it('returns an object containing partitions, and split values', function() {
  //   });
  //
  //   it('retuns partitions which result in the most info gain', function() {
  //   });
  // });

  // describe('create', function() {
  //   it('returns an tree object', function() {
  //   });
  //   
  //   it('leaf nodes should contain probabilities', function() {
  //   });
  //
  //   it('non-leaf nodes should contain a `trees` property', function() {
  //   });
  // });

  // describe('predict', function() {
  //   it('returns the correct result', function() {
  //   });
  //
  //   it('returns a list of probabilities', function() {
  //   });
  // });
});


