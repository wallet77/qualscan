const fs = require('fs')
const path = require('path')

module.exports = {
    parseData: (cmd, error, stdout, stderr) => {
        const data = JSON.parse(stdout)

        cmd.data = data
        cmd.level = 'succeed'

        if (error) {
            cmd.level = 'fail'
            cmd.error = error
        }
    },

    initBudget: (cmd, budget, prefix, suffix, format = (value, column) => { return value }) => {
        cmd.budget = {}
        cmd.level = 'succeed'

        for (const threshold in budget) {
            for (const metric in budget[threshold]) {
                if (!cmd.budget[threshold]) {
                    cmd.budget[threshold] = {}
                }
                cmd.budget[threshold][metric] = {
                    plugin: cmd.title,
                    threshold: threshold,
                    level: 'succeed',
                    metric: metric,
                    value: 0,
                    limit: format(budget[threshold][metric], metric),
                    unit: `${prefix}${metric}${suffix}`
                }
            }
        }
    },

    processBudget: (cmd, budget, data, format = (value, column) => { return value }) => {
        const levels = ['succeed', 'info', 'warn', 'fail']

        for (const threshold in budget) {
            for (const metric in budget[threshold]) {
                cmd.budget[threshold][metric].value = format(data[metric], metric)
                if (data[metric] > budget[threshold][metric]) {
                    cmd.budget[threshold][metric].level = threshold

                    if (levels.indexOf(cmd.level) < levels.indexOf(threshold)) {
                        cmd.level = threshold
                    }
                }
            }
        }
    },

    loadReporters: (cmd, cmdPath) => {
        cmd.reporters = {}

        for (const reporterName in global.reporters) {
            const reporterPath = path.join(cmdPath, './reporters/', `${reporterName}.js`)
            if (fs.existsSync(reporterPath)) {
                const ReporterClass = require(reporterPath)
                cmd.reporters[reporterName] = new ReporterClass(cmd)
            }
        }
    },

    displayArr: (arr) => {
        for (let i = 0; i < arr.length; i++) {
            console.log(`  - ${arr[i]}`)
        }
    },

    displayMap: (map) => {
        for (const dep in map) {
            console.log(`  - ${dep}`)
        }
    }
}
