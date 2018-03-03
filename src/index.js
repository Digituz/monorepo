#! /usr/bin/env node

const commandLineArgs = require('command-line-args');
const { logOnError, mapLocalPackages } = require('./util');

const bootstrap = require('./scripts/bootstrap');
const bump = require('./scripts/bump');
const clean = require('./scripts/clean');
const link = require('./scripts/link');
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
      Promise.all(packages.map(bootstrap)).catch(logOnError);
      break;
    case 'bump':
      Promise.all(packages.map(bootstrap)).then(() => {
        bump(args.bumpType, logOnError);
      });
      break;
    case 'clean':
      return clean();
    case 'link':
      Promise.all(packages.map(bootstrap)).then(() => {
        packages.forEach(pkg => link(pkg, logOnError));
      });
      break;
    case 'publish':
      Promise.all(packages.map(bootstrap)).then(() => {
        packages.forEach(pkg => publish(pkg, logOnError));
      });
      break;
    case 'runScript':
      Promise.all(packages.map(bootstrap)).then(() => {
        packages.forEach(pkg => runScript(pkg, args.runScript, logOnError));
      });
      break;
    case 'test':
      Promise.all(packages.map(bootstrap)).then(() => {
        packages.forEach(pkg => test(pkg, logOnError));
      });
      break;
    default:
      console.log('Unknown option');
      process.exit(1);
  }
}
