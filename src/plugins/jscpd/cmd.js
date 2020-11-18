'use strict'
const path = require('path')

const cmd = {
    cmd: `${path.join(__dirname, '/../../../node_modules/.bin/jscpd')} -c ${path.join(__dirname, '/config.json')} ./`,
    title: 'Code duplication',
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
