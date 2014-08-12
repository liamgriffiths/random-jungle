bin = ./node_modules/.bin
src = ./src
tests = ./test

all: jshint

deps: $(bin)/mocha $(bin)/jshint

$(bin)/%:
	@npm install

jshint: deps
	@$(bin)/jshint $(tests) $(src)

test: deps
	@$(bin)/mocha --check-leaks -R spec --recursive $(tests)

clean:
	@rm -rf ./node_modules

.PHONY: test jshint clean demo
