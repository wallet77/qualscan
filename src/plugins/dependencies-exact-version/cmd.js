'use strict'

const semver = require('semver')
const path = require('path')

const cmd = {
    title: 'Exact version for dependencies',
    callback: async () => {
        try {
            const packagefile = require(path.join(process.cwd(), 'package.json'))
            const badVersions = {}
            cmd.level = 'succeed'

            if (packagefile.dependencies) {
                for (const dependency in packagefile.dependencies) {
                    if (!semver.valid(packagefile.dependencies[dependency])) {
                        badVersions[dependency] = packagefile.dependencies[dependency]
                        cmd.level = 'fail'
                    }
                }
            }

            if (packagefile.devDependencies && global.argv['check-dev-dependencies']) {
                for (const dependency in packagefile.devDependencies) {
                    if (!semver.valid(packagefile.devDependencies[dependency])) {
                        badVersions[dependency] = packagefile.devDependencies[dependency]
                        cmd.level = 'fail'
                    }
                }
            }

            cmd.data = badVersions
        } catch (err) {
            cmd.error = err
            cmd.level = 'fail'
        }

        return cmd
    }
}

module.exports = cmd
