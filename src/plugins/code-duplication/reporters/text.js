const path = require('path')
const AbstractPluginReporter = require(path.join(__dirname, '../../../reporters/AbstractPluginReporter'))

class TextReporter extends AbstractPluginReporter {
    constructor (cmd) {
        super(cmd)
        this.cmd = cmd
    }

    verbose () {
        console.log(`Nb lines: ${this.cmd.data.statistics.total.lines}`)
        console.log(`Nb tokens: ${this.cmd.data.statistics.total.tokens}`)
        console.log(`Clones found: ${this.cmd.data.statistics.total.clones}`)
        console.log(`Duplicated lines: ${this.cmd.data.statistics.total.duplicatedLines}`)
        console.log(`Duplicated tokens: ${this.cmd.data.statistics.total.duplicatedTokens}`)

        for (let i = 0; i < this.cmd.data.duplicates.length; i++) {
            const duplicate = this.cmd.data.duplicates[i]
            console.log('\n')
            console.log(`  - ${duplicate.firstFile.name} - ${duplicate.firstFile.startLoc.line}:${duplicate.firstFile.startLoc.column} to ${duplicate.firstFile.endLoc.line}:${duplicate.firstFile.endLoc.column}`)
            console.log(`  - ${duplicate.secondFile.name} - ${duplicate.secondFile.startLoc.line}:${duplicate.secondFile.startLoc.column} to ${duplicate.secondFile.endLoc.line}:${duplicate.secondFile.endLoc.column}`)
            console.log('\n')
        }
    }
}

module.exports = TextReporter
