const CART = require('..').CART;
const { partition, pack, unpack, uniq, max } = require('..').utils;
const fs = require('fs');

// grab data from file
const parseCSV = (contents) =>
  contents.split(/\n/).filter(ok => ok).map(line => line.split(/,/)).slice(1);

const munge = (data) =>
  data.map(line => [line.slice(0, 3).map(val => +val), +line[4]]);

const getData = () => {
  let buffer = fs.readFileSync(__dirname + '/data/iris.csv');
  return munge(parseCSV(buffer.toString()));
};

const data = getData();
const labels = uniq(data.map(([x, y]) => y));

// partition into test && training sets
var sets = partition(() => Math.random() > 0.25, data);
var [trainX, trainY] = unpack(sets[true]);
var testSet = sets[false];

var tree = CART.create(trainX, trainY, labels);
console.log(JSON.stringify(tree));

var [correct, incorrect] = [0, 0];
testSet.forEach(function([x, y]) {
  let out = CART.predict(tree, x);
  if (labels.indexOf(y) === out.indexOf(max(out))) {
    correct++;
  } else {      
    incorrect++;
  }
});
console.log(correct / (correct  + incorrect));
