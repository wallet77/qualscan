# Dependencies check

## Overview

This plugin will check if dependencies are:
 - unused (declared in package.json but not found in project src)
 - missing (not declared in package.json but found in project src)


## Reasons for failure
This plugin will fail if at least one depencencies (or dev) is unused or missing.

## Command
```bash
qualscan --tasks dependencies-check
```

## External documentation

[See depcheck official documentation](https://www.npmjs.com/package/depcheck)

## Details

## How to fix?

1. Run qualscan or depcheck module to get the list of missing/unused dependencies:
    ```bash
    qualscan --tasks dependencies-check
    ```
    OR
    ```bash
    depcheck [directory] [arguments]
    ```

3. Remove all unused from your package.json file.

4. Install all missing dependencies
    ```bash
    npm install [myModule] --save-exact
    ```

4. Clear your node_modules folder
    ```bash
    rm -rf node_modules
    ```

5. Install your dependencies
    ```bash
    npm install
    ```