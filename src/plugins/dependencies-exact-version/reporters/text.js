const path = require('path')
const AbstractPluginReporter = require(path.join(__dirname, '../../../reporters/AbstractPluginReporter'))

const display = (list) => {
    for (const dep in list) {
        console.log(`  - ${dep}`)
    }
}

class TextReporter extends AbstractPluginReporter {
    constructor (cmd) {
        super(cmd)
        this.cmd = cmd
    }

    verbose () {
        console.log('Dependencies:')
        display(this.cmd.data.dependencies)
        console.log('Dev dependencies:')
        display(this.cmd.data.devDependencies)
    }
}

module.exports = TextReporter
