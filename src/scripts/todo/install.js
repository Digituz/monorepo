const util = require('../../util');
const installExternalPackage = require('./install-external');

const command = process.argv[2];
const pkg = process.argv[3];
const destinationPkg = process.argv[4];

function install() {
  if (!command || command !== 'install' ||
    !pkg || !destinationPkg) {
    console.error('To use this script, type: monorepo install some-pkg destination-pkg');
    process.exit(1);
  }

  util.mapLocalPackages().then(localPackages => {
    const destinationPackageExists = localPackages.includes(destinationPkg);
    if (!destinationPackageExists) {
      console.error('To use this script, type: monorepo install some-pkg destination-pkg');
      process.exit(1);
    }

    const installingLocalPackage = localPackages.includes(pkg);
    if (!installingLocalPackage) {
      installExternalPackage(pkg, destinationPkg);
    } else {
      installInternalPackage(pkg, destinationPkg);
    }
  });
}
