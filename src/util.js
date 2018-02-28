const fs = require('fs');

module.exports = {
  exitOnError,
  logOnError,
  mapLocalPackages,
};

function exitOnError(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
}

function logOnError(err) {
  if (err) {
    console.error(err);
  }
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
