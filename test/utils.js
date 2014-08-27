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

  it('can find the percentage a value is of an array', function() {
    var perc = utils.perc;
    assert.equal(0.5, perc('a', ['a', 333]));
    assert.equal(0.25, perc('a', ['a', 'b', 'b', 'b']));
    assert.equal(1, perc(1, [1, 1]));
    assert.equal(0, perc('a', [1]));
  });

  it('can return the max value of an array', function() {
    var max = utils.max;
    assert.equal(10, max([1, 2, 3, 10]));
    assert.equal(10, max([10, 2, 3, 1]));
  });

  it('can return the values of an object', function() {
    var values = utils.values;
    var obj = { a: 123, b: 456, c: 'c' };
    assert.deepEqual([123, 456, 'c'], values(obj));
    assert.deepEqual([], values({}));
  });

  it('can map over an object', function() {
    var map = utils.map;
    var spy = sinon.spy(function(n) { return n; });
    var obj = { a: 1, b: 2, c: 3 };
    assert.deepEqual(obj, map(obj, spy));
    assert.equal(spy.callCount, 3);
    assert(spy.getCall(0).calledWith(1));
    assert(spy.getCall(1).calledWith(2));
    assert(spy.getCall(2).calledWith(3));
  });

  it('can sample an array', function() {
    var sample = utils.sample;
    var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    assert.equal(10, sample(arr, 1.0).length);
    assert.equal(5, sample(arr, 0.5).length);
    assert.equal(3, sample(arr, 0.33333).length);
    sample(arr, 0.5).forEach(function(i) {
      assert.notEqual(-1, arr.indexOf(arr[i]));
    });

    var noReplacement = sample(arr, 1.0, false);
    noReplacement.forEach(function(i) {
      assert(0 <= i && i < arr.length);
    });
  });

  it('can create an empty array of a specified length', function() {
    var empty = utils.empty;
    assert.equal(10, empty(10).length);
    assert.equal(0, empty(0).length);
    assert.deepEqual([undefined, undefined, undefined], empty(3));
  });

});
