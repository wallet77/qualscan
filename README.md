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
  <a href="#reporters">Reporters</a> •
  <a href="#budget">Budget</a> •
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
- check project's size (bundle's size, number of files)
- check project's structure (readme, license, etc)
- check exact version of dependencies
- check dependencies (missing or unused)

In addition you can run all you custom scripts.  
It will give you a global score based on the number of successful tasks.

## Output

This tool will basically returns 1 if, at least, one task has failed, otherwise it returns 0.

Basic error output:
![Qualscan error](https://github.com/wallet77/qualscan/blob/main/examples/error_output.png)

A task is considered as successful if the `fail` threhsold (see <a href="#budget">budgets</a>) has not been exceeded.
`warn` of `info` thresholds will bring you more information but the task will be considered as successful even if the thresholds are exceeded.

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
$ qualscan --tasks security-audit updates
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
$ qualscan -cda "--ignore tests/resources/code_duplication_failed/*"
```

For a full list of possible arguments, please follow this documentation: [Jscpd doc](https://github.com/kucherenko/jscpd/tree/master/packages/jscpd).

**Check exact version for dev dependencies**

```bash
$ qualscan -devd
```

## Using Config file

Qualscan can use a configuration file instead of a list of options.

You can specify your configuration file in two different ways:

1. **Use .qualscanrc file**  
By default, Qualscan will check if .qualscanrc file is present in the current directory.
You can find an [example here](https://github.com/wallet77/qualscan/tree/main/examples/.qualscanrc).
```json
{
    "scripts": ["linter"],
    "code-duplication": {
        "args": "--ignore */resources/code_duplication_failed/* --gitignore"
    },
    "verbose": true,
    "level": "error"
}
```

2. **Use the option -c**
```bash
$ qualscan -c /pathTo/MyConfigFile.json
```

## Reporters

By default qualscan will use `text` reporter and display results in the console.  
Allowed reporters:
- text
- json
- json in console

```bash
qualscan --reporters json
```
By default the default path to store the report is: [workingDir]/report/qualscan_report.json

Define another report directory
```bash
qualscan --reporters json --reportPath "myCustomDir/"
```

To display json in console
```bash
qualscan --reporters json --reportPath ""
```

## Budget

The notion of budget comes from the [Webperf budget principle](https://developer.mozilla.org/en-US/docs/Web/Performance/Performance_budgets).  
With this powerful tool you can define your own thresholds for each plugin.  
The principle is the following:
* for each plugin, define your thresholds: fail, warn or info
* for each threshold set a value for every metrics

Example in config file (for project's size plugin):
```bash
{
  "project-size": {
    "budget": {
      "fail": {
        "entryCount": 150,
        "size": 3000000,
        "unpackedSize": 60000000
      },
      "warn": {
        "entryCount": 100,
        "size": 300000,
        "unpackedSize": 6000000
      }
    }
  }
}
```

Basic budgets output:
![Budgets example](https://github.com/wallet77/qualscan/blob/main/examples/budgets.png)

For a task:
 - successful: if `fail` threshold has not been exceeded
 - otherwise the task has failed

For a threshold:
 - successful if all metrics are under their maximum value
 - otherwise it has failed

So a task can lead to an error, a warning or an information.  
Thresholds can only be passed or failed.

![Budgets errors example](https://github.com/wallet77/qualscan/blob/main/examples/budgets_errors.png)

**List of all metrics per plugin**

| Plugin               | Key                          | Metric              | Unit                                                 |
|:--------------------:|:----------------------------:|:-------------------:|:----------------------------------------------------:|
| Code duplication     | code-duplication             | percentageTokens    | percentage of duplicated tokens                      |
|                      |                              | percentage          | percentage of duplicated lines                       |
| Exact version        | dependencies-exact-version   | dependencies        | number of range version in dependencies              |
|                      |                              | devDependencies     | number of range version in dev dependencies          |
| Security audit       | security-audit               | critical            | number of critical vulnerabilities                   |
|                      |                              | high                | number of high vulnerabilities                       |
|                      |                              | moderate            | number of moderate vulnerabilities                   |
|                      |                              | low                 | number of low vulnerabilities                        |
|                      |                              | info                | number of info                                       |
| Project's size       | project-size                 | entryCount          | number of files                                      |
|                      |                              | size                | size in bytes (only files in final bundle)           |
|                      |                              | unpackedSize        | unpacked size in bytes (only files in final bundle)  |
| Dependencies updates | updates                      | major               | number of major updates                              |
|                      |                              | minor               | number of minor updates                              |
|                      |                              | patch               | number of patch                                      |
| Check dependencies   | dependencies-check           | missing             | number of missing dependencies                       |
|                      |                              | dependencies        | number of unused dependencies                        |
|                      |                              | devDependencies     | number of unused dev dependencies                    |

## CI/CD

Qualscan can be easily integrated with any CI pipeline.  
You can look at this [basic example with github actions](https://github.com/wallet77/qualscan/blob/main/.github/workflows/node.js.yml).

To see a typical output you can have a look at this page: [actions page](https://github.com/wallet77/qualscan/runs/1511486101?check_suite_focus=true), and click on step "run the qualscan tool".

Basic CI output with Github actions:
![CI example](https://github.com/wallet77/qualscan/blob/main/examples/ci.png)

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
