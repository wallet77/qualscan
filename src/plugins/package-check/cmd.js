'use strict'
const path = require('path')

const args = global.argv['package-check'] || ''

const cmdLine = `${path.join(__dirname, '/../../../node_modules/.bin/package-check')} ${args}`

const cmd = {
    cmd: cmdLine,
    title: 'Check package',
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

module.exports = cmd
