var traceur = require('traceur');
traceur.options.experimental = true;
traceur.require.makeDefault(function(filename) {
  // don't transpile our dependencies, just our app
  return filename.indexOf('node_modules') === -1;
});

module.exports = {
  utils: require('./src/utils'),
  CART: require('./src/cart'),
  randomJungle: require('./src/random_jungle')
};
