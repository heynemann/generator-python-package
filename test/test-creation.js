/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('python-package generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('python-package:app', [
        '../../app'
      ]);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      'setup.py',
      'Makefile',
      '.coveragerc',
      'tox.ini',
      '.gitignore',
      '.travis.yml',
      'MANIFEST.in',
      'redis.conf',
      'redis.tests.conf',
      'test_package/__init__.py',
      'test_package/version.py',
      'tests/__init__.py',
      'tests/base.py',
      'tests/test_version.py',
    ];

    helpers.mockPrompt(this.app, {
      packageName: 'test-package',
      pythonVersions: ['2.7@py27@Python :: 2.7'],
      services: ['mongodb', 'redis'],
    });

    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });

});
