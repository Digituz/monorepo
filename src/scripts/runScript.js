const { spawn } = require('child_process');
const { logError, logSuccess } = require('../util');

module.exports = runScript;

function runScript(pkg, script, cb) {
  if (!pkg || !script) {
    return cb(`To run a script you must issue 'monorepo script -p some-pkg -s some-script'.`);
  }

  const running = spawn('npm', ['run', script], { cwd: `${process.cwd()}/${pkg}`});
  console.log(`Running ${script} on ${pkg}.`);

  running.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  running.stderr.on('data', (data) => {
    logError(data.toString());
  });

  running.on('close', (code) => {
    if (code === 0) {
      logSuccess(`The ${script} script ran successfully on ${pkg}.`);
      cb();
    } else {
      cb(`Oooops, something went wrong while running ${script} on ${pkg}.`);
    }
  });
}
