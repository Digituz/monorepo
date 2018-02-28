const { spawn } = require('child_process');

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
    console.error(data.toString());
  });

  bump.on('close', (code) => {
    if (code === 0) {
      console.log(`The ${type} bumping on ${pkg} worked just fine.`);
      cb(null);
    } else {
      cb(`Something went wrong on the ${type} bumping of the ${pkg} package. Please, check logs above.`);
    }
  });
}
