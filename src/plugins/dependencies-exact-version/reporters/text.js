const path = require('path')
const AbstractPluginReporter = require(path.join(__dirname, '../../../reporters/AbstractPluginReporter'))

class TextReporter extends AbstractPluginReporter {
    constructor (cmd) {
        super(cmd)
        this.cmd = cmd
    }

    verbose () {
        console.log(`Dependencies: ${Object.keys(this.cmd.data.dependencies).join(', ')}`)
        console.log(`Dev dependencies: ${Object.keys(this.cmd.data.devDependencies).join(', ')}`)
    }
}

module.exports = TextReporter
