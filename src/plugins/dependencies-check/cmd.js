'use strict'
const path = require('path')
const utils = require(path.join(__dirname, '/../utils.js'))
const depcheck = require('depcheck')

const cmd = {
    title: 'Dependencies check',
    doc: 'https://github.com/wallet77/qualscan/blob/main/doc/dependencies-check.md',
    callback: async () => {
        const options = global.argv['dependencies-check'].args
        options.package = global.packagefile
        const data = await depcheck(process.env.QUALSCAN_PROJECT_PATH, options)
        cmd.data = data

        const budget = global.argv['dependencies-check'].budget
        utils.initBudget(cmd, budget, '', '')

        utils.processBudget(cmd, budget, {
            dependencies: cmd.data.dependencies.length,
            devDependencies: cmd.data.devDependencies.length,
            missing: Object.keys(cmd.data.missing).length
        })

        return cmd
    }
}

utils.loadReporters(cmd, __dirname)

module.exports = cmd
