'use strict'
const path = require('path')
const utils = require(path.join(__dirname, '/../utils.js'))

const processBudget = () => {
    const budget = global.argv['npm-audit'].budget
    const levels = ['succeed', 'info', 'warn', 'fail']

    cmd.level = 'succeed'
    cmd.budget = {}

    for (const threshold in budget) {
        for (const metric in budget[threshold]) {
            if (!cmd.budget[threshold]) {
                cmd.budget[threshold] = {}
            }
            cmd.budget[threshold][metric] = {
                plugin: cmd.title,
                threshold: threshold,
                level: 'succeed',
                metric: metric,
                value: 0,
                limit: budget[threshold][metric],
                unit: `nb ${metric}`
            }
        }
    }

    for (const threshold in budget) {
        for (const metric in budget[threshold]) {
            if (cmd.data.metadata.vulnerabilities[metric] > budget[threshold][metric]) {
                cmd.budget[threshold][metric].value = cmd.data.metadata.vulnerabilities[metric]
                cmd.budget[threshold][metric].level = threshold

                if (levels.indexOf(cmd.level) < levels.indexOf(threshold)) {
                    cmd.level = threshold
                }
            }
        }
    }
}

const cmd = {
    cmd: 'npm audit -json',
    title: 'Security audit',
    doc: 'https://github.com/wallet77/qualscan/blob/main/doc/npm_audit.md',
    callback: async (error, stdout, stderr) => {
        utils.parseData(cmd, error, stdout, stderr)

        processBudget()

        return cmd
    }
}

module.exports = cmd
