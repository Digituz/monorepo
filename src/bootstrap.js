const { writeFileSync } = require('fs');
const { spawn } = require('child_process');
const util = require('./util');

module.exports = bootstrap;

function bootstrap(pkg, cb) {
  if (!pkg) {
    util.mapLocalPackages().then(localPackages => {
      localPackages.forEach(mergeDefinitionAndInstall);
    });
    return;
  }
  mergeDefinitionAndInstall(pkg, cb);
}

const mergeDefinitionAndInstall = (pkg, cb) => {
  const packageTemplate = require(`${process.cwd()}/package.json`);
  const packageExt = require(`${process.cwd()}/${pkg}/package.ext.json`);

  const defaultScripts = packageTemplate.scripts;
  const extScripts = packageExt.scripts;

  const defaultDependencies = packageTemplate.dependencies;
  const extDependencies = packageExt.dependencies;

  const defaultDevDependencies = packageTemplate.devDependencies;
  const extDevDependencies = packageExt.devDependencies;

  writeFileSync(`${process.cwd()}/${pkg}/package.json`, JSON.stringify({
    ...packageTemplate,
    ...packageExt,
    scripts: {
      ...defaultScripts,
      ...extScripts,
    },
    dependencies: {
      ...defaultDependencies,
      ...extDependencies,
    },
    devDependencies: {
      ...defaultDevDependencies,
      ...extDevDependencies,
    }
  }));

  const install = spawn('npm', ['install'], { cwd: `${process.cwd()}/${pkg}`});
  console.log(`Installing ${pkg} dependencies.`);

  install.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  install.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  install.on('close', (code) => {
    if (code === 0) {
      console.log(`${pkg} dependencies installed.`);
      if (cb && typeof cb === 'function') cb();
    } else {
      console.log(`Oooops, something went wrong while installing ${pkg} dependencies.`);
    }
  });
};
