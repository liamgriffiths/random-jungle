'use strict';

export { uniq, transpose, partition, freqs, entropy, pack, unpack, max };

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

const entropy = (arr) => {
  let f = freqs(arr);
  let probs = Object.keys(f).map(k => f[k] / arr.length);
  return probs.reduce((e, p) => e - p * Math.log(p), 0) * Math.LOG2E;
};

const pack = (X, Y) =>
  X.map((x, i) => [x, Y[i]]);

const unpack = (packed) =>
  packed.reduce(([X, Y], [x, y]) => [[...X, x], [...Y, y]], [[], []]);

const max = ([first, ...rest]) =>
  rest.reduce((max, next) => next > max ? next : max, first);


