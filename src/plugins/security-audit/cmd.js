'use strict'
const path = require('path')
const utils = require(path.join(__dirname, '/../utils.js'))

const cmd = {
    cmd: 'npm audit -json',
    title: 'Security audit',
    doc: 'https://github.com/wallet77/qualscan/blob/main/doc/security-audit.md',
    callback: async (error, stdout, stderr) => {
        utils.parseData(cmd, error, stdout, stderr)

        const budget = global.argv['security-audit'].budget
        utils.initBudget(cmd, budget, 'nb ', '')

        utils.processBudget(cmd, budget, cmd.data.metadata.vulnerabilities)

        return cmd
    }
}

utils.loadReporters(cmd, __dirname)

module.exports = cmd
