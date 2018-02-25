const { spawn } = require('child_process');
const installExternalPackage = require('install-external');

module.exports = installInternalPackage;

function installInternalPackage(pkg, destinationPkg) {
  installExternalPackage(pkg, destinationPkg, (err) => {
    if (err) process.exit(1);

    const link = spawn('npm', ['link'], { cwd: `${process.cwd()}/${pkg}`});

    link.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    link.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    link.on('close', (code) => {
      if (code === 0) {
        console.log('Internal packaged linked successfully.');
        const pkgDescription = require(`${process.cwd()}/${pkg}/package.json`);

        const link2 = spawn('npm', ['link', pkgDescription.name], { cwd: `${process.cwd()}/${destinationPkg}`});

        link2.stdout.on('data', (data) => {
          console.log(data.toString());
        });

        link2.stderr.on('data', (data) => {
          console.error(data.toString());
        });

        link2.on('close', (code) => {
          console.log('Link process finished successfully.');
        });
      }
    });
  });
}
