'use strict'
const path = require('path')
const utils = require(path.join(__dirname, '/../utils.js'))

const cmd = {
    cmd: 'npm pack --dry-run --json',
    title: 'Project size',
    doc: 'https://github.com/wallet77/qualscan/blob/main/doc/npm_pack.md',
    callback: async (error, stdout, stderr) => {
        utils.parseData(cmd, error, stdout, stderr)

        const budget = global.argv['npm-pack'].budget
        utils.initBudget(cmd, budget, '', '')

        utils.processBudget(cmd, budget, cmd.data[0])

        return cmd
    }
}

module.exports = cmd
