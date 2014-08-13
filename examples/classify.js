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
var [testX, testY] = unpack(sets[false]);


var tree = CART.create(trainX, trainY, labels);
// console.log(JSON.stringify(tree));

var correct = 0;
testX.map((x, i) => {
  console.log(x, testY[i]);
  let out = CART.predict(tree, x);
  let ok = labels.indexOf(testY[i]) === labels.indexOf(max(out));
  if (ok) correct++;
});

console.log(correct / testX.length);
