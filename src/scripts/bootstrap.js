const { writeFileSync } = require('fs');
const { spawn } = require('child_process');
const { logError, logSuccess } = require('../util');

module.exports = bootstrap;

function bootstrap(pkg, cb) {
  if (!pkg) {
    return cb(`To bootstrap, please, inform the package name (-p option).`);
  }

  const packageTemplate = require(`${process.cwd()}/package.json`);
  const packageExt = require(`${process.cwd()}/${pkg}/package.ext.json`);

  delete packageTemplate.private;

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
    logError(data.toString());
  });

  install.on('close', (code) => {
    if (code === 0) {
      logSuccess(`${pkg} dependencies installed.`);
      cb();
    } else {
      cb(`Oooops, something went wrong while installing ${pkg} dependencies.`);
    }
  });
}
