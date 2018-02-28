#! /usr/bin/env node

const commandLineArgs = require('command-line-args');
const { logOnError, mapLocalPackages } = require('./util');

const bootstrap = require('./scripts/bootstrap');
const bump = require('./scripts/bump');
const clean = require('./scripts/clean');
const publish = require('./scripts/publish');
const runScript = require('./scripts/runScript');
const test = require('./scripts/test');

const argsDefinitions = [
  { name: 'command', alias: 'c', type: String, defaultOption: true },
  { name: 'packages', alias: 'p', type: String, multiple: true },
  { name: 'bumpType', alias: 'b', type: String },
  { name: 'dependency', alias: 'd', type: String },
  { name: 'runScript', alias: 'r', type: String },
];

const args = commandLineArgs(argsDefinitions);

if (args.packages) {
  executeCommand(args.command, args.packages, args);
} else {
  mapLocalPackages().then(localPackages => {
    executeCommand(args.command, localPackages, args);
  });
}

function executeCommand(command, packages, args) {
  switch (command) {
    case 'bootstrap':
      return packages.forEach((pkg) => {
        bootstrap(pkg, logOnError);
      });
    case 'bump':
      return packages.forEach((pkg) => {
        bootstrap(pkg, (err) => {
          if (!err) {
            bump(pkg, args.bumpType, logOnError);
          }
        });
      });
    case 'clean':
      return clean();
    case 'publish':
      return packages.forEach((pkg) => {
        bootstrap(pkg, (err) => {
          if (!err) {
            publish(pkg, logOnError);
          }
        });
      });
    case 'runScript':
      return packages.forEach((pkg) => {
        bootstrap(pkg, (err) => {
          if (!err) {
            runScript(pkg, args.runScript, logOnError);
          }
        });
      });
    case 'test':
      return packages.forEach((pkg) => {
        bootstrap(pkg, (err) => {
          if (!err) {
            test(pkg, logOnError);
          }
        });
      });
    default:
      console.log('Unknown option');
      process.exit(1);
  }
}
