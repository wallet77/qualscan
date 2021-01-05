# NPM outdated

## Overview

This plugin is used to detect if dependencies are not up-to-date.

## Reasons for failure
This plugin will fail if at least one dependencies has a major version difference.

It will display warnings if at least one dependencies has a minor version difference.
It will display infos if at least one dependencies has a patch version difference.

## Command
To run the plugin as a standalone module you can refer to [this page](https://docs.npmjs.com/cli/v6/commands/npm-outdated).

```bash
npm outdated
```

## External documentation

[See semver syntax.](https://semver.org/)
