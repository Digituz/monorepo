const { spawn, spawnSync } = require('child_process');
const { logError, logSuccess, mapLocalPackages } = require('../util');

module.exports = clean;

function clean() {
  spawnSync('rm', ['-rf', 'node_modules'], { cwd: `${process.cwd()}`});

  mapLocalPackages().then(packages => {
    let pkgsCleaned = 0;
    let calledback = false;

    packages.forEach(pkg => {
      const rmFiles = spawn('rm', ['-rf', 'package.json', 'node_modules'], { cwd: `${process.cwd()}/${pkg}`});

      rmFiles.stdout.on('data', (data) => {
        console.log(data.toString());
      });

      rmFiles.stderr.on('data', (data) => {
        logError(data.toString());
      });

      rmFiles.on('close', (code) => {
        if (code === 0) {
          logSuccess(`Finished cleaning ${pkg}.`);
        } else {
          logError(`Oooops, something went wrong while cleaning ${pkg}.`);
        }
      });
    });
  });
}
