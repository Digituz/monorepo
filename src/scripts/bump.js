const { writeFileSync } = require('fs');
const os = require('os');
const { spawn } = require('child_process');
const { logError, logSuccess } = require('../util');

const typesAvailable = ['patch', 'minor', 'major'];

module.exports = bump;

function bump(pkg, type, cb) {
  if (!pkg || !type || !typesAvailable.includes(type)) {
    return cb(`To bump, please, inform the package name (-p option) and the bump type (-b option).`);
  }

  const bump = spawn('npm', ['version', type], { cwd: `${process.cwd()}/${pkg}`});

  bump.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  bump.stderr.on('data', (data) => {
    logError(data.toString());
  });

  bump.on('close', (code) => {
    if (code === 0) {
      updatePackageExtVersion(pkg);
      logSuccess(`The ${type} bumping on ${pkg} worked just fine.`);
      cb();
    } else {
      cb(`Something went wrong on the ${type} bumping of the ${pkg} package. Please, check logs above.`);
    }
  });
}

function updatePackageExtVersion(pkg) {
  const packageExt = require(`${process.cwd()}/${pkg}/package.ext.json`);
  const packageLock = require(`${process.cwd()}/${pkg}/package-lock.json`);
  writeFileSync(`${process.cwd()}/${pkg}/package.ext.json`, JSON.stringify({
    ...packageExt,
    version: packageLock.version
  }, null, 2) + os.EOL);
}
