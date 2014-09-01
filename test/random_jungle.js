'use strict';

var assert = require('assert');
var RandomJungle = require('..').RandomJungle;

describe('Random Jungle', function() {
  describe('create', function() {
    var create = RandomJungle.create;
    var X = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 5],
    ];
    var Y = [1, 1, 0];
    var labels = [1, 0];

    it('should create the specified number of decision trees', function() {
      [1, 2, 3, 10].forEach(function(size) {
        var trees = create(X, Y, labels, { size: size });
        assert.equal(trees.length, size);
      });
    });
  });

  describe('predict', function() {
    var create = RandomJungle.create;
    var predict = RandomJungle.predict;
    var X = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 5],
    ];
    var Y = [1, 1, 0];
    var labels = [1, 0];
    var trees = create(X, Y, labels);

    it('returns the correct result', function() {
      assert.deepEqual(predict(trees, X[0]), [1, 0]);
      assert.deepEqual(predict(trees, X[1]), [1, 0]);
      assert.deepEqual(predict(trees, X[2]), [0, 1]);
    });

    it('returns a list of probabilities', function() {
      assert(predict(trees, [5, 5, 5]) instanceof Array);
      assert.equal(predict(trees, [5, 5, 5]).length, labels.length);
    });

  });
});
