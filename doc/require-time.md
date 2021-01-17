# Require time

## Overview

This plugin will measure the loading time of your project.

It basically returns the time taken by the `require` function of your entrypoint.

## Reasons for failure
This plugin will fail if the loading time is higher than the threshold:

| Metric          | Threshold         | Argument                                     |
|:---------------:|:-----------------:|:--------------------------------------------:|
| Entrypoint time | 500000000 (50ms)  | --require-time.budget.fail.entrypointTime    |

## Details

The entrypoint is retrieved in your package.json file from one of the following properties:
- main 
- exports

To see all the details about this feature you can check the [Node.JS documentation page](https://nodejs.org/api/packages.html#packages_main_entry_point_export).

The entrypoint of your module can be overridden in your `.qualscanrc` file.
```json
{
  "require-time": {
    "entrypoint": "./entrypoint.js"
  }
}
```