const path = require('path')
const AbstractReporter = require(path.join(__dirname, './AbstractReporter'))
const prettyMS = require('pretty-ms')

class TextReporter extends AbstractReporter {
    constructor () {
        super()
        this.colors = {
            fail: '\x1b[31m',
            succeed: '\x1b[32m',
            warn: '\x1b[33m',
            info: '\x1b[34m'
        }
    }

    displayBudgets (budgetInfo) {
        if (global.argv.budgetInfo) {
            console.log('\n')
            console.log('\x1b[44m%s\x1b[0m\u2935', 'Budgets')
            for (let i = 0; i < budgetInfo.length; i++) {
                const pluginBudgets = budgetInfo[i]
                for (const threshold in pluginBudgets) {
                    for (const metric in pluginBudgets[threshold]) {
                        const budget = pluginBudgets[threshold][metric]
                        let prefix = '\x1b[42mSUCCESS\x1b[0m'
                        let color = this.colors.succeed
                        if (budget.level !== 'succeed') {
                            prefix = '\x1b[41mFAIL\x1b[0m   '
                            color = this.colors.fail
                        }
                        console.log(`    %s %s - %s  ${color}%s\x1b[0m/%s %s`, prefix, budget.plugin, budget.threshold, budget.format(budget.value, metric), budget.format(budget.limit, metric), budget.unit)
                    }
                }
            }
        }
    }

    displayVerbose (cmd) {
        console.log('\n\n')
        console.log(`${this.colors[cmd.level]}%s\x1b[0m`, '--------------------------------------------------------------')
        console.log(`${this.colors[cmd.level]}%s\x1b[0m`, cmd.title)
        console.log(`${this.colors[cmd.level]}%s\x1b[0m`, '--------------------------------------------------------------')

        cmd.reporters.text.verbose()

        console.log('\n')
        if (cmd.cmd) {
            console.log('\x1b[44m%s\x1b[0m', `    How to debug: "${cmd.cmd}"`)
        }

        if (cmd.doc) {
            console.log('\x1b[2m%s\x1b[0m', `    How to fix: ${cmd.doc}`)
        }
    }

    displaySkippedPlugins (skipped) {
        console.log('\n')
        console.log('--------------------------------------------------------------')
        console.log('Skipped plugins')
        console.log('--------------------------------------------------------------')
        for (let index = 0; index < skipped.length; index++) {
            const skippedPlugin = skipped[index]
            console.warn(`    ${skippedPlugin.name} - ${skippedPlugin.reason}`)
        }
    }

    displaySkippedScripts (skippedScripts) {
        console.log('\n')
        console.log('--------------------------------------------------------------')
        console.log('Skipped scripts')
        console.log('--------------------------------------------------------------')
        for (let index = 0; index < skippedScripts.length; index++) {
            const skippedScript = skippedScripts[index]
            console.warn(`    ${skippedScript} - does not exist in package.json!`)
        }
    }

    displayScore (score) {
        console.log('\n')
        console.log('\x1b[44mScore\x1b[0m %s/100', score)
    }

    start () {
        console.log(`Scanning ${global.packagefile.name}@${global.packagefile.version}`)
    }

    end (report) {
        console.log(`\nReport generated in ${prettyMS(report.time / 1000000)}`)
    }
}

module.exports = new TextReporter()
