# generator-python-package [![Build Status](https://secure.travis-ci.org/heynemann/generator-python-package.png?branch=master)](https://travis-ci.org/heynemann/generator-python-package)

> [Yeoman](http://yeoman.io) generator for python packages.


## Getting Started

Make sure you have the latest version of [Yeoman](http://yeoman.io):

```bash
$ npm install -g yo
```

To install generator-python-package from npm, run:

```bash
$ npm install -g generator-python-package
```

Finally, initiate the generator:

```bash
$ yo python-package
```

## Current features

* Allows selection of supported python versions (2.6, 2.7, 3.2, 3.3, 3.4, pypy);
* Uses [nosetests](https://nose.readthedocs.org/en/latest/) to run your tests;
* Creates base class for tests;
* Uses and configures [coverage](http://nedbatchelder.com/code/coverage/) for test coverage;
* Uses [preggy](http://heynemann.github.io/preggy/) for expectations;
* Uses [tox](http://tox.readthedocs.org/en/latest/) to run tests against all the supported python versions;
* Allows selections of services your app requires (currently supported: mongodb and redis);
* Sets up a setup.py file with all the collected information and test dependencies;
* Creates [travis.yml](http://travis-ci.org) file that runs tests;
* Creates Makefile to support all the above features.

## Makefile

To list available tasks, just run:

```bash
$ make list
```

To setup a new virtualenv:

```bash
$ make setup
```

To run your tests:

```bash
$ make test
```

## DISCLAIMER

The above tools are my personal preferences and the ones I like to work with.

If you feel any of those can be replaced by a different tool, feel free to make a pull request adding a wizard step to select the tool. Just make sure to keep compatibility with the one already in place.
