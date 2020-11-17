# Qualscan = Quality Scanner

[![GitHub release](https://badge.fury.io/js/inspector-api.svg)](https://github.com/wallet77/v8-inspector-api/releases/)
[![GitHub license](https://img.shields.io/github/license/wallet77/v8-inspector-api)](https://github.com/wallet77/v8-inspector-api/blob/master/LICENSE)

# Purpose

Simple wrapper around "inspector" module.
Basically it adds :
- promises & async/await syntax
- S3 exporter

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

**In order to have all features we recommend to use at least Node.js version 10 or higher.**

# Installation

```console
$ npm install inspector-api --save
```

# Usage

```console
$ npm qualscan
```

# Test

```console
$ npm test
```

Coverage report can be found in coverage/.
