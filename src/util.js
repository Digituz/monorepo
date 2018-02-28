const fs = require('fs');

module.exports = {
  exitOnError,
  logError,
  logOnError,
  logSuccess,
  mapLocalPackages,
};

function exitOnError(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
}

function logError(text) {
  console.log('\x1b[31m%s\x1b[0m', text);
}

function logOnError(err) {
  if (err) {
    logError(err);
  }
}

function logSuccess(text) {
  console.log('\x1b[32m%s\x1b[0m', text);
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
