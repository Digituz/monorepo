const { spawn } = require('child_process');
const { logError, logSuccess } = require('../util');

module.exports = test;

function test(pkg, cb) {
  if (!pkg) {
    return cb(`To run test, please, inform the package name (-p option).`);
  }

  const npmTest = spawn('npm', ['test'], { cwd: `${process.cwd()}/${pkg}`});

  npmTest.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  npmTest.stderr.on('data', (data) => {
    logError(data.toString());
  });

  npmTest.on('close', (code) => {
    if (code === 0) {
      logSuccess(`${pkg} is good to go.`);
      cb();
    } else {
      cb(`Oooops, something went wrong while testing ${pkg}.`);
    }
  });
}
