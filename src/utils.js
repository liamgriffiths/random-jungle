'use strict';

export { uniq, transpose, partition, flatMap, freqs, entropy, createRows };

const uniq = (arr) =>
  arr.reduce((acc, val) => acc.indexOf(val) < 0 ? acc.concat(val) : acc, []);

const transpose = (matrix) =>
  matrix[0].map((_, i) => matrix.map(row => row[i]));

const partition = (fn, arr) =>
  arr.reduce((acc, item) => {
    let key = fn(item);
    acc[key] = (acc[key] || []).concat(item);
    return acc;
  }, {});

const flatMap = (fn, arr) =>
  arr.map(fn).reduce((acc, val) => acc.concat(val), []);

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

const createRows = (X, Y) => {
  let rows = X.map((x, i) => { return { features: x, label: Y[i] }; });
  [rows.features, rows.labels]  = [X, Y];
  return rows;
};

