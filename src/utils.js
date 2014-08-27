'use strict';

export { 
  uniq, transpose, partition, freqs, entropy, pack, unpack, max, flatten, 
  flatMap, values, perc, map, sample, empty
};

// Return unique elements of an array.
const uniq = (arr) =>
  arr.reduce((acc, val) => acc.indexOf(val) < 0 ? [...acc, val] : acc, []);

// Return the transposed matrix.
const transpose = (matrix) =>
  matrix[0].map((_, i) => matrix.map(row => row[i]));

// Partition an array by a given function, returns an object.
const partition = (fn, arr) =>
  arr.reduce((acc, item) => {
    let key = fn(item);
    if (!acc[key]) acc[key] = [];
    acc[key] = [...acc[key], item];
    return acc;
  }, {});

// Return an object containing the frequencies of each value in an array.
const freqs = (arr) =>
  arr.reduce((acc, item) => {
    acc[item] = acc[item] + 1 || 1;
    return acc;
  }, {});

// Return the percentage of an array equal to a given value.
const perc = (val, arr) =>
  arr.filter(item => item === val).length / arr.length;

// Return the shannon entropy of an array.
const entropy = (arr) => {
  let probs = values(freqs(arr)).map(n => n / arr.length);
  return probs.reduce((e, p) => e - p * Math.log(p), 0) * Math.LOG2E;
};

// Reduce a multi-dimensional array by a dimension.
const flatten = (arr) =>
  arr.reduce((acc, val) => acc.concat(val), []);

// Map over an array, then flatten it.
const flatMap = (arr, fn) =>
  flatten(arr.map(fn));

// Pack two arrays into one array.
const pack = (X, Y) =>
  X.map((x, i) => [x, Y[i]]);

// Unpack two arrays into an array of both arrays :-)
const unpack = (packed) =>
  packed.reduce(([X, Y], [x, y]) => [[...X, x], [...Y, y]], [[], []]);

// Return the max value of an array.
const max = (arr) =>
  Math.max(...arr);

// Return the values of an objects properties.
const values = (obj) =>
  Object.keys(obj).map(key => obj[key]);

// Return an object with a function applies to its values.
const map = (obj, fn) =>
  Object.keys(obj).reduce((acc, key) => {
    acc[key] = fn(obj[key], key);
    return acc;
  }, {});

// Return an empty array of a given size.
const empty = (size) =>
  Array(...Array(size));

// Return an array of indicies sampled from a given array.
const sample = (arr, perc = 0.75, replacement = true) => {
  let rand = () => Math.floor(Math.random() * arr.length);
  let arr = empty(Math.floor(arr.length * perc));

  // return indicies only!
  return arr.reduce(acc => {
    let i = rand();

    if (!replacement)
      while (!acc.indexOf(i)) i = rand();

    return [...acc, i];
  }, [])
};
