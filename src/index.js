#! /usr/bin/env node

const commandLineArgs = require('command-line-args');
const { logOnError } = require('./util');

const bootstrap = require('./scripts/bootstrap');
const bump = require('./scripts/bump');

const argsDefinitions = [
  { name: 'run', alias: 'r', type: String, defaultOption: true },
  { name: 'packages', alias: 'p', type: String, multiple: true },
  { name: 'bumpType', alias: 'b', type: String },
  { name: 'dependency', alias: 'd', type: String },
  { name: 'script', alias: 's', type: String },
];

const args = commandLineArgs(argsDefinitions);

switch (args.run) {
  case 'bootstrap':
    return args.packages.forEach((pkg) => {
      bootstrap(pkg, logOnError);
    });
  case 'bump':
    return args.packages.forEach((pkg) => {
      bump(pkg, args.bumpType, logOnError);
    });
  default:
    console.log('Unknown option');
    process.exit(1);
}
