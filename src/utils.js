const { exec } = require('child_process')
const ora = require('ora')
const path = require('path')

const runCmd = async (cmd) => {
    const spinner = ora()
    spinner.color = 'yellow'
    spinner.indent = 2

    spinner.start(cmd.title)

    if (!cmd.cmd) {
        await cmd.callback()
        spinner[cmd.level](cmd.title)
        return cmd
    }

    return new Promise((resolve, reject) => {
        exec(cmd.cmd, async (error, stdout, stderr) => {
            try {
                await cmd.callback(error, stdout, stderr)

                spinner[cmd.level](cmd.title)

                resolve(cmd)
            } catch (err) {
                spinner.fail(cmd.title)
                reject(err)
            }
        })
    })
}

module.exports = {
    prepareCmd: (cmdName, allCmds, skipped, isScript = false) => {
        const cmdDir = !isScript ? cmdName : 'run_script'
        try {
            const CmdEntrypoint = require(path.join(__dirname, `./plugins/${cmdDir}/cmd.js`))
            if (isScript) {
                const instanceScript = new CmdEntrypoint(cmdName, `npm run ${cmdName}`)
                allCmds.push(runCmd(instanceScript))
            } else {
                allCmds.push(runCmd(CmdEntrypoint))
            }
        } catch (err) {
            skipped.push({
                name: cmdName,
                reason: "Module doesn't exist!!!!"
            })
        }
    },

    displayBudgets: (budgetInfo, colors) => {
        if (global.argv.budgetInfo) {
            console.log('\n\n')
            console.log('\x1b[44m%s\x1b[0m\u2935', 'Budgets')
            for (let i = 0; i < budgetInfo.length; i++) {
                const pluginBudgets = budgetInfo[i]
                for (const threshold in pluginBudgets) {
                    for (const metric in pluginBudgets[threshold]) {
                        const budget = pluginBudgets[threshold][metric]
                        let prefix = '\x1b[42mSUCCESS\x1b[0m'
                        let color = colors.succeed
                        if (budget.level !== 'succeed') {
                            prefix = '\x1b[41mFAIL\x1b[0m   '
                            color = colors.fail
                        }
                        console.log(`    %s %s - %s  ${color}%s\x1b[0m/%s %s`, prefix, budget.plugin, budget.threshold, budget.value, budget.limit, budget.unit)
                    }
                }
            }
        }
    }
}
