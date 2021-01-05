'use strict'
const path = require('path')
const utils = require(path.join(__dirname, '/../utils.js'))
const semver = require('semver')

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
            for (const dependency in global.packagefile.dependencies) {
                if (!semver.valid(global.packagefile.dependencies[dependency])) {
                    badVersions.dependencies[dependency] = global.packagefile.dependencies[dependency]
                }
            }
        }

        if (global.packagefile.devDependencies && global.argv['dependencies-exact-version'].devDependencies) {
            for (const dependency in global.packagefile.devDependencies) {
                if (!semver.valid(global.packagefile.devDependencies[dependency])) {
                    badVersions.devDependencies[dependency] = global.packagefile.devDependencies[dependency]
                }
            }
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

module.exports = cmd
