# Qualscan = Quality Scanner

[![GitHub release](https://badge.fury.io/js/qualscan.svg)](https://github.com/wallet77/qualscan/releases/)
[![GitHub license](https://img.shields.io/github/license/wallet77/v8-inspector-api)](https://github.com/wallet77/v8-inspector-api/blob/master/LICENSE)

# Purpose

A CLI tool to run multiples plugins in order to check the quality of your project.
For example it can run:
- security audit of your dependencies
- check dependencies updates
- check code duplications
- and more


# Compatibility

**/!\ This module use async/await syntax and the inspector module, this is why you must have node 8.0+.**

Supported and tested : >= 8.0

| Version       | Supported     | Tested         |
|:-------------:|:-------------:|:--------------:|
| 14.x          | yes           | yes            |
| 12.x          | yes           | yes            |
| 10.x          | yes           | yes            |
| 9.x           | yes           | yes            |
| 8.x           | yes           | yes            |

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

# Test

```console
$ npm test
```

Coverage report can be found in coverage/.
