# random jungle

Little [Random Forest](https://en.wikipedia.org/wiki/Random_forest) implementation in ES6 JavaScript.

*A work in progress...*

## todo list

* [x] tests for CART
* [x] tests for random jungle
* [ ] regression support for CART, random jungle
* [ ] extract data formatting functions into utils.js
* [x] publish npm
* [ ] web demo/visualization
* [ ] cross-validation function
* [ ] task to build distribution version
* [ ] api documentation

# install, tests, demo
```
# install
$ npm install random-jungle

# run tests
$ make test

# run demo (classify irises)
$ make demo
```

# notes

Attempting to write this in a very functional style, using strict jshint
linting, and generally following [this mozilla ES6 style
guide](https://github.com/mozilla/addon-sdk/wiki/Coding-style-guide).

Currently using the [Google Traceur
Compiler](https://github.com/google/traceur-compiler) for transpiling ES6
JavaScript.

# license

MIT
