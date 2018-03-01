const { writeFileSync } = require('fs');
const os = require('os');
const { spawnSync } = require('child_process');
const { logSuccess, mapLocalPackages, parseVersion } = require('../util');

const typesAvailable = ['patch', 'minor', 'major'];

module.exports = bump;

function bump(type, cb) {
  if (!type || !typesAvailable.includes(type)) {
    return cb(`To bump, please, inform the bump type (-b option).`);
  }

  const newVersion = parseVersion(
    spawnSync('npm', ['version', type], { cwd: `${process.cwd()}`}).stdout.toString()
  );

  mapLocalPackages().then(localPackages => {
    localPackages.forEach(pkg => {
      updatePackageExtVersion(pkg, newVersion);
    });
  });

  logSuccess(`The ${type} bumping worked just fine. New version: ${newVersion}`);
  cb();
}

function updatePackageExtVersion(pkg, version) {
  const packageExt = require(`${process.cwd()}/${pkg}/package.ext.json`);
  writeFileSync(`${process.cwd()}/${pkg}/package.ext.json`, JSON.stringify({
    ...packageExt,
    version,
  }, null, 2) + os.EOL);
}
