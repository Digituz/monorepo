const fs = require('fs');

module.exports = {
  mapLocalPackages,
};

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
