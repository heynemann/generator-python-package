'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var sys = require('sys')
var exec = require('child_process').exec;

var userEmail = null;
var userName = null;

function getUserNameAndEmail(callback) {
  // executes `pwd`
  var cmd = "git config --global user.email"
  var child = exec(cmd, function (error, stdout, stderr) {
    if (error == null) {
      userEmail = stdout.replace('\n', '');
    }

    cmd = "git config --global user.name"
    child = exec(cmd, function (error, stdout, stderr) {
      if (error == null) {
        userName = stdout.replace('\n', '');
      }

      callback();
    });
  });
}

function guessPackageURL(answers) {
  var emailParts = answers.authorEmail.split('@');
  if (emailParts.length > 1) {
    return 'https://github.com/' + emailParts[0] + '/' + answers.packageName
  }
  return 'https://github.com/someuser/somepackage';
}

function escapeQuotes(answer) {
  return answer.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

var currentPath = path.basename(process.cwd());

var PythonPackageGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');
  },

  askFor: function (mute, callback) {
    var done = this.async();

    if (!mute) {
      this.log(yosay('Welcome to the python package generator\nRun this generator in the folder where your app will be created'));
    }

    var pythonVersions = [
      { name: "Python 2.6", value: "2.6@py26@Python :: 2.6", checked: false },
      { name: "Python 2.7", value: "2.7@py27@Python :: 2.7", checked: true },
      { name: "Python 3.2", value: "3.2@py32@Python :: 3.2", checked: false },
      { name: "Python 3.3", value: "3.3@py33@Python :: 3.3", checked: false },
      { name: "Python 3.4", value: "3.4@py34@Python :: 3.4", checked: true },
      { name: "PyPy", value: "pypy@pypy@Python :: Implementation :: PyPy", checked: true },
    ];

    var services = [
      { name: "Redis", value: "redis", checked: false },
      { name: "MongoDB", value: "mongodb", checked: false }
    ];

    getUserNameAndEmail(function() {
      var prompts = [{
        type: 'input',
        name: 'packageName',
        message: 'Python package name (the name that will be used when sending to pypi):',
        default: currentPath
      }, {
        type: 'input',
        name: 'authorName',
        message: 'Package author name',
        default: userName,
        filter: escapeQuotes
      }, {
        type: 'input',
        name: 'authorEmail',
        message: 'Package author email',
        default: userEmail
      }, {
        type: 'checkbox',
        name: 'pythonVersions',
        message: 'Package supported python versions',
        choices: pythonVersions
      }, {
        type: 'input',
        name: 'version',
        message: 'Package initial version',
        default: '0.1.0'
      }, {
        type: 'input',
        name: 'description',
        message: 'Package description (please be sure to update long_description in setup.py later):',
        default: 'an incredible python package',
        filter: escapeQuotes
      }, {
        type: 'input',
        name: 'keywords',
        message: 'Package keywords (space separated keywords):',
        filter: escapeQuotes
      }, {
        type: 'input',
        name: 'url',
        message: 'Package url (this url gets included in pypi):',
        default: 'https://github.com/someuser/somepackage'
      }, {
        type: 'input',
        name: 'license',
        message: 'Package license:',
        default: 'MIT',
        filter: escapeQuotes
      }, {
        type: 'confirm',
        name: 'packageData',
        message: 'Include package data',
        default: false
      }, {
        type: 'confirm',
        name: 'packageTests',
        message: 'Include tests to package',
        default: false
      }, {
        type: 'checkbox',
        name: 'services',
        message: 'Services you need to run',
        choices: services
      }];

      this.prompt(prompts, function (props) {
        var versions = [];
        var travis = [];
        var troves = [];

        for (var i=0; i < props.pythonVersions.length; i++) {
          var parts = props.pythonVersions[i].split('@');
          travis.push(parts[0]);
          versions.push(parts[1]);
          troves.push("Programming Language :: " + parts[2]);
        }

        var pkgServices = {
          mongodb: false,
          redis: false
        };
        for (var i=0; i < props.services.length; i++) {
          switch (props.services[i]) {
            case "mongodb": {
              pkgServices.mongodb = true;
              break;
            }
            case "redis": {
              pkgServices.redis = true;
              break;
            }
          }
        }

        var pythonPackageName = props.packageName.replace(/(\s|-)+/g, '_');

        this.package = {
          name: props.packageName,
          pythonName: pythonPackageName,
          author: {
            name: props.authorName,
            email: props.authorEmail
          },
          description: props.description,
          keywords: props.keywords,
          version: props.version,
          pythonVersions: versions,
          travis: travis,
          troves: troves,
          url: props.url,
          license: props.license,
          includePackageData: props.packageData,
          includePackageTests: props.packageTests,
          created: {
            day: new Date().getDay(),
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear()
          },
          services: pkgServices
        };

        if (callback) {
          callback(this.package);
        } else {
          done();
        }
      }.bind(this));
    }.bind(this));
  },

  app: function (currentPkg) {
    var pkg = currentPkg || this.package;
    this.mkdir(pkg.pythonName);
    this.mkdir('tests/');

    // root
    this.template('_setup.py', 'setup.py');
    this.template('_makefile', 'Makefile');
    this.template('_coveragerc', '.coveragerc');
    this.template('_tox.ini', 'tox.ini');
    this.template('_gitignore', '.gitignore');
    this.template('_travis.yml', '.travis.yml');

    if (!pkg.includePackageTests) {
      this.template('_manifest.in', 'MANIFEST.in');
    }

    if (pkg.services.redis) {
      this.template('_redis.conf', 'redis.conf');
      this.template('_redis_tests.conf', 'redis.tests.conf');
    }

    // pkg.name/
    this.template('_root_init.py', pkg.pythonName + '/__init__.py');
    this.template('_version.py', pkg.pythonName + '/version.py');

    // tests/
    this.template('_init.py', 'tests/__init__.py');
    this.template('_test_base.py', 'tests/base.py');
    this.template('_test_version.py', 'tests/test_version.py');
  },

  getUsageMessage: function() {
    var pkg = this.package;
    this.log("\n\nNow that your project is all created, here is what the make commands can do for you!\n");
    this.log("General commands:");
    this.log('* "make list" to list all available targets;');

    this.log('* "make setup" to install all dependencies (do not forget to create a virtualenv first);');
    this.log('* "make test" to test your application (tests in the tests/ directory);');

    if (pkg.services.redis) {
      this.log("\nRedis commands:");
      this.log('* "make redis" to get a redis instance up (localhost:4444);');
      this.log('* "make kill-redis" to kill this redis instance (localhost:4444);');
      this.log('* "make redis-test" to get a redis instance up for your unit tests (localhost:4448);');
      this.log('* "make kill-redis-test" to kill the test redis instance (localhost:4448);');
    }

    if (pkg.services.mongodb) {
      this.log("\nMongoDB commands:");
      this.log('* "make mongo" to get a mongodb instance up (localhost:3333);');
      this.log('* "make kill-mongo" to kill this mongodb instance (localhost:3333);');
      this.log('* "make clear-mongo" to clear all data in this mongodb instance (localhost: 3333);');
      this.log('* "make mongo-test" to get a mongodb instance up for your unit tests (localhost:3334);');
      this.log('* "make kill-mongo-test" to kill the test mongodb instance (localhost: 3334);');
    }

    this.log('* "make tox" to run tests against all supported python versions.');
  },

});

module.exports = PythonPackageGenerator;
