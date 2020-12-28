#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const utils = require(path.join(__dirname, '/src/utils'))

const cmdListDefault = ['code_duplication', 'npm_audit', 'npm_outdated', 'package-check', 'dependencies-exact-version', 'npm_pack']
const scriptListDefault = process.env.SCRIPTS_LIST ? process.env.SCRIPTS_LIST.split(',') : []

const knownScripts = ['test', 'lint', 'linter']

console.log('\x1b[33m%s\x1b[0m', '   ____              __                    \r\n  / __ \\__  ______ _/ /_____________ _____ \r\n / / / / / / / __ `/ / ___/ ___/ __ `/ __ \\\r\n/ /_/ / /_/ / /_/ / (__  ) /__/ /_/ / / / /\r\n\\___\\_\\__,_/\\__,_/_/____/\\___/\\__,_/_/ /_/ ')
console.log('\n')

try {
    global.packagefile = require(path.join(process.cwd(), 'package.json'))
    if (global.packagefile.scripts && scriptListDefault.length === 0) {
        for (let index = 0; index < knownScripts.length; index++) {
            const script = knownScripts[index]
            if (global.packagefile.scripts[script]) {
                scriptListDefault.push(script)
            }
        }
    }

    console.log(`Scanning ${global.packagefile.name}@${global.packagefile.version}`)
} catch (err) {
    console.error('No package.json file found!')
    console.error('Qualscan requires a valid Javascript project structure with a package.json file.')
    process.exit(1)
}

const rcFilePath = path.join(process.cwd(), '.qualscanrc')
let conf
if (fs.existsSync(rcFilePath)) {
    try {
        conf = JSON.parse(fs.readFileSync(rcFilePath))
    } catch (err) {
        console.warn('Invalid .qualscanrc file format, Qualscan requires a valid JSON file!')
        console.warn('.qualscanrc file has been ignored.')
    }
}

const init = !conf ? require('yargs')(process.argv.slice(2)).config() : require('yargs')(process.argv.slice(2)).config(conf)

global.argv = init
    .help('h')
    .alias('h', 'help')
    .options('level', {
        alias: 'l',
        type: 'string',
        description: 'Level of information to display (error, warnings, info, all)',
        default: 'all'
    })
    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Display detailed result for all tasks'
    })
    .option('tasks', {
        alias: 't',
        type: 'array',
        description: 'List of tasks to run'
    })
    .option('scripts', {
        alias: 's',
        type: 'array',
        description: 'List of scripts to run'
    })
    .option('code-duplication', {
        alias: 'cd',
        type: 'string',
        description: 'Args for code duplication plugins'
    })
    .option('check-dev-dependencies', {
        alias: 'cdd',
        type: 'boolean',
        description: 'Check dev dependencies exact version'
    })
    .option('number-of-files-limit', {
        alias: 'nofl',
        type: 'number',
        default: 100,
        description: 'Customize the number of files limit'
    })
    .option('package-size-limit', {
        alias: 'psl',
        type: 'number',
        default: 50000,
        description: 'Customize the package size limit'
    })
    .option('unpacked-size-limit', {
        alias: 'usl',
        type: 'number',
        default: 1000000,
        description: 'Customize the unpacked size limit'
    })
    .option('budget-info', {
        alias: 'bi',
        type: 'boolean',
        default: true,
        description: 'Display budgets info?'
    })
    .option('npm-audit.budget', {
        alias: 'nab',
        type: 'object',
        default: {
            fail: { critical: 0, high: 0 },
            warn: { moderate: 0, low: 0 },
            info: { info: 0 }
        },
        description: 'Set the budget for npm audit plugin.'
    })
    .argv

const levels = ['all', 'info', 'warn', 'fail']
const currentLevel = { error: 3, warn: 2, info: 1, all: 0 }[global.argv.level]
const colors = {
    fail: '\x1b[31m',
    succeed: '\x1b[32m',
    warn: '\x1b[33m',
    info: '\x1b[34m'
};

(async () => {
    const allCmds = []
    const cmdList = global.argv.tasks || cmdListDefault
    const scriptList = global.argv.scripts || scriptListDefault
    const skipped = []
    const skippedScripts = []

    for (const index in cmdList) {
        utils.prepareCmd(cmdList[index], allCmds, skipped)
    }

    for (let index = 0; index < scriptList.length; index++) {
        const script = scriptList[index]
        if (!global.packagefile.scripts || !global.packagefile.scripts[script]) {
            skippedScripts.push(script)
        } else {
            utils.prepareCmd(script, allCmds, skipped, true)
        }
    }

    try {
        const res = await Promise.all(allCmds)
        let hasError = false
        let hasWarning = false
        let hasInfo = false
        const budgetInfo = []

        for (const i in res) {
            const cmd = res[i]

            hasError = hasError || cmd.level === 'fail'
            hasWarning = hasWarning || cmd.level === 'warn'
            hasInfo = hasInfo || cmd.level === 'info'

            if (global.argv.budgetInfo && cmd.budget) {
                budgetInfo.push(cmd.budget)
            }

            if (global.argv.verbose &&
                (levels.indexOf(cmd.level) >= currentLevel ||
                (global.argv.level === 'all' && cmd.level === 'succeed'))) {
                console.log('\n\n')
                console.log(`${colors[cmd.level]}%s\x1b[0m`, '--------------------------------------------------------------')
                console.log(`${colors[cmd.level]}%s\x1b[0m`, cmd.title)
                console.log(`${colors[cmd.level]}%s\x1b[0m`, '--------------------------------------------------------------')
                console.log(cmd.data)

                if (cmd.cmd) {
                    console.log('\x1b[44m%s\x1b[0m', `    How to debug: "${cmd.cmd}"`)
                }

                if (cmd.doc) {
                    console.log('\x1b[2m%s\x1b[0m', `    How to fix: ${cmd.doc}`)
                }
            }
        }
        console.log(budgetInfo)
        utils.displayBudgets(budgetInfo, colors)

        if (skipped.length > 0) {
            console.log('\n')
            console.log('--------------------------------------------------------------')
            console.log('Skipped plugins')
            console.log('--------------------------------------------------------------')
            for (let index = 0; index < skipped.length; index++) {
                const skippedPlugin = skipped[index]
                console.warn(`    ${skippedPlugin.name} - ${skippedPlugin.reason}`)
            }
        }
        if (skippedScripts.length > 0) {
            console.log('\n')
            console.log('--------------------------------------------------------------')
            console.log('Skipped scripts')
            console.log('--------------------------------------------------------------')
            for (let index = 0; index < skippedScripts.length; index++) {
                const skippedScript = skippedScripts[index]
                console.warn(`    ${skippedScript} - does not exist in package.json!`)
            }
        }
        process.exit(hasError ? 1 : 0)
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
})()
