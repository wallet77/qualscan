'use strict'
const path = require('path')
const utils = require(path.join(__dirname, '/../utils.js'))
const getFolderSize = require('get-folder-size')
const { exec } = require('child_process')

const promiseFolderSize = (folder) => {
    return new Promise((resolve, reject) => {
        getFolderSize(folder, (err, size) => {
            if (err) { return reject(err) }
            resolve(size)
        })
    })
}

const treeDepth = (obj, depth = 0) => {
    let childrenDepth = depth
    if (obj.dependencies) {
        for (const moduleName in obj.dependencies) {
            childrenDepth = Math.max(childrenDepth, treeDepth(obj.dependencies[moduleName], depth + 1))
        }
    }

    return Math.max(depth, childrenDepth)
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

        let depth = 0
        if (stdout !== '') {
            const res = await (new Promise((resolve) => {
                exec('npm ls --production --json', { cwd: process.env.QUALSCAN_PROJECT_PATH }, (e, stdout) => {
                    resolve(JSON.parse(stdout))
                })
            }))

            depth = treeDepth(res)
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
                weight,
                depth
            }
        }

        utils.processBudget(cmd, budget, cmd.data.values)

        return cmd
    }
}

utils.loadReporters(cmd, __dirname)

module.exports = cmd
