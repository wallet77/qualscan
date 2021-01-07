const path = require('path')
const filesize = require('filesize')
const AbstractPluginReporter = require(path.join(__dirname, '../../../reporters/AbstractPluginReporter'))

class TextReporter extends AbstractPluginReporter {
    constructor (cmd) {
        super(cmd)
        this.cmd = cmd
    }

    verbose () {
        console.log(`Size: ${!isNaN(this.cmd.data[0].size) ? filesize(this.cmd.data[0].size, { base: 10 }) : this.cmd.data[0].size}`)
        console.log(`Unpacked size: ${!isNaN(this.cmd.data[0].unpackedSize) ? filesize(this.cmd.data[0].unpackedSize, { base: 10 }) : this.cmd.data[0].unpackedSize}`)
        console.log(`Nb files: ${this.cmd.data[0].entryCount}`)
    }
}

module.exports = TextReporter
