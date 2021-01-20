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
        }

        let weight = 0
        const folderNodeModules = path.join(process.env.QUALSCAN_PROJECT_PATH, 'node_modules')
        try {
            weight = await promiseFolderSize(folderNodeModules)
        } catch (err) {
            console.log('No node_modules found!')
        }

        const data = stdout.split('\n').filter(Boolean)
        data.shift()

        const budget = global.argv['dependencies-size'].budget
        utils.initBudget(cmd, budget, '', '', utils.format)
        cmd.data = {
            dependencies: data,
            values: {
                directDependencies: global.packagefile.dependencies ? Object.keys(global.packagefile.dependencies).length : 0,
                dependencies: data.length,
                weight: weight
            }
        }

        utils.processBudget(cmd, budget, cmd.data.values, utils.format)

        return cmd
    }
}

utils.loadReporters(cmd, __dirname)

module.exports = cmd
