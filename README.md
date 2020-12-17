# Qualscan = Quality Scanner

[![GitHub release](https://badge.fury.io/js/qualscan.svg)](https://github.com/wallet77/qualscan/releases/)
[![GitHub license](https://img.shields.io/github/license/wallet77/qualscan)](https://github.com/wallet77/qualscan/blob/master/LICENSE)
[![CI pipeline](https://github.com/wallet77/qualscan/workflows/Node.js%20CI/badge.svg)](https://github.com/wallet77/qualscan/actions?query=workflow%3A%22Node.js+CI%22)
[![Code coverage](https://codecov.io/gh/wallet77/qualscan/branch/main/graph/badge.svg)](https://codecov.io/gh/wallet77/qualscan)
[![Opened issues](https://img.shields.io/github/issues-raw/wallet77/qualscan)](https://github.com/wallet77/qualscan/issues)
[![Opened PR](https://img.shields.io/github/issues-pr-raw/wallet77/qualscan)](https://github.com/wallet77/qualscan/pulls)
[![DeepScan grade](https://deepscan.io/api/teams/12061/projects/15017/branches/292479/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=12061&pid=15017&bid=292479)

![DeepScan grade](https://img.shields.io/david/wallet77/qualscan)

![Qualscan example](https://github.com/wallet77/qualscan/blob/main/examples/run_qualscan.gif)

<p>
  <a href="#purpose">Purpose</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#using-config-file">Using config file</a> •
  <a href="#cicd">CI / CD</a> •
  <a href="#test">Test</a> •
  <a href="#license">License</a>
</p>

## Purpose

A CLI tool to run multiple plugins in order to check the quality of your project.
For example it can run:
- security audit of your dependencies
- check dependencies updates
- check code duplications
- and more

This tool will basically returns 1 if, at least, one task has failed, otherwise it returns 0.


## Installation

```bash
$ npm install qualscan -g
```

or

```bash
$ npm install qualscan --save
```

## Usage

```bash
$ qualscan
```

### Options

**Display all existing options**
```bash
$ qualscan -h
```

**Run only a set of tasks**

```bash
$ qualscan --tasks npm_audit npm_outdated
```

**Run only a set of scripts**

```bash
$ qualscan --scripts test
```

**Display tasks messages**

```bash
$ qualscan -v
```

**Display tasks messages by level**

```bash
$ qualscan -v -l warn
```

| Level         | Description                      |
|:-------------:|:--------------------------------:|
| all           | (default) display all logs       |
| error         | Display errors only              |
| warn          | Display warnings & errors        |
| info          | Display info & errors & warnings |  
<br/>

**Send custom args to jscpd**

```bash
$ qualscan -cd "--ignore tests/resources/code_duplication_failed/*"
```

For a full list of possible arguments, please follow this documentation: [Jscpd doc](https://github.com/kucherenko/jscpd/tree/master/packages/jscpd).

**Check exact version for dev dependencies**

```bash
$ qualscan -cdd
```

**Check project size**

Customize the number of files limit

```bash
$ qualscan -nofl 200
```

Customize the package size limit (in bytes)

```bash
$ qualscan -psl 200000
```

Customize the package size limit (in bytes)

```console
$ qualscan -usl 200000000
```

## Using Config file

Qualscan can use a configuration file instead of a list of options.

You can specify your configuration file in two different ways:

1. **Use .qualscanrc file**  
By default, Qualscan will check if .qualscanrc file is present in the current directory.
You can find an [example here](https://github.com/wallet77/qualscan/tree/main/examples/.qualscanrc).
```json
{
    "nofl": 150,
    "psl": 3000000,
    "usl": 6000000,
    "scripts": ["linter"],
    "code-duplication": "--threshold 10 --gitignore",
    "verbose": true,
    "level": "error"
}
```

2. **Use the option -c**
```bash
$ qualscan -c /pathTo/MyConfigFile.json
```

## CI/CD

Qualscan can be easily integrate with any CI pipeline.  
To see a basic example you can look at this [basic example with github actions](https://github.com/wallet77/qualscan/blob/main/.github/workflows/node.js.yml).

To see a typical output you can have a look at this page: [actions page](https://github.com/wallet77/qualscan/runs/1511486101?check_suite_focus=true), and click on step "run the qualscan tool".

## Compatibility

**/!\ This module use async/await syntax and the inspector module, this is why you must have node 8.0+.**

Supported and tested : >= 8.0

| Version       | Supported     | Tested         |
|:-------------:|:-------------:|:--------------:|
| 14.x          | yes           | yes            |
| 12.x          | yes           | yes            |
| 10.x          | yes           | yes            |

## Test

```bash
$ npm test
```

Run with coverage

```bash
$ npm run coverage
```

Coverage report can be found in coverage/.

## License

MIT
