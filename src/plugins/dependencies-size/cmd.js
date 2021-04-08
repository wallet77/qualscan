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

const treeDepth = (deps, obj, depth = 0) => {
    let childrenDepth = depth
    if (obj.dependencies) {
        for (const moduleName in obj.dependencies) {
            deps[moduleName] = true
            childrenDepth = Math.max(childrenDepth, treeDepth(deps, obj.dependencies[moduleName], depth + 1))
        }
    }
    return Math.max(depth, childrenDepth)
}

const args = utils.getArgs()

const cmd = {
    cmd: `npm ls --json ${args}`,
    title: 'Dependencies size',
    doc: 'https://github.com/wallet77/qualscan/blob/main/doc/dependencies-size.md',
    callback: async (error, stdout, stderr) => {
        if (error) {
            cmd.error = error
            cmd.level = 'fail'
        }

        const res = JSON.parse(stdout)
        const deps = {}
        const depth = treeDepth(deps, res)

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
            dependencies: deps,
            values: {
                directDependencies: global.packagefile.dependencies ? Object.keys(global.packagefile.dependencies).length : 0,
                dependencies: Object.keys(deps).length,
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
