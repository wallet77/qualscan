const path = require('path')
const AbstractReporter = require(path.join(__dirname, './AbstractReporter'))
const fs = require('fs')

const cleanJSON = (report) => {
    for (const i in report.data.cmds) {
        delete report.data.cmds[i].reporters
    }
}

class JsonReporter extends AbstractReporter {
    constructor () {
        super()
        this.filePath = global.argv.reportPath
    }

    displayBudgets (budgetInfo) {}

    displayVerbose (cmd) {}

    displaySkippedPlugins (skipped) {}

    displaySkippedScripts (skippedScripts) {}

    displayScore (score, res) {}

    start () {}

    async end (report) {
        // clean unused fields
        cleanJSON(report)
        if (this.filePath) {
            await fs.promises.mkdir(this.filePath, { recursive: true })
            await fs.promises.writeFile(path.join(this.filePath, '/qualscan_report.json'), JSON.stringify(report.data), 'utf8')
            console.log(`JSON file has been saved in ${this.filePath}`)
        }
        console.log(report)
    }
}

module.exports = new JsonReporter()
