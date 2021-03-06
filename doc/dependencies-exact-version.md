# Dependencies version

## Overview

This plugin will check if all your dependencies has an exact version.

Since version 2.6, the plugin will:
- check if you use a package-lock.json
- if yes => then this task is considered as successful
- if no => check all dependencies version in order to find range version

If you don't use package-lock.json, then you should avoid symbole like "^" or "~".


## Reasons for failure
This plugin will fail if at least one depencencies as a range version.

You can also include dev dependencies (exluded by default).

## Command
```bash
qualscan --tasks dependencies-exact-version
```

Check dev dependencies
```bash
qualscan --tasks dependencies-exact-version -cdd
```

## External documentation

[See NPM official documentation](https://docs.npmjs.com/cli/v6/configuring-npm/package-json#dependencies)

## Details

**Bad**

```json
"dependencies": {
    "@skypack/package-check": "~0.2.2",
    "jscpd": "^3.3.22",
    "ora": "*",
    "semver": ">=1.0.0",
    "yargs": ">=15.0.0 <=16.0.0"
}
```

**Good**

```json
"dependencies": {
    "@skypack/package-check": "0.2.2",
    "jscpd": "3.3.22",
    "ora": "5.1.0",
    "semver": "7.3.4",
    "yargs": "16.2.0"
}
```

## How to fix?

- Use a package-lock.json

OR

- Install dependencies with `save-exact`

Install exact version with command line
```bash
npm install myPackage --save-exact
```

Or with .npmrc file.
```json
save=true
save-exact=true
```