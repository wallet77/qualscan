#!/usr/bin/env node

const { exec } = require('child_process')
const ora = require('ora')
const path = require('path')
const fs = require('fs')

const cmdListDefault = ['code_duplication', 'npm_audit', 'npm_outdated', 'package-check', 'dependencies-exact-version']
const scriptListDefault = process.env.SCRIPTS_LIST ? process.env.SCRIPTS_LIST.split(',') : []

const knownScripts = ['test', 'lint', 'linter']

console.log('\x1b[33m%s\x1b[0m', '   ____              __                    \r\n  / __ \\__  ______ _/ /_____________ _____ \r\n / / / / / / / __ `/ / ___/ ___/ __ `/ __ \\\r\n/ /_/ / /_/ / /_/ / (__  ) /__/ /_/ / / / /\r\n\\___\\_\\__,_/\\__,_/_/____/\\___/\\__,_/_/ /_/ ')
console.log('\n')

try {
    global.packagefile = require(path.join(process.cwd(), 'package.json'))
    if (global.packagefile.scripts && scriptListDefault.length === 0) {
        for (const index in knownScripts) {
            const script = knownScripts[index]
            if (global.packagefile.scripts[script]) {
                scriptListDefault.push(script)
            }
        }
    }
} catch (err) {
    console.error('No package.json file found!')
    console.error('Qualscan requires a valid Javascript project structure with a package.json file.')
    process.exit(1)
}

const rcFilePath = path.join(process.cwd(), '.qualscanrc')
let conf
if (fs.existsSync(rcFilePath)) {
    try {
        conf = JSON.parse(fs.readFileSync(rcFilePath))
    } catch (err) {
        console.warn('Invalid .qualscanrc file format, Qualscan requires a valid JSON file!')
        console.warn('.qualscanrc file has been ignored.')
    }
}

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

const init = !conf ? require('yargs')(process.argv.slice(2)).config() : require('yargs')(process.argv.slice(2)).config(conf)

global.argv = init
    .help('h')
    .alias('h', 'help')
    .option('errors', {
        alias: 'e',
        type: 'boolean',
        description: 'Display error information for each task which has failed'
    })
    .option('warnings', {
        alias: 'w',
        type: 'boolean',
        description: 'Display output for each task which has a warning'
    })
    .option('infos', {
        alias: 'i',
        type: 'boolean',
        description: 'Display output for each task which has an information'
    })
    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Display detailed result for all tasks'
    })
    .option('tasks', {
        alias: 't',
        type: 'array',
        description: 'List of tasks to run'
    })
    .option('scripts', {
        alias: 's',
        type: 'array',
        description: 'List of scripts to run'
    })
    .option('code-duplication', {
        alias: 'cd',
        type: 'string',
        description: 'Args for code duplication plugins'
    })
    .option('check-dev-dependencies', {
        alias: 'cdd',
        type: 'boolean',
        description: 'Check dev dependencies exact version'
    })
    .argv

const prepareCmd = (cmdName, allCmds, skipped, isScript = false) => {
    const cmdDir = !isScript ? cmdName : 'run_script'
    try {
        const CmdEntrypoint = require(path.join(__dirname, `/src/plugins/${cmdDir}/cmd.js`))
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
}

(async () => {
    const allCmds = []
    const cmdList = global.argv.tasks || cmdListDefault
    const scriptList = global.argv.scripts || scriptListDefault
    const skipped = []
    const skippedScripts = []

    for (const index in cmdList) {
        prepareCmd(cmdList[index], allCmds, skipped)
    }

    for (const index in scriptList) {
        const script = scriptList[index]
        if (!global.packagefile.scripts || !global.packagefile.scripts[script]) {
            skippedScripts.push(script)
        } else {
            prepareCmd(script, allCmds, skipped, true)
        }
    }

    try {
        const res = await Promise.all(allCmds)
        let hasError = false
        let hasWarning = false
        let hasInfo = false

        for (const i in res) {
            const cmd = res[i]

            hasError = hasError || cmd.level === 'fail'
            hasWarning = hasWarning || cmd.level === 'warn'
            hasInfo = hasInfo || cmd.level === 'info'

            if (global.argv.verbose ||
                (global.argv.errors && cmd.level === 'fail') ||
                (global.argv.warnings && cmd.level === 'warn') ||
                (global.argv.infos && cmd.level === 'info')) {
                console.log('\n\n')
                console.log('--------------------------------------------------------------')
                console.log(cmd.title)
                console.log('--------------------------------------------------------------')
                console.log(cmd.data)
            }
        }

        if (skipped.length > 0) {
            console.log('\n')
            console.log('--------------------------------------------------------------')
            console.log('Skipped plugins')
            console.log('--------------------------------------------------------------')
            for (const index in skipped) {
                const skippedPlugin = skipped[index]
                console.warn(`    ${skippedPlugin.name} - ${skippedPlugin.reason}`)
            }
        }
        if (skippedScripts.length > 0) {
            console.log('\n')
            console.log('--------------------------------------------------------------')
            console.log('Skipped scripts')
            console.log('--------------------------------------------------------------')
            for (const index in skippedScripts) {
                const skippedScript = skippedScripts[index]
                console.warn(`    ${skippedScript} - does not exist in package.json!`)
            }
        }
        process.exit(hasError ? 1 : 0)
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
})()
