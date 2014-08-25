'use strict';

export { 
  uniq, transpose, partition, freqs, entropy, pack, unpack, max, flatten, 
  flatMap, values, perc, map
};

const uniq = (arr) =>
  arr.reduce((acc, val) => acc.indexOf(val) < 0 ? [...acc, val] : acc, []);

const transpose = (matrix) =>
  matrix[0].map((_, i) => matrix.map(row => row[i]));

const partition = (fn, arr) =>
  arr.reduce((acc, item) => {
    let key = fn(item);
    if (!acc[key]) acc[key] = [];
    acc[key] = [...acc[key], item];
    return acc;
  }, {});

const freqs = (arr) =>
  arr.reduce((acc, item) => {
    acc[item] = acc[item] + 1 || 1;
    return acc;
  }, {});

const perc = (val, arr) =>
  arr.filter(item => item === val).length / arr.length;

const entropy = (arr) => {
  let probs = values(freqs(arr)).map(n => n / arr.length);
  return probs.reduce((e, p) => e - p * Math.log(p), 0) * Math.LOG2E;
};

const flatten = (arr) =>
  arr.reduce((acc, val) => acc.concat(val), []);

const flatMap = (arr, fn) =>
  flatten(arr.map(fn));

const pack = (X, Y) =>
  X.map((x, i) => [x, Y[i]]);

const unpack = (packed) =>
  packed.reduce(([X, Y], [x, y]) => [[...X, x], [...Y, y]], [[], []]);

const max = (arr) =>
  Math.max(...arr);

const values = (obj) =>
  Object.keys(obj).map(key => obj[key]);

const map = (obj, fn) =>
  Object.keys(obj).reduce((acc, key) => {
    acc[key] = fn(obj[key], key);
    return acc;
  }, {});
