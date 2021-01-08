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

    display: async (method, args) => {
        for (const reporterName in global.reporters) {
            const reporter = global.reporters[reporterName]
            await reporter[method].apply(reporter, args)
        }
    }
}
