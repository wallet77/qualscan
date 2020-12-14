'use strict'

const semver = require('semver')

const cmd = {
    cmd: 'npm outdated -json -long',
    title: 'Dependencies updates',
    doc: 'https://github.com/wallet77/qualscan/blob/main/doc/npm_outdated.md',
    callback: (error, stdout, stderr) => {
        if (stdout === '') {
            cmd.level = 'succeed'
            return cmd
        }

        const data = JSON.parse(stdout)

        cmd.data = data
        cmd.level = 'succeed'

        let currentLevel = -1

        for (const moduleName in data) {
            const module = data[moduleName]

            if (module.type === 'devDependencies' && currentLevel === -1) {
                currentLevel = 0
                cmd.level = 'info'
                continue
            }

            if (semver.major(module.current) < semver.major(module.latest)) {
                cmd.level = 'fail'
                break
            } else if (semver.minor(module.current) < semver.minor(module.latest) && currentLevel < 1) {
                currentLevel = 1
                cmd.level = 'warn'
            } else if (semver.patch(module.current) < semver.patch(module.latest) && currentLevel === -1) {
                currentLevel = 0
                cmd.level = 'info'
            }
        }

        if (error && cmd.level === 'succeed') {
            cmd.level = 'fail'
            cmd.error = error
        }

        return cmd
    }
}

module.exports = cmd
