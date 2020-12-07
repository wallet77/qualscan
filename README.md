# Qualscan = Quality Scanner

[![GitHub release](https://badge.fury.io/js/qualscan.svg)](https://github.com/wallet77/qualscan/releases/)
[![GitHub license](https://img.shields.io/github/license/wallet77/qualscan)](https://github.com/wallet77/qualscan/blob/master/LICENSE)
[![CI pipeline](https://github.com/wallet77/qualscan/workflows/Node.js%20CI/badge.svg)](https://github.com/wallet77/qualscan/actions?query=workflow%3A%22Node.js+CI%22)
[![Code coverage](https://codecov.io/gh/wallet77/qualscan/branch/main/graph/badge.svg)](https://codecov.io/gh/wallet77/qualscan)

![Qualscan example](https://github.com/wallet77/qualscan/blob/main/examples/run_qualscan.gif)

# Purpose

A CLI tool to run multiples plugins in order to check the quality of your project.
For example it can run:
- security audit of your dependencies
- check dependencies updates
- check code duplications
- and more

This tool will basically returns 1 if, at least, one task has failed, otherwise it returns 0.


# Compatibility

**/!\ This module use async/await syntax and the inspector module, this is why you must have node 8.0+.**

Supported and tested : >= 8.0

| Version       | Supported     | Tested         |
|:-------------:|:-------------:|:--------------:|
| 14.x          | yes           | yes            |
| 12.x          | yes           | yes            |
| 10.x          | yes           | yes            |

# Installation

```console
$ npm install qualscan -g
```

or

```console
$ npm install qualscan --save
```

# Usage

```console
$ qualscan
```

## Options

**Display all existing options**

```console
$ qualscan -h
```

**Run only a set of tasks**

```console
$ qualscan --tasks npm_audit npm_outdated
```

**Run only a set of scripts**

```console
$ qualscan --scripts test
```

**Display tasks messages**

```console
$ qualscan -v
```

**Display tasks messages by level**

```console
$ qualscan -v -l warn
```

List of level

| Level         | Description                      |
|:-------------:|:--------------------------------:|
| all           | (default) display all logs       |
| error         | Display errors only              |
| warn          | Display warnings & errors        |
| info          | Display info & errors & warnings |


**Send custom args to jscpd**

```console
$ qualscan -cd "--ignore tests/resources/code_duplication_failed/*"
```

For a full list of possible arguments, please follow this documentation: [Jscpd doc](https://github.com/kucherenko/jscpd/tree/master/packages/jscpd).

**Check exact version for dev dependencies**

```console
$ qualscan -cdd
```

## Using Config file

Qualscan can use a configuration file instead of a list of options.

You can specify your configuration file in two different ways:
1. Use the option -c

```console
$ qualscan -c /pathTo/MyConfigFile.json
```

2. Use .qualscanrc file
By default, Qualscan will check if .qualscanrc file is present in the current directory.
You can find an [example here](https://github.com/wallet77/qualscan/tree/main/examples/.qualscanrc).

## Usage with a CI pipeline

Qualscan can be easily integrate with any CI pipeline.
To see a basic example you can look at this [basic example with github actions](https://github.com/wallet77/qualscan/blob/main/.github/workflows/node.js.yml).

# Test

```console
$ npm test
```

Run with coverage

```console
$ npm run coverage
```

Coverage report can be found in coverage/.
