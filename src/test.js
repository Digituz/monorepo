const fs = require('fs');
const { spawn } = require('child_process');
const util = require('./util');

module.exports = test;

function test() {
  util.mapLocalPackages().then(localPackages => {
    localPackages.forEach((pkg) => {
      const npmTest = spawn('npm', ['test'], { cwd: `${process.cwd()}/${pkg}`});

      npmTest.stdout.on('data', (data) => {
        console.log(data.toString());
      });

      npmTest.stderr.on('data', (data) => {
        console.error(data.toString());
      });

      npmTest.on('close', (code) => {
        if (code === 0) {
          console.log(`${pkg} is good to go.`);
        } else {
          console.log(`Oooops, something went wrong with ${pkg}.`);
        }
      });
    });
  });
}
