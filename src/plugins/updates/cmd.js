'use strict'

const semver = require('semver')
const path = require('path')
const utils = require(path.join(__dirname, '/../utils.js'))

const cmd = {
    cmd: 'npm outdated -json -long',
    title: 'Dependencies updates',
    doc: 'https://github.com/wallet77/qualscan/blob/main/doc/updates.md',
    callback: (error, stdout, stderr) => {
        if (stdout === '') {
            cmd.level = 'succeed'
            return cmd
        }

        const data = JSON.parse(stdout)

        cmd.data = data
        cmd.level = 'succeed'

        const budget = global.argv.updates.budget
        utils.initBudget(cmd, budget, 'nb ', '')

        const values = {
            major: 0, minor: 0, patch: 0
        }

        for (const moduleName in data) {
            const module = data[moduleName]

            if (module.type === 'devDependencies' && !global.argv.updates.devDependencies) {
                continue
            }

            if (semver.major(module.current) < semver.major(module.latest)) {
                values.major++
            } else if (semver.minor(module.current) < semver.minor(module.latest)) {
                values.minor++
            } else if (semver.patch(module.current) < semver.patch(module.latest)) {
                values.patch++
            }
        }

        utils.processBudget(cmd, budget, values)

        if (error && cmd.level === 'succeed') {
            cmd.level = 'fail'
            cmd.error = error
        }

        return cmd
    }
}

module.exports = cmd