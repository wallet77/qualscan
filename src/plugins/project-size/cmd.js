'use strict'
const path = require('path')
const utils = require(path.join(__dirname, '/../utils.js'))
const utilsProjectSize = require(path.join(__dirname, './utils.js'))

const cmd = {
    cmd: 'npm pack --dry-run --json',
    title: 'Project\'s size',
    doc: 'https://github.com/wallet77/qualscan/blob/main/doc/npm_pack.md',
    callback: async (error, stdout, stderr) => {
        utils.parseData(cmd, error, stdout, stderr)

        const budget = global.argv['project-size'].budget
        utils.initBudget(cmd, budget, '', '', utilsProjectSize.format)

        utils.processBudget(cmd, budget, cmd.data[0], utilsProjectSize.format)

        return cmd
    }
}

utils.loadReporters(cmd, __dirname)

module.exports = cmd
