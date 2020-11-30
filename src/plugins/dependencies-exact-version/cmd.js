'use strict'

const semver = require('semver')

const cmd = {
    title: 'Exact version of dependencies',
    callback: async () => {
        const badVersions = {}
        cmd.level = 'succeed'

        if (global.packagefile.dependencies) {
            for (const dependency in global.packagefile.dependencies) {
                if (!semver.valid(global.packagefile.dependencies[dependency])) {
                    badVersions[dependency] = global.packagefile.dependencies[dependency]
                    cmd.level = 'fail'
                }
            }
        }

        if (global.packagefile.devDependencies && global.argv['check-dev-dependencies']) {
            for (const dependency in global.packagefile.devDependencies) {
                if (!semver.valid(global.packagefile.devDependencies[dependency])) {
                    badVersions[dependency] = global.packagefile.devDependencies[dependency]
                    cmd.level = 'fail'
                }
            }
        }

        cmd.data = badVersions

        return cmd
    }
}

module.exports = cmd
