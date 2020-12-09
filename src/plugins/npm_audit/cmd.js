'use strict'
const path = require('path')
const utils = require(path.join(__dirname, '/../utils.js'))

const cmd = {
    cmd: 'npm audit -json',
    title: 'Security audit',
    callback: async (error, stdout, stderr) => {
        utils.parseData(cmd, error, stdout, stderr)

        if (cmd.data.metadata.vulnerabilities.critical > 0 || cmd.data.metadata.vulnerabilities.high > 0) {
            cmd.level = 'fail'
        } else if (cmd.data.metadata.vulnerabilities.moderate > 0 || cmd.data.metadata.vulnerabilities.low > 0) {
            cmd.level = 'warn'
        } else if (cmd.data.metadata.vulnerabilities.info > 0) {
            cmd.level = 'info'
        }

        return cmd
    }
}

module.exports = cmd
