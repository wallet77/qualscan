#!/usr/bin/env node

const { exec } = require('child_process')
const ora = require('ora')
const path = require('path')

const cmdList = ['jscpd', 'npm_audit', 'npm_outdated']

const runCmd = (cmd) => {
    const spinner = ora()
    spinner.color = 'yellow'

    spinner.start(cmd.title)

    return new Promise((resolve, reject) => {
        exec(cmd.cmd, async (error, stdout, stderr) => {
            try {
                const res = await cmd.callback(error, stdout, stderr)

                spinner[res.level](cmd.title)

                resolve(res)
            } catch (err) {
                spinner.fail(cmd.title)
                reject(err)
            }
        })
    })
}

(async () => {
    console.log('Qualscan ...')

    const allCmds = []

    for (const index in cmdList) {
        const cmdEntrypoint = require(path.join(__dirname, `/src/plugins/${cmdList[index]}/cmd.js`))
        allCmds.push(runCmd(cmdEntrypoint))
    }

    try {
        await Promise.all(allCmds)
        // console.log(res)
    } catch (err) {
        console.log(err)
    }
})()
