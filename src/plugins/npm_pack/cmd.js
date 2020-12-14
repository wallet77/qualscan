'use strict'
const path = require('path')
const utils = require(path.join(__dirname, '/../utils.js'))

const cmd = {
    cmd: 'npm pack --dry-run --json',
    title: 'Project size',
    doc: 'https://github.com/wallet77/qualscan/blob/main/doc/npm_pack.md',
    callback: async (error, stdout, stderr) => {
        utils.parseData(cmd, error, stdout, stderr)

        if (cmd.data[0].entryCount > global.argv['number-of-files-limit']) {
            cmd.level = 'fail'
        } else if (cmd.data[0].size > global.argv['package-size-limit'] || cmd.data[0].unpackedSize > global.argv['unpacked-size-limit']) {
            cmd.level = 'fail'
        }

        return cmd
    }
}

module.exports = cmd
