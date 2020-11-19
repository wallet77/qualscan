#!/usr/bin/env node

const { exec } = require('child_process')
const ora = require('ora')
const path = require('path')

const cmdListDefault = ['code_duplication', 'npm_audit', 'npm_outdated']

const runCmd = (cmd) => {
    const spinner = ora()
    spinner.color = 'yellow'
    spinner.indent = 2

    spinner.start(cmd.title)

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

global.argv = require('yargs')(process.argv.slice(2))
    .config()
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
    .option('code-duplication', {
        alias: 'cd',
        type: 'string',
        description: 'Args for code duplication plugins'
    })
    .argv;

(async () => {
    console.log('Qualscan ...')

    const allCmds = []
    const cmdList = global.argv.tasks || cmdListDefault
    const skipped = []

    for (const index in cmdList) {
        try {
            const cmdEntrypoint = require(path.join(__dirname, `/src/plugins/${cmdList[index]}/cmd.js`))
            allCmds.push(runCmd(cmdEntrypoint))
        } catch (err) {
            skipped.push({
                name: cmdList[index],
                reason: "Module doesn't exist!!!!"
            })
        }
    }

    try {
        const res = await Promise.all(allCmds)

        for (const i in res) {
            const cmd = res[i]
            if (global.argv.verbose ||
                (global.argv.errors && cmd.level === 'fail') ||
                (global.argv.warnings && cmd.level === 'warn') ||
                (global.argv.infos && cmd.level === 'info')) {
                console.log('--------------------------------------------------------------')
                console.log(cmd.title)
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
    } catch (err) {
        console.log(err)
    }
})()
