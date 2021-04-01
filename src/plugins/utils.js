const fs = require('fs')
const path = require('path')
const filesize = require('filesize')
const prettyMilliseconds = require('pretty-ms')

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
                    limit: budget[threshold][metric],
                    unit: `${prefix}${metric}${suffix}`,
                    format: format
                }
            }
        }
    },

    processBudget: (cmd, budget, data) => {
        const levels = ['succeed', 'info', 'warn', 'fail']

        for (const threshold in budget) {
            for (const metric in budget[threshold]) {
                cmd.budget[threshold][metric].value = data[metric]
                if (budget[threshold][metric] !== 'unlimited' && data[metric] > budget[threshold][metric]) {
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
    },

    format: (value, metric) => {
        const excluded = ['entryCount', 'directDependencies', 'dependencies', 'depth']
        return excluded.indexOf(metric) === -1 && !isNaN(value) ? filesize(value, { base: 10 }) : value
    },

    prettyNano: (value) => {
        return prettyMilliseconds(value / 1000 / 1000)
    },

    getBinDir () {
        let dir = '/../../../node_modules/.bin/'
        if (!global.qualscanCLI) {
            dir = '/../../../../../node_modules/.bin'
        }
        return dir
    }
}
