const { writeFileSync, existsSync } = require('fs');
const { spawn, spawnSync } = require('child_process');
const { logError, logSuccess } = require('../util');

module.exports = bootstrap;

function bootstrap(pkg) {
  return new Promise((resolve, reject) => {
    if (!pkg) {
      return reject(`To bootstrap, please, inform the package name (-p option).`);
    }

    const packageTemplate = require(`${process.cwd()}/package.json`);
    const packageExt = require(`${process.cwd()}/${pkg}/package.ext.json`);

    delete packageTemplate.private;

    const defaultScripts = packageTemplate.scripts;
    const extScripts = packageExt.scripts;

    const { dependencies } = packageExt;

    const { devDependencies } = packageExt;

    writeFileSync(`${process.cwd()}/${pkg}/package.json`, JSON.stringify({
      ...packageTemplate,
      ...packageExt,
      scripts: {
        ...defaultScripts,
        ...extScripts,
      },
      dependencies,
      devDependencies,
    }));

    const install = spawn('npm', ['install'], { cwd: `${process.cwd()}/${pkg}`});
    console.log(`Installing ${pkg} dependencies.`);

    install.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    install.stderr.on('data', (data) => {
      logError(data.toString());
    });

    install.on('close', (code) => {
      if (code === 0) {
        linkParentBin(pkg, resolve, reject);
      } else {
        reject(`Oooops, something went wrong while installing ${pkg} dependencies.`);
      }
    });
  });
}

function linkParentBin(pkg, resolve, reject) {
  const destination = `${process.cwd()}/${pkg}/node_modules`;

  if (existsSync(`${destination}/.bin`)) return resolve();

  const parentBin = `${process.cwd()}/node_modules/.bin`;

  console.log(`Linking parent bin into ${pkg}.`);

  spawnSync('mkdir', ['-p', `${process.cwd()}/${pkg}/node_modules/`]);

  const linkParent = spawn('ln', ['-s', parentBin, destination], { cwd: `${process.cwd()}/${pkg}`});

  linkParent.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  linkParent.stderr.on('data', (data) => {
    logError(data.toString());
  });

  linkParent.on('close', (code) => {
    if (code === 0) {
      logSuccess(`Parent bin linked into ${pkg} successfully.`);
      resolve();
    } else {
      reject(`Oooops, something went wrong while linking parent bin into ${pkg}.`);
    }
  });
}
