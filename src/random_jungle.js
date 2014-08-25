'use strict';

import {} from './utils';
import CART from './cart';

export {create, predict};

const {floor, random} = Math;

const create = (X, Y, labels, opts = {}) => {
};

const predict = (x) => {
};

const sample = (arr, perc = 0.75, replacement = true) => {
  let size = arr.length;
  let rand = () => floor(random() * size);
  let empty = Array(...Array(floor(size * perc)));

  let indicies = empty.reduce(acc => {
    let i = rand();

    if (!replacement)
      while (!acc.indexOf(i)) i = rand();

    return [...acc, i];
  }, [])

  return indicies.map(i => arr[i]);
};
