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

      this.app = helpers.createGenerator('python-package:app', ['../../app']);
      done();

      this.app.options['skip-install'] = true;

      helpers.mockPrompt(this.app, {
        packageName: 'test-package',
        pythonVersions: ['2.7@py27@Python :: 2.7'],
        description: 'an incredible python package',
        keywords: 'test package',
        authorName: 'Pablo Santiago Blum de Aguiar',
        authorEmail: 'scorphus@gmail.com',
        url: 'https://github.com/someuser/somepackage',
        license: 'MIT',
        services: ['mongodb', 'redis'],
      });
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

    this.app.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });

  it('creates Makefile with right targets files', function (done) {
    this.app.run({}, function () {
      helpers.assertFileContent('Makefile', /list:/);
      helpers.assertFileContent('Makefile', /no_targets__:/);
      helpers.assertFileContent('Makefile', /setup:/);
      helpers.assertFileContent('Makefile', /test:/);
      helpers.assertFileContent('Makefile', /unit:/);
      helpers.assertFileContent('Makefile', /redis:/);
      helpers.assertFileContent('Makefile', /kill_redis:/);
      helpers.assertFileContent('Makefile', /redis_test:/);
      helpers.assertFileContent('Makefile', /kill_redis_test:/);
      helpers.assertFileContent('Makefile', /mongo:/);
      helpers.assertFileContent('Makefile', /kill_mongo:/);
      helpers.assertFileContent('Makefile', /clear_mongo:/);
      helpers.assertFileContent('Makefile', /mongo_test:/);
      helpers.assertFileContent('Makefile', /kill_mongo_test:/);
      helpers.assertFileContent('Makefile', /tox:/);
      done();
    });
  });

  it('creates setup.py with right elements', function (done) {
    this.app.run({}, function () {
      helpers.assertFileContent('setup.py', /from test_package import __version__/);
      helpers.assertFileContent('setup.py', /name='test-package',/);
      helpers.assertFileContent('setup.py', /    version=__version__,/);
      helpers.assertFileContent('setup.py', /    description='an incredible python package',/);
      helpers.assertFileContent('setup.py', /\nan incredible python package\n/);
      helpers.assertFileContent('setup.py', /    keywords='test package',/);
      helpers.assertFileContent('setup.py', /    author='Pablo Santiago Blum de Aguiar',/);
      helpers.assertFileContent('setup.py', /    author_email='scorphus@gmail.com',/);
      helpers.assertFileContent('setup.py', /    url='https:\/\/github.com\/someuser\/somepackage',/);
      helpers.assertFileContent('setup.py', /    license='MIT',/);
      helpers.assertFileContent('setup.py', /        'Programming Language :: Python :: 2.7',/);
      helpers.assertFileContent('setup.py', /    include_package_data=False,/);
      done();
    });
  });

});
