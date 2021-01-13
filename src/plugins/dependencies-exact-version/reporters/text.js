const path = require('path')
const AbstractPluginReporter = require(path.join(__dirname, '../../../reporters/AbstractPluginReporter'))
const utils = require(path.join(__dirname, '/../../utils.js'))

class TextReporter extends AbstractPluginReporter {
    verbose () {
        console.log('Dependencies:')
        utils.displayMap(this.cmd.data.dependencies)
        console.log('Dev dependencies:')
        utils.displayMap(this.cmd.data.devDependencies)
    }
}

module.exports = TextReporter
