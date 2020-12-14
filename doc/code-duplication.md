# Code duplication

## Overview

This plugin is used to detect copy/paste in your code.

## Reasons for failure
This plugin will fail if the total of copy/paste is greater than the threshold.
This limit can be customized in your qualscan config file or directly with the command line.

```json
{
    "code-duplication": "--threshold 0.1 --gitignore"
}
```

OR

```bash
qualscan --code-duplication="--threshold 0.1 --gitignore"
```

## Command
To run the plugin as a standalone module you can refer to [this page](https://www.npmjs.com/package/jscpd).

```bash
jscpd
```

## External documentation

[See jscpd official website.](https://github.com/kucherenko/jscpd)
