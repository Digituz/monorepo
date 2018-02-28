#! /usr/bin/env node

const { spawn } = require('child_process');

const bootstrap = require('./bootstrap');
const dev = require('./dev');
// const install = require('./install');
const publish = require('./publish');
const test = require('./test');
const run = require('./run');

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
