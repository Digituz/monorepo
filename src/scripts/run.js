const { spawn } = require('child_process');
const bootstrap = require('./bootstrap');

const command = process.argv[3];
const pkg = process.argv[4];

module.exports = run;

function run() {
  if (!command || !pkg) {
    return console.log(`To run a command you must issue 'monorepo run some-command some-pkg'.`);
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
