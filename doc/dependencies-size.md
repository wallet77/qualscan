# Dependencies size

## Overview

This plugin is used to detect if the project has too many dependencies.  
Or if all dependencies (once installed) are too heavy.

## Reasons for failure
This plugin will fail if one of the following metrics is greater than their threshold:

| Metric              | Threshold      | 
|:-------------------:|:--------------:|
| Depth               | 5              |
| Weight              | 100 MB         |
| Dependencies        | 10             |
| Direct dependencies | 300            |

## Command
This plugin is based on `npm ls`, to run it as a standalone module you can refer to [this page](https://docs.npmjs.com/cli/v6/commands/npm-ls).

```bash
npm ls --production --json
```

## Details

The weight of your project depends on the number of dependencies and depends on the weight of your `node_modules` directory.  
To visualize your dependencies tree you can run `npm ls --production` or you can use a tool like [broofa](https://npm.broofa.com/).

![Broofa example](https://github.com/wallet77/qualscan/blob/main/examples/broofa.png)