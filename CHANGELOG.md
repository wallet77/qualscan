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
