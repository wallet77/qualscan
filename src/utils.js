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
    if (global.qualscanCLI) spinner[cmd.level](cmd.title)
}

const runCmd = async (cmd) => {
    let spinner
    if (global.qualscanCLI) spinner = preRunCmd(cmd)

    if (!cmd.cmd) {
        await cmd.callback()
        postRunCmd(cmd, spinner)
        return cmd
    }

    return new Promise((resolve, reject) => {
        exec(cmd.cmd, { cwd: process.env.QUALSCAN_PROJECT_PATH }, async (error, stdout, stderr) => {
            try {
                await cmd.callback(error, stdout, stderr)

                postRunCmd(cmd, spinner)

                resolve(cmd)
            } catch (err) {
                cmd.level = 'fail'
                postRunCmd(cmd, spinner)
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

        // clean variables
        if (method === 'end') {
            delete process.env.QUALSCAN_PROJECT_PATH
            delete global.packagefile
            delete global.argv
            delete global.reporters
            delete global.qualscanCLI
        }
    },

    getEntrypoint: () => {
        let entrypoint = 'index.js'
        if (global.packagefile.main) {
            entrypoint = global.packagefile.main
        } else if (global.packagefile.exports) {
            if (typeof global.packagefile.exports === 'string') {
                entrypoint = global.packagefile.exports
            } else if (Object.prototype.hasOwnProperty.call(global.packagefile.exports, 'require')) {
                entrypoint = global.packagefile.exports.require
            } else if (Object.prototype.hasOwnProperty.call(global.packagefile.exports, '.')) {
                entrypoint = global.packagefile.exports['.']
            }
        }

        return path.join(process.env.QUALSCAN_PROJECT_PATH, entrypoint)
    }
}
