#!/usr/bin/env node

const { exec } = require('child_process')
const ora = require('ora')
const path = require('path')

const cmdList = ['jscpd', 'npm_audit', 'npm_outdated']

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

const argv = require('yargs')(process.argv.slice(2))
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
    .argv;

(async () => {
    console.log('Qualscan ...')

    const allCmds = []

    for (const index in cmdList) {
        const cmdEntrypoint = require(path.join(__dirname, `/src/plugins/${cmdList[index]}/cmd.js`))
        allCmds.push(runCmd(cmdEntrypoint))
    }

    try {
        const res = await Promise.all(allCmds)

        for (const i in res) {
            const cmd = res[i]
            if (argv.verbose ||
                (argv.errors && cmd.level === 'fail') ||
                (argv.warnings && cmd.level === 'warn') ||
                (argv.infos && cmd.level === 'info')) {
                console.log('--------------------------------------------------------------')
                console.log(cmd.title)
                console.log(cmd.data)
            }
        }
    } catch (err) {
        console.log(err)
    }
})()
