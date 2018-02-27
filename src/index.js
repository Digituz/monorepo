#! /usr/bin/env node

const { spawn } = require('child_process');

const dev = require('./dev');
const install = require('./install');
const publish = require('./publish');
const test = require('./test');

const command = process.argv[2];

switch (command) {
  case 'install':
    return install();
  case 'dev':
    return dev();
  case 'publish':
    return publish();
  case 'test':
    return test();
  default:
    console.log('Unknown option');
    process.exit(1);
}
