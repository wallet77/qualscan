'use strict'

const semver = require('semver')
const path = require('path')
const utils = require(path.join(__dirname, '/../utils.js'))

/**
 * Creates a RegExp from the given string, converting asterisks to .* expressions,
 * and escaping all other characters.
 */
const wildcardToRegExp = (s) => {
    return new RegExp('^' + s.split(/\*+/).map(regExpEscape).join('.*') + '$')
}

/**
 * RegExp-escapes all characters in the given string.
 */
const regExpEscape = (s) => {
    return s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
}

/**
 * Check if a module respect all rules.
 */
const hasTobeExcluded = (moduleName, listOfRules = []) => {
    for (let i = 0; i < listOfRules.length; i++) {
        if (wildcardToRegExp(listOfRules[i]).test(moduleName)) return true
    }

    return false
}

const cmd = {
    cmd: 'npm outdated -json -long',
    title: 'Dependencies updates',
    doc: 'https://github.com/wallet77/qualscan/blob/main/doc/updates.md',
    callback: (error, stdout, stderr) => {
        let data = {}
        if (stdout !== '') {
            data = JSON.parse(stdout)
        }

        cmd.data = data
        cmd.level = 'succeed'

        const budget = global.argv.updates.budget
        utils.initBudget(cmd, budget, 'nb ', '')

        const values = {
            major: 0, minor: 0, patch: 0
        }

        for (const moduleName in data) {
            const module = data[moduleName]

            if (hasTobeExcluded(moduleName, global.argv.updates.exclude)) {
                continue
            }

            if (module.type === 'devDependencies' && !global.argv.updates.devDependencies) {
                continue
            }

            if (!semver.valid(module.current) || !semver.valid(module.latest)) {
                continue
            }

            if (semver.major(module.current) < semver.major(module.latest)) {
                values.major++
            } else if (semver.minor(module.current) < semver.minor(module.latest)) {
                values.minor++
            } else if (semver.patch(module.current) < semver.patch(module.latest)) {
                values.patch++
            }
        }
        utils.processBudget(cmd, budget, values)

        if (error) {
            cmd.error = error
        }

        return cmd
    }
}

utils.loadReporters(cmd, __dirname)

module.exports = cmd
