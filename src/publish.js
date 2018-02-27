const fs = require('fs');
const { spawn } = require('child_process');
const util = require('./util');

module.exports = publish;

function publish() {
  const typesAvailable = ['patch', 'minor', 'major'];
  const type = process.argv[3];
  if (!type || !typesAvailable.includes(type)) {
    console.log('To publish a new version, choose one of the following types: patch, minor, major.');
    process.exit(1);
  }

  util.mapLocalPackages().then(localPackages => {
    localPackages.forEach((pkg) => {
      const bump = spawn('npm', ['version', type], { cwd: `${process.cwd()}/${pkg}`});

      bump.stdout.on('data', (data) => {
        console.log(data.toString());
      });

      bump.stderr.on('data', (data) => {
        console.error(data.toString());
      });

      bump.on('close', (code) => {
        if (code === 0) {
          console.log(`Bumped ${pkg}.`);
          const publish = spawn('npm', ['publish'], { cwd: `${process.cwd()}/${pkg}`});

          publish.stdout.on('data', (data) => {
            console.log(data.toString());
          });

          publish.stderr.on('data', (data) => {
            console.error(data.toString());
          });

          publish.on('close', (code) => {
            console.log(`Published new ${pkg} version.`);
          });
        }
      });
    });
  });
}
