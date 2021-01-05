'use strict'
const path = require('path')
const utils = require(path.join(__dirname, '/../utils.js'))
const filesize = require('filesize')

const format = (value, metric) => {
    return metric !== 'entryCount' && !isNaN(value) ? filesize(value, { base: 10 }) : value
}

const cmd = {
    cmd: 'npm pack --dry-run --json',
    title: 'Project\'s size',
    doc: 'https://github.com/wallet77/qualscan/blob/main/doc/npm_pack.md',
    callback: async (error, stdout, stderr) => {
        utils.parseData(cmd, error, stdout, stderr)

        const budget = global.argv['project-size'].budget
        utils.initBudget(cmd, budget, '', '', format)

        utils.processBudget(cmd, budget, cmd.data[0], format)

        return cmd
    }
}

module.exports = cmd
