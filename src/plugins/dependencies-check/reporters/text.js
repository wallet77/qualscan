const path = require('path')
const AbstractPluginReporter = require(path.join(__dirname, '../../../reporters/AbstractPluginReporter'))
const utils = require(path.join(__dirname, '/../../utils.js'))

class TextReporter extends AbstractPluginReporter {
    verbose () {
        console.log('Unused dependencies:')
        utils.displayArr(this.cmd.data.dependencies)
        console.log('Unused dev dependencies:')
        utils.displayArr(this.cmd.data.devDependencies)
        console.log('Missing:')
        utils.displayMap(this.cmd.data.missing)
    }
}

module.exports = TextReporter
