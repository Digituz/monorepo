#! /usr/bin/env node

const { spawn } = require('child_process');

const bootstrap = require('./scripts/bootstrap');
const dev = require('./scripts/dev');
// const install = require('./install');
const publish = require('./scripts/publish');
const test = require('./scripts/test');
const run = require('./scripts/run');

const command = process.argv[2];

switch (command) {
  case 'bootstrap':
    return bootstrap();
  // case 'install':
  //   console.log(install);
  //   return install();
  case 'dev':
    return dev();
  case 'publish':
    return publish();
  case 'test':
    return test();
  case 'run':
    return run();
  default:
    console.log('Unknown option');
    process.exit(1);
}
