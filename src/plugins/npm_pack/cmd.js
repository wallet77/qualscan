'use strict'
const path = require('path')
const utils = require(path.join(__dirname, '/../utils.js'))

const cmd = {
    cmd: 'npm pack --dry-run --json',
    title: 'Project size',
    callback: async (error, stdout, stderr) => {
        utils.parseData(cmd, error, stdout, stderr)

        if (cmd.data[0].entryCount > 100) {
            cmd.level = 'fail'
        } else if (cmd.data[0].size > 50000 || cmd.data[0].unpackedSize > 100000) {
            cmd.level = 'fail'
        }

        return cmd
    }
}

module.exports = cmd
