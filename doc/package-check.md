# Package-check

## Overview

This plugin is used to detect issues on your package structure, especially in your package.json file.

It will check:
- ✓ package.json : if it is present or not
- ✓ ES Module Entrypoint: if it exists in your package.json file
- ✓ Export Map: if you use the property "exports" in your package.json file
- ✓ No Unnecessary Files: if you use "files" property in your package.json
- ✓ Keywords: if you have some keywords to describe your project
- ✓ License: if you have a license file
- ✓ Repository URL: if the repositoru url is setup
- ✓ TypeScript Types: if you have specified an entrypoint for Typescript definitions
- ✓ README: if you have a readme file

This plugin will fail if one of this point is not satisfied.

## Command
To run the plugin as a standalone module you can refer to [this page](https://www.npmjs.com/package/@skypack/package-check).

```bash
package-check
```

## Details

**1. package.json**  
Just check if a package.json file is present in your root directory and if the format is correct.

**2. ES Module Entrypoint**
The ES Module entrypoint is useful to tell to some other program where to find the main file of your project.
For more details: [Node.JS doc.](https://nodejs.org/api/packages.html#packages_package_entry_points)


**3. Export Map**  
The property "exports" allows to set the main entry point for a package.
```json
"exports": {
    "require": "./index.js",
    "import": "./index.js"
}
```
For more details: [Node.JS doc.](https://nodejs.org/api/packages.html#packages_main_entry_point_export)

**4. No Unnecessary Files**  
Use the property "files" in your package.json to specify which files/directories must be included when your package is installed as a dependency.
It acts as a whitelist instead of .npmignore.
```json
"files": [
    "src/**"
]
```
For more details: [NPM doc.](https://docs.npmjs.com/cli/v6/configuring-npm/package-json#files)

**5. Keywords**  
They are useful to describe your project/package.
```json
"keywords": [
    "keyword1",
    "keyword2",
    "keyword3"
]
```

**6. License**  
Mandatory for Open-Sources program.

**7. Repository URL**  
```json
"repository": {
    "type": "git",
    "url": "git+https://github.com/wallet77/qualscan.git"
}
```

**8. TypeScript Types**  
You should provide a typescript definition file for your project, even if your project is not written with typescript.
```json
"types": "./index.d.ts",
```

**9. README**  
Always provide a readme file. It will help other developers to use/understand your project.