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

    initBudget: (cmd, budget, prefix, suffix) => {
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
                    unit: `${prefix}${metric}${suffix}`
                }
            }
        }
    },

    processBudget: (cmd, budget, data) => {
        const levels = ['succeed', 'info', 'warn', 'fail']

        for (const threshold in budget) {
            for (const metric in budget[threshold]) {
                if (data[metric] > budget[threshold][metric]) {
                    cmd.budget[threshold][metric].value = data[metric]
                    cmd.budget[threshold][metric].level = threshold

                    if (levels.indexOf(cmd.level) < levels.indexOf(threshold)) {
                        cmd.level = threshold
                    }
                }
            }
        }
    }
}
