# Version 3.1.0 released on 2021-07-13

## Features

**Allow to exclude dependencies for updates**

This feature allow to exclude some dependencies from a pattern for update pugin.  
For example you can exclude all `eslint*` in order to avoid compatibility issues.

[Pull Request](https://github.com/wallet77/qualscan/pull/39) - Feat/exclude dep updates


# Version 3.0.0 released on 2020-04-09

## Breaking changes

This release is a new major version and introduces potential changes in its behavior.

List of breaking changes:
- Plugin `dependencies-size` can now report dependencies tree depth, by default the maximum is 5
- Plugin `security-audit` now scans only production dependencies by default, to scan dev dependencies use devMode
```json
{
  "devMode": true
}
```
```bash
qualscan --devMode
```

## Features

**Dev Mode**

This feature allow some plugings to take dev dependencies into account.  
For example security audit is performed with `npm audit` instead of `npm audit --production`

[Pull Request](https://github.com/wallet77/qualscan/pull/37) - allow dev mode 

**Export configuration**

Allow to export the entire configuration used by qualscan.
```bash
qualscan exportConf
```

[Pull Request](https://github.com/wallet77/qualscan/pull/36) - export conf

**Merge conf with default values**

This feature will perform a merge between default values and user configuration.  
It allows developer to override only some specific values.
Example to change only the maximum number of files:  
Before you have to define the entire budget:
```json
{
  "project-size": {
    "budget": {
      "fail": {
        "entryCount": 200,
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

Now:
```json
{
  "project-size": {
    "budget": {
      "fail": {
        "entryCount": 200,
      }
    }
  }
}
```
The list of default values can be found [here](https://github.com/wallet77/qualscan/blob/main/src/defaults.json).  
[Pull Request](https://github.com/wallet77/qualscan/pull/33) - allow to merge conf with defaults values

**Tree depth**

Qualscan will now scan dependencies tree depth and allow a maximum of 5 by default.  
You can edit this value in your configuration.
```json
{
  "dependencies-size": {
    "budget": {
      "fail": {
        "depth": 8
      }
    }
  }
}
```

[Pull Request](https://github.com/wallet77/qualscan/pull/31) - add tree depth

# Version 2.0.0 released on 2020-01-11

## Breaking changes

This release is a new major version and can lead to errors or unexpected behaviors if you use options.

List of breaking changes:
- Plugin `npm_outdated` renamed as `updates`
- Plugin `npm_audit` renamed as `security-audit`
- Plugin `npm_pack` renamed as `project-size`
- Code duplication args `-cd` is now `--code-duplication.args` or `-cda`
- Check dev dependencies `-cdd` is now `--dependencies-exact-version.devDependencies` or `-devd`
- Project's size limits are now part of budgets feature:  
        * replace `-nofl` with `--project-size.budget.fail.entryCount`  
        * replace `-usl` with `--project-size.budget.fail.size`  
        * replace `-psl` with `--project-size.budget.fail.unpackedSize`  
        * or use a config file
```json
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

## Features

**Score**

This feature display a global score (as a percentage) based on the number of successful tasks.   
A task is considered as successful if the `fail` threshold has not been exceeded (see budgets section).

[Pull Request](https://github.com/wallet77/qualscan/pull/14) - Display a score based on budgets thresholds

**Budgets**

Budgets allow you to defined three thresholds (fail, warn and info) based on different values for many metrics.
If the `fail` threshold has been exceeded then the task has failed and qualscan will return 0.

By default all `fail` thresholds should be compatible with the configuration of qualscan v1.

[Pull Request](https://github.com/wallet77/qualscan/pull/12) - Add budgets for all plugins

**Reporters**

This feature allow you to use different format:
- `text` => display report as text in console
- `json` => generate a JSON file
- `json` with an empty `--reportPath` => display JSON in console

[Pull Request](https://github.com/wallet77/qualscan/pull/16) - Add reporters structure + default reporters
