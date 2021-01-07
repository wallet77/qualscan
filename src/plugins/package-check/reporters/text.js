const path = require('path')
const AbstractPluginReporter = require(path.join(__dirname, '../../../reporters/AbstractPluginReporter'))

class TextReporter extends AbstractPluginReporter {
    constructor (cmd) {
        super(cmd)
        this.cmd = cmd
    }
}

module.exports = TextReporter
