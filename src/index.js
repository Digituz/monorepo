#! /usr/bin/env node

const fs = require('fs');
const { spawn } = require('child_process');
const watch = require('watch');

const command = process.argv[2];
const pkg = process.argv[3];
const destinationPkg = process.argv[4];

switch (command) {
  case 'install':
    return install();
  case 'dev':
    return dev();
  default:
    console.log('Unknown option');
    process.exit(1);
}

function install() {
  if (!command || command !== 'install' ||
    !pkg || !destinationPkg) {
    console.error('To use this script, type: node src/monorepo install some-pkg destination-pkg');
    process.exit(1);
  }

  mapLocalPackages().then(localPackages => {
    const destinationPackageExists = localPackages.includes(destinationPkg);
    if (!destinationPackageExists) {
      console.error('To use this script, type: node src/monorepo install some-pkg destination-pkg');
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

function mapLocalPackages() {
  return new Promise((resolve) => {
    let pointers = fs.readdirSync(process.cwd());

    pointers = pointers.filter((pointer) => {
      const stat = fs.lstatSync(`${process.cwd()}/${pointer}`);
      if (stat.isDirectory() && pointer !== 'node_modules') {
        return pointer;
      }
      return null;
    });

    resolve(pointers);
  });
}

function installInternalPackage(pkg, destinationPkg) {
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
}

function installExternalPackage(pkg, destinationPkg) {
  const install = spawn('npm', ['install', pkg], { cwd: `${process.cwd()}/${destinationPkg}`});

  install.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  install.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  install.on('close', (code) => {
    if (code === 0) {
      console.log('External package properly installed.');
    }
  });
}

function dev() {
  mapLocalPackages().then(localPackages => {
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
  console.log(`Generating dist for ${pkg}`);
  const generate = spawn('npm', ['run', 'prepublishOnly'], { cwd: `${process.cwd()}/${pkg}`});

  generate.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  generate.on('close', (code) => {
    if (code === 0) {
      console.log(`Done generating dist for ${pkg}`);
    }
  });
}
