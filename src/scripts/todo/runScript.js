const { spawn } = require('child_process');
const bootstrap = require('../bootstrap');

module.exports = runScript;

function runScript(pkg, script, cb) {
  if (!pkg || !script) {
    return cb(`To run a script you must issue 'monorepo --run script --package some-pkg --script some-script'.`);
  }

  bootstrap(pkg, () => {
    const runCommand = spawn('npm', ['run', command], { cwd: `${process.cwd()}/${pkg}`});
    console.log(`Running ${command} on ${pkg}.`);

    runCommand.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    runCommand.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    runCommand.on('close', (code) => {
      if (code === 0) {
        console.log(`The ${command} command ran successfully on ${pkg}.`);
      } else {
        console.log(`Oooops, something went wrong while running ${command} on ${pkg}.`);
      }
    });
  });
}
