const CART = require('..').CART;
const RandomJungle = require('..').RandomJungle;
const { partition, pack, unpack, uniq, max } = require('..').utils;
const fs = require('fs');
const log = console.log;

// grab data from file
const parseCSV = (contents) =>
  contents.split(/\n/).filter(ok => ok).map(line => line.split(/,/)).slice(1);

const munge = (data) =>
  data.map(line => [line.slice(0, 3).map(val => +val), +line[4]]);

const getData = () => {
  let buffer = fs.readFileSync(__dirname + '/data/iris.csv');
  return munge(parseCSV(buffer.toString()));
};

const demoCART = (trainX, trainY, testSet) => {
  var tree = CART.create(trainX, trainY, labels);
  var [correct, incorrect] = [0, 0];
  testSet.forEach(function([x, y]) {
    let out = CART.predict(tree, x);
    labels.indexOf(y) === out.indexOf(max(out)) ? correct++ : incorrect++;
  });
  return [correct, incorrect, [trainX, trainY], testSet, tree];
};

const demoRandomJungle = (trainX, trainY, testSet) => {
  var jungle = RandomJungle.create(trainX, trainY, labels, 30);
  var [correct, incorrect] = [0, 0];
  testSet.forEach(function([x, y]) {
    let out = RandomJungle.predict(jungle, x);
    labels.indexOf(y) === out.indexOf(max(out)) ? correct++ : incorrect++;
  });

  return [correct, incorrect, [trainX, trainY], testSet, jungle];
};

const print = (name, correct, incorrect, trainingSet, testSet, source) => {
  log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
  log('Classifying Iris data using: %s', name);
  log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
  log('Training set size: %d', trainingSet[0].length);
  log('Test set size: %d', testSet.length);
  log('Correct: %d vs. Incorrect: %d', correct, incorrect);
  log('Percentage classified correctly: %d', correct / (correct + incorrect));
  log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
  // log('Model source:\n');
  // log(JSON.stringify(source));
  // log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
};

const data = getData();
const labels = uniq(data.map(([x, y]) => y));

// partition into test && training sets
var sets = partition(() => Math.random() > 0.25, data);
var [trainX, trainY] = unpack(sets[true]);
var testSet = sets[false];
print('CART decision tree', ...demoCART(trainX, trainY, testSet));
log('\n');
print('Random Jungle', ...demoRandomJungle(trainX, trainY, testSet));
log('\n');

