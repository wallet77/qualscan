const path = require('path')
const AbstractPluginReporter = require(path.join(__dirname, '../../../reporters/AbstractPluginReporter'))

class TextReporter extends AbstractPluginReporter {
    constructor (cmd) {
        super(cmd)
        this.cmd = cmd
    }

    verbose () {
        console.log(`  - Critical: ${this.cmd.data.metadata.vulnerabilities.critical}`)
        console.log(`  - High: ${this.cmd.data.metadata.vulnerabilities.high}`)
        console.log(`  - Moderate: ${this.cmd.data.metadata.vulnerabilities.moderate}`)
        console.log(`  - Low: ${this.cmd.data.metadata.vulnerabilities.low}`)
        console.log(`  - Info: ${this.cmd.data.metadata.vulnerabilities.info}`)
    }
}

module.exports = TextReporter
