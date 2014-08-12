'use strict';

var assert = require('assert');
var utils = require('..').utils;

describe('Utils', function() {
  it('can return unique items in an array', function() {
    var uniq = utils.uniq;
    assert.deepEqual(uniq([1, 1, 2, 2, 2, 3]), [1, 2, 3]);
    assert.deepEqual(uniq(['a', 'b', 'c', 'c']), ['a', 'b', 'c']);
    assert.deepEqual(uniq([]), []);
    assert.deepEqual(uniq([1]), [1]);
  });

  it('can transpose a matrix', function() {
    var transpose = utils.transpose;
    var a = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    var b = [[1, 4, 7], [2, 5, 8], [3, 6, 9]];
    assert.deepEqual(transpose(a), b);
  });

  it('can partition an array by a function', function() {
    var partition = utils.partition;
    var a = [1, 2, 3, 4, 5, 6, 7, 8];

    var whereEven = partition(function(val) { return val % 2 === 0; }, a);
    assert.deepEqual(whereEven[true], [2, 4, 6, 8]);
    assert.deepEqual(whereEven[false], [1, 3, 5, 7]);
  });

  it('can flatMap an array of arrays', function() {
    var flatMap = utils.flatMap;
    var a = [[0, 1, 2], [3, 4], [5]];
    var id = function(x) { return x; };
    assert.deepEqual(flatMap(id, a), [0, 1, 2, 3, 4, 5]);
  });

  it('can return the frequencies of items in an array', function() {
    var freqs = utils.freqs;
    assert.deepEqual(freqs(['a', 'b', 'b', 'c', 'c', 'c']), {a: 1, b: 2, c: 3});
    assert.deepEqual(freqs([]), {});
    assert.deepEqual(freqs([1, 2, 2]), {1: 1, 2: 2});
  });

  it('can calculate shannon entropy of an array', function() {
    var entropy = utils.entropy;
    var a = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4];
    assert.equal(1.8464393446710157, entropy(a));
    assert.equal(0, entropy([]));
    assert.equal(0, entropy([1]));
    assert.equal(1, entropy([1, 0]));
  });

  it('can create rows from arrays of data', function() {
    var createRows = utils.createRows;
    var X = [[1, 2, 3, 4], [5, 6, 7, 8]];
    var Y = ['a', 'b'];

    var rows = [
      { features: [1, 2, 3, 4], label: 'a' },
      { features: [5, 6, 7, 8], label: 'b' }
    ];

    assert.deepEqual(rows[0], createRows(X, Y)[0]);
    assert.deepEqual(rows[1], createRows(X, Y)[1]);
    assert.deepEqual(X, createRows(X, Y).features);
    assert.deepEqual(Y, createRows(X, Y).labels);
  });
});
