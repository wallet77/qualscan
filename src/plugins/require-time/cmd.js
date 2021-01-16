'use strict'
const path = require('path')
const { fork } = require('child_process')

const utils = require(path.join(__dirname, '/../utils.js'))

const getModuleData = (module) => {
    return new Promise((resolve, reject) => {
        let data

        const env = {
            MODULE: module
        }
        const child = fork(path.join(__dirname, 'loadDep.js'), [], {
            env: env,
            silent: true
        })

        child.on('message', message => {
            data = message
            child.kill()
        })

        child.on('exit', () => {
            resolve(data)
        })
    })
}

const cmd = {
    title: 'Require time',
    doc: 'https://github.com/wallet77/qualscan/blob/main/doc/require-time.md',
    callback: async () => {
        const res = {
            directDeps: {}
        }
        // for (const dep in global.packagefile.dependencies) {
        //     const data = await getModuleData(path.join(process.cwd(), 'node_modules', dep))
        //     res.directDeps[dep] = data
        // }

        require(global.argv['require-time'].entrypoint)
        res.entrypoint = await getModuleData(global.argv['require-time'].entrypoint)

        cmd.data = {
            entrypointTime: res.entrypoint[global.argv['require-time'].entrypoint].duration,
            raw: res
        }

        const budget = global.argv['require-time'].budget
        utils.initBudget(cmd, budget, '', '', utils.prettyNano)

        utils.processBudget(cmd, budget, cmd.data, utils.prettyNano)

        return cmd
    }
}

utils.loadReporters(cmd, __dirname)

module.exports = cmd
