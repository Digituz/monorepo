const { spawn } = require('child_process');

module.exports = installExternalPackage;

function installExternalPackage(pkg, destinationPkg, cb) {
  const install = spawn('npm', ['install', pkg], { cwd: `${process.cwd()}/${destinationPkg}`});

  install.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  install.stderr.on('data', (data) => {
    console.error(data.toString());
    cb(data.toString());
  });

  install.on('close', (code) => {
    if (code === 0) {
      console.log('External package properly installed.');
      cb(null);
    }
    cb(code);
  });
}
