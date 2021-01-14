const path = require('path')
const AbstractPluginReporter = require(path.join(__dirname, '../../../reporters/AbstractPluginReporter'))
const utils = require(path.join(__dirname, '../../utils.js'))

class TextReporter extends AbstractPluginReporter {
    constructor (cmd) {
        super(cmd)
        this.cmd = cmd
    }

    verbose () {
        console.log(`Size: ${utils.format(this.cmd.data[0].size, 'size')}`)
        console.log(`Unpacked size: ${utils.format(this.cmd.data[0].unpackedSize, 'unpackedSize')}`)
        console.log(`Nb files: ${this.cmd.data[0].entryCount}`)
    }
}

module.exports = TextReporter
