## Monorepos

This NPM package contains a CLI (Command Line Interface) that helps developers managing
[monorepos](https://medium.com/@maoberlehner/monorepos-in-the-wild-33c6eb246cb9). Before creating
this NPM package, we have tried `lerna` and FormidableLabs/builder. None of them solved the problem
the way we expected and we had a hard time trying to integrating them with CI/CD tools like Travis.
Hence, we have created this package.

### Usage

First of all, you will need to install this package:

```bash
npm i -D @digituz/monorepo
```

After that, you can start using the `monorepo` CLI. For now, the available options are:

* `bootstrap`: Merges the main `package.json` file with the `package.ext.json` file
provided by the package and installs dependencies.
* `bump`: Takes the bump type (must be `patch`, `minor`, or `major`) and bumps the package accordingly.
* `clean`: Removes main `node_modules` directory and then removes `node_modules` and `package.json` from internal packages.
* `publish`: Publishes new versions to NPM.
* `runScript`: Runs a script on one or more internal packages.
* `test`: Runs `npm test` on one or more internal packages.

Here, you can see a few examples on how to use it:

```bash
# runs tests for all packages
monorepo test

# runs tests for a single package called Button
monorepo test -p Button

# runs a minor bump to Input and Button
monorepo bump -p Button Input -b minor
```
