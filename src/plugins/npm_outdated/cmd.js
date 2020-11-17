'use strict'

const semver = require('semver')

module.exports = {
    cmd: 'npm outdated -json -long',
    title: 'Dependencies updates',
    callback: async (error, stdout, stderr) => {
        if (stdout === '') return { level: 'succeed' }

        const data = JSON.parse(stdout)

        const res = {
            data: data,
            level: 'succeed'
        }

        let currentLevel = -1

        for (const moduleName in data) {
            const module = data[moduleName]

            if (module.type === 'devDependencies' && currentLevel === -1) {
                currentLevel = 0
                res.level = 'info'
                continue
            }

            if (semver.major(module.current) < semver.major(module.latest)) {
                currentLevel = 2
                res.level = 'fail'
                break
            } else if (semver.minor(module.current) < semver.minor(module.latest) && currentLevel < 1) {
                currentLevel = 1
                res.level = 'warn'
            } else if (semver.patch(module.current) < semver.patch(module.latest) && currentLevel === -1) {
                currentLevel = 0
                res.level = 'info'
            }
        }

        if (error && res.level === 'succeed') {
            res.level = 'fail'
            console.error(error)
        }

        return res
    }
}
