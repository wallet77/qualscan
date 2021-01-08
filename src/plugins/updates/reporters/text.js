const path = require('path')
const AbstractPluginReporter = require(path.join(__dirname, '../../../reporters/AbstractPluginReporter'))

class TextReporter extends AbstractPluginReporter {
    constructor (cmd) {
        super(cmd)
        this.cmd = cmd
    }

    verbose () {
        for (const module in this.cmd.data) {
            console.log(`${module}: ${this.cmd.data[module].current} -> ${this.cmd.data[module].latest}`)
        }
    }
}

module.exports = TextReporter
