const { exec } = require('child_process')
const ora = require('ora')
const path = require('path')

const preRunCmd = (cmd) => {
    const spinner = ora()
    spinner.color = 'yellow'
    spinner.indent = 2

    spinner.start(cmd.title)

    return spinner
}

const postRunCmd = (cmd, spinner) => {
    spinner[cmd.level](cmd.title)
}

const runCmd = async (cmd) => {
    let spinner
    if (global.qualscanCLI) spinner = preRunCmd(cmd)

    if (!cmd.cmd) {
        await cmd.callback()
        if (global.qualscanCLI) postRunCmd(cmd, spinner)
        return cmd
    }

    return new Promise((resolve, reject) => {
        exec(cmd.cmd, async (error, stdout, stderr) => {
            try {
                await cmd.callback(error, stdout, stderr)

                if (global.qualscanCLI) postRunCmd(cmd, spinner)

                resolve(cmd)
            } catch (err) {
                cmd.level = 'fail'
                if (global.qualscanCLI) postRunCmd(cmd, spinner)
                // cmd.spinner.fail(cmd.title)
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
