'use strict'
const path = require('path')
const utils = require(path.join(__dirname, '/../utils.js'))

const getLevel = (cmd) => {
    const budget = global.argv['npm-audit'].budget

    let level = 'succeed'
    const levels = ['succeed', 'info', 'warn', 'fail']

    for (const threshold in budget) {
        if ((cmd.data.metadata.vulnerabilities.critical > budget[threshold].critical ||
            cmd.data.metadata.vulnerabilities.high > budget[threshold].high ||
            cmd.data.metadata.vulnerabilities.moderate > budget[threshold].moderate ||
            cmd.data.metadata.vulnerabilities.low > budget[threshold].low ||
            cmd.data.metadata.vulnerabilities.info > budget[threshold].info) &&
            levels.indexOf(threshold) >= levels.indexOf(level)) {
            level = threshold

            if (level === 'fail') return level
        }
    }

    return level
}

const cmd = {
    cmd: 'npm audit -json',
    title: 'Security audit',
    doc: 'https://github.com/wallet77/qualscan/blob/main/doc/npm_audit.md',
    callback: async (error, stdout, stderr) => {
        utils.parseData(cmd, error, stdout, stderr)

        cmd.level = getLevel(cmd)

        return cmd
    }
}

module.exports = cmd
