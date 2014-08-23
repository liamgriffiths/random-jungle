'use strict';

var assert = require('assert');
var sinon = require('sinon');
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

  it('can flatten an array', function() {
    var flatten = utils.flatten;
    assert.deepEqual([], flatten([]));
    assert.deepEqual([1], flatten([1]));
    assert.deepEqual([], flatten([[]]));
    assert.deepEqual([1,2,3,4], flatten([[1], 2, [3, 4], []]));
  });

  it('can flatMap an array', function() {
    var flatMap = utils.flatMap;
    var arr = [1,[2], [3, 4], []];
    var spy = sinon.spy(function(n) { return n; });
    assert.deepEqual([1,2,3,4], flatMap(arr, spy));
    assert.equal(spy.callCount, 4);
    assert(spy.getCall(0).calledWith(1));
    assert(spy.getCall(1).calledWith([2]));
    assert(spy.getCall(2).calledWith([3,4]));
    assert(spy.getCall(3).calledWith([]));
  });
});
