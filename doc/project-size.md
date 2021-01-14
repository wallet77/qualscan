# Package size

## Overview

This plugin is used to detect if the project size is too big.

You can specify which files will be taken into account with:
- "files" property in your package.json file
- .npmignore file
- .gitignore file

## Reasons for failure
This plugin will fail if one of the following metrics is greater than their threshold:

| Metric          | Threshold      | Argument                                     |
|:---------------:|:--------------:|:--------------------------------------------:|
| Size            | 50kB  (50000)  | --project-size.budget.fail.size              |
| Unpacked size   | 100kB (100000) | --project-size.budget.fail.unpackedSize      |
| Number of files | 100            | --project-size.budget.fail.entryCount        |

## Command
To run the plugin as a standalone module you can refer to [this page](https://docs.npmjs.com/cli/v6/commands/npm-pack).

```bash
npm pack --dry-run
```

## Details

**Bad**

No files property in packe.json.

![Before optimization](https://github.com/wallet77/qualscan/blob/main/examples/before_opti_size.png)

**Good**

```json
"files": [
    "src/**"
],
```

![After optimization](https://github.com/wallet77/qualscan/blob/main/examples/after_opti_size.png)


To increase the number of files limit:
```bash
qualscan --project-size.budget.fail.entryCount 200
```

To increase the size to 100kB:
```bash
qualscan --project-size.budget.fail.size 100000
```

To increase the unpacked size to 1mB:
```bash
qualscan --project-size.budget.fail.unpackedSize 1000000
```

Or directly in your qualscanrc file:
```bash
{
  "project-size": {
    "budget": {
      "fail": {
        "entryCount": 200,
        "size": 100000,
        "unpackedSize": 1000000
      }
    }
  }
}
```