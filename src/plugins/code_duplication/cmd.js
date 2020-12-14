'use strict'
const path = require('path')

const args = global.argv['code-duplication'] || `-c ${path.join(__dirname, '/config.json')}`

const cmdLine = `${path.join(__dirname, '/../../../node_modules/.bin/jscpd')} ${args} ./`

const cmd = {
    cmd: cmdLine,
    title: 'Code duplication',
    doc: 'https://github.com/wallet77/qualscan/blob/main/doc/code-duplication.md',
    callback: async (error, stdout, stderr) => {
        cmd.data = stdout
        cmd.level = 'succeed'

        if (error) {
            cmd.level = 'fail'
        }

        return cmd
    }
}

module.exports = cmd
