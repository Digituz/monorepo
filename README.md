## Monorepos

This NPM package contains a CLI (Command Line Interface) that helps developers managing [monorepos](https://medium.com/@maoberlehner/monorepos-in-the-wild-33c6eb246cb9). Before creating this NPM package, we have tried `lerna` and another secondary tool. None of them solved the problem the way we expected and we had a hard time trying to integrating them with CI/CD tools like Travis. Hence, we have created this package.

### Usage

First of all, you will need to install this package:

```bash
npm i -D @digituz/monorepo
```

After that, you can start using the `monorepo` CLI. For now, the available options are:

* `bootstrap`: Iterates over internal packages creating the `package.json` file and install their dependencies.
* `dev`: This option watches for changes on `src` directories and generates distribution artifacts by calling the `prepublishOnly` script.
* `install`: This option checks if the desired package belongs to the current monorepo and, if so, installs and links it into the desntination package.
* `publish`: This option takes another argument (must be `patch`, `minor`, or `major`) and bumps internal packages accordingly. After that, it publishes the new versions.
* `run`: This option run a command (first argument after `run`) on an internal package (second argument after `run`).
* `test`: This option goes through all internal packages and run `npm test` on them.

Here, you can see a few examples on how to use it:

```bash
# start the development option in the background
monorepo dev

# install axios (external package) into Input (internal package)
monorepo install axios Input
```
