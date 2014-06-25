# generator-python-package [![Build Status](https://secure.travis-ci.org/heynemann/generator-python-package.png?branch=master)](https://travis-ci.org/heynemann/generator-python-package)

> [Yeoman](http://yeoman.io) generator for python packages.


## Getting Started

Make sure you have the latest version of [Yeoman](http://yeoman.io):

```bash
$ npm install -g yeoman
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

* Allows selection of supported python versions;
* Uses nosetests to run your tests;
* Creates base class for tests;
* Uses and configures coverage for test coverage;
* Uses preggy for expectations;
* Uses tox to run all your tests;
* Allows selections of services your app requires (currently supported: mongodb and redis);
* Sets up a setup.py file with all the collected information and test dependencies;
* Creates travis.yml file that runs tests;
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
