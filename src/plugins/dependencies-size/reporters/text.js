const path = require('path')
const AbstractPluginReporter = require(path.join(__dirname, '../../../reporters/AbstractPluginReporter'))
const utils = require(path.join(__dirname, '../../utils.js'))

class TextReporter extends AbstractPluginReporter {
    verbose () {
        console.log(`  - Numder of direct depedencies: ${this.cmd.data.values.directDependencies}`)
        console.log(`  - Numder of total depedencies: ${this.cmd.data.values.dependencies}`)
        console.log(`  - Weight of all dependencies: ${utils.format(this.cmd.data.values.weight)}`)
        console.log(`  - Max dependencies tree depth: ${this.cmd.data.values.depth}`)
    }
}

module.exports = TextReporter
