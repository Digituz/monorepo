const { spawn } = require('child_process');
const { logError, logSuccess } = require('../util');

module.exports = link;

function link(pkg) {
  return new Promise((resolve, reject) => {
    if (!pkg) {
      return reject(`To link, please, inform the package name (-p option).`);
    }

    const linking = spawn('npm', ['link'], { cwd: `${process.cwd()}/${pkg}`});
    console.log(`Linking ${pkg}.`);

    linking.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    linking.stderr.on('data', (data) => {
      logError(data.toString());
    });

    linking.on('close', (code) => {
      if (code === 0) {
        logSuccess(`Linked ${pkg} successfully.`);
        resolve();
      } else {
        reject(`Oooops, something went wrong while linking ${pkg}.`);
      }
    });
  });
}
