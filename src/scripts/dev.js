const watch = require('watch');
const { spawn } = require('child_process');
const util = require('../util');

module.exports = dev;

function dev() {
  util.mapLocalPackages().then(localPackages => {
    localPackages.forEach((pkg) => {
      generateDists(pkg);
      watch.createMonitor(`${process.cwd()}/${pkg}/src`, (monitor) => {
        monitor.on("changed", () => {
          generateDists(pkg);
        });
      })
    });
  });
}

function generateDists(pkg) {
  console.log(`Generating artifacts for ${pkg}`);
  const generate = spawn('npm', ['run', 'prepublishOnly'], { cwd: `${process.cwd()}/${pkg}`});

  generate.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  generate.on('close', (code) => {
    if (code === 0) {
      console.log(`Done generating artifacts for ${pkg}`);
    }
  });
}
