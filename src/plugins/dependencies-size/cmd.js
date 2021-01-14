'use strict'
const path = require('path')
const utils = require(path.join(__dirname, '/../utils.js'))
const getFolderSize = require('get-folder-size')

const promiseFolderSize = (folder) => {
    return new Promise((resolve, reject) => {
        getFolderSize(folder, (err, size) => {
            if (err) { return reject(err) }
            resolve(size)
        })
    })
}

const cmd = {
    cmd: 'npm ls --production --parseable',
    title: 'Dependencies size',
    doc: 'https://github.com/wallet77/qualscan/blob/main/doc/dependencies-size.md',
    callback: async (error, stdout, stderr) => {
        if (error) {
            cmd.error = error
            cmd.level = 'fail'
            return cmd
        }
        const data = stdout.split('\n')
        data.splice(0, 1)

        const budget = global.argv['dependencies-size'].budget
        utils.initBudget(cmd, budget, '', '', utils.format)

        cmd.data = {
            dependencies: data,
            values: {
                directDependencies: Object.keys(global.packagefile.dependencies).length,
                dependencies: data.length,
                weight: await promiseFolderSize(path.join(process.cwd(), 'node_modules'))
            }
        }

        utils.processBudget(cmd, budget, cmd.data.values, utils.format)

        return cmd
    }
}

utils.loadReporters(cmd, __dirname)

module.exports = cmd
