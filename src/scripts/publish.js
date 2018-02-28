const { spawn } = require('child_process');

module.exports = publish;

function publish(pkg, cb) {
  if (!pkg) {
    return cb(`To publish, please, inform the package name (-p option).`);
  }

  console.log(`Publishing new ${pkg} version.`);

  const publish = spawn('npm', ['publish'], {cwd: `${process.cwd()}/${pkg}`});

  publish.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  publish.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  publish.on('close', (code) => {
    if (code === 0) {
      console.log(`Published new ${pkg} version.`);
      cb();
    } else {
      cb(`An error occurred while publishing new ${pkg} version. Please, check logs.`);
    }
  });
}
