'use strict'
const path = require('path')
const utils = require(path.join(__dirname, '/../utils.js'))
const semver = require('semver')
const fs = require('fs')

/**
 * Check if a dependency has an invalid version
 *
 * @param {Object} badVersions : map of all modules with a bad version
 * @param {String} key : defines if we are focusing on dependencies or devDependencies
 */
const checkVersion = (badVersions, key) => {
    // only check version in package.json
    // if no package-lock.json was found
    if (!fs.existsSync(path.join(process.env.QUALSCAN_PROJECT_PATH, 'package-lock.json'))) {
        for (const dependency in global.packagefile[key]) {
            const depVersion = (global.packagefile[key][dependency]).replace('workspace:', '')
            if (!semver.valid(depVersion)) {
                badVersions[key][dependency] = depVersion
            }
        }
    }
}

const cmd = {
    title: 'Exact version of dependencies',
    doc: 'https://github.com/wallet77/qualscan/blob/main/doc/dependencies-exact-version.md',
    callback: async () => {
        const badVersions = {
            dependencies: {},
            devDependencies: {}
        }

        const budget = global.argv['dependencies-exact-version'].budget

        if (global.packagefile.dependencies) {
            checkVersion(badVersions, 'dependencies')
        }

        if (global.packagefile.devDependencies && global.argv['dependencies-exact-version'].devDependencies) {
            checkVersion(badVersions, 'devDependencies')
        } else {
            for (const threshold in budget) {
                delete budget[threshold].devDependencies
            }
        }

        cmd.data = badVersions

        utils.initBudget(cmd, budget, 'number of range versions in ', '')
        utils.processBudget(cmd, budget, {
            dependencies: Object.keys(badVersions.dependencies).length,
            devDependencies: Object.keys(badVersions.devDependencies).length
        })

        return cmd
    }
}

utils.loadReporters(cmd, __dirname)

module.exports = cmd
