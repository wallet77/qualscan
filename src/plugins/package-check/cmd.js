'use strict'
const path = require('path')
const utils = require(path.join(__dirname, '/../utils.js'))

const args = global.argv['package-check'] || ''

const cmdLine = `${path.join(__dirname, utils.getBinDir(), 'package-check')} ${args}`

const cmd = {
    cmd: cmdLine,
    title: 'Check package',
    doc: 'https://github.com/wallet77/qualscan/blob/main/doc/package-check.md',
    callback: async (error, stdout, stderr) => {
        cmd.data = stdout || stderr
        cmd.level = 'succeed'

        if (error) {
            cmd.level = 'fail'
            cmd.error = error
        }

        return cmd
    }
}

utils.loadReporters(cmd, __dirname)

module.exports = cmd
