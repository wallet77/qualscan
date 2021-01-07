#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const utils = require(path.join(__dirname, '/src/utils'))

const cmdListDefault = ['code-duplication', 'security-audit', 'updates', 'package-check', 'dependencies-exact-version', 'project-size']
const scriptListDefault = process.env.SCRIPTS_LIST ? process.env.SCRIPTS_LIST.split(',') : []

const knownScripts = ['test', 'lint', 'linter']

console.log('\x1b[33m%s\x1b[0m', '   ____              __                    \r\n  / __ \\__  ______ _/ /_____________ _____ \r\n / / / / / / / __ `/ / ___/ ___/ __ `/ __ \\\r\n/ /_/ / /_/ / /_/ / (__  ) /__/ /_/ / / / /\r\n\\___\\_\\__,_/\\__,_/_/____/\\___/\\__,_/_/ /_/ ')
console.log('\n')

// -----------------------------
// Get scripts from package.json
// -----------------------------
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
} catch (err) {
    console.error('No package.json file found!')
    console.error('Qualscan requires a valid Javascript project structure with a package.json file.')
    process.exit(1)
}

// -----------------------------
// Load .qualscanrc file
// -----------------------------
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

// -----------------------------
// Load conf
// -----------------------------
const init = !conf ? require('yargs')(process.argv.slice(2)).config() : require('yargs')(process.argv.slice(2)).config(conf)

// -----------------------------
// Get args from command line
// -----------------------------
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
    .option('budget-info', {
        alias: 'bi',
        type: 'boolean',
        default: true,
        description: 'Display budgets info?'
    })
    .option('security-audit.budget', {
        alias: 'nab',
        type: 'object',
        default: {
            fail: { critical: 0, high: 0 },
            warn: { moderate: 0, low: 0 },
            info: { info: 0 }
        },
        description: 'Set the budget for npm audit plugin.'
    })
    .option('code-duplication.args', {
        alias: 'cda',
        type: 'string',
        description: 'Args for code duplication plugins'
    })
    .option('code-duplication.budget', {
        alias: 'cdb',
        type: 'object',
        default: {
            fail: { percentageTokens: 0, percentage: 0 }
        },
        description: 'Set the budget for code duplication plugin (in percentage).'
    })
    .option('dependencies-exact-version.budget', {
        alias: 'devb',
        type: 'object',
        default: {
            fail: { dependencies: 0, devDependencies: 0 }
        },
        description: 'Set the budget for npm audit plugin.'
    })
    .option('dependencies-exact-version.devDependencies', {
        alias: 'devd',
        type: 'boolean',
        description: 'Check dev dependencies exact version'
    })
    .option('updates.budget', {
        alias: 'nob',
        type: 'object',
        default: {
            fail: { major: 0, minor: 5, patch: 10 },
            warn: { major: 0, minor: 1, patch: 5 },
            info: { major: 0, minor: 0, patch: 0 }
        },
        description: 'Set the budget for npm outdated plugin.'
    })
    .option('updates.devDependencies', {
        alias: 'nod',
        type: 'boolean',
        default: false,
        description: 'Take into account dev dependencies for updates?'
    })
    .option('project-size.budget', {
        alias: 'npb',
        type: 'object',
        default: {
            fail: { size: 50000, unpackedSize: 1000000, entryCount: 100 }
        },
        description: 'Set the budget for npm pack plugin.'
    })
    .option('reporters', {
        alias: 'r',
        type: 'array',
        description: 'List of reporters to use',
        default: ['text']
    })
    .argv

global.reporters = {}
for (let i = 0; i < global.argv.reporters.length; i++) {
    const reporter = global.argv.reporters[i]
    try {
        global.reporters[reporter] = require(path.join(__dirname, './src/reporters/', reporter))
    } catch (err) {
        console.error(`Reporter ${reporter} does not exist!`)
    }
}

const levels = ['all', 'info', 'warn', 'fail']
const currentLevel = { error: 3, warn: 2, info: 1, all: 0 }[global.argv.level];

// -----------------------------
// Launch all commands
// -----------------------------
(async () => {
    utils.display('start', [])

    const allCmds = []
    const cmdList = global.argv.tasks || cmdListDefault
    const scriptList = global.argv.scripts || scriptListDefault
    const skipped = []
    const skippedScripts = []

    // -----------------------------
    // Prepare commands list
    // -----------------------------
    for (const index in cmdList) {
        utils.prepareCmd(cmdList[index], allCmds, skipped)
    }

    // ---------------------------------
    // Prepare scripts & skipped scripts
    // ---------------------------------
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
        let score = 0

        for (const i in res) {
            const cmd = res[i]

            hasError = hasError || cmd.level === 'fail'
            hasWarning = hasWarning || cmd.level === 'warn'
            hasInfo = hasInfo || cmd.level === 'info'

            if (global.argv.budgetInfo && cmd.budget) {
                budgetInfo.push(cmd.budget)
            }

            if (cmd.level === 'succeed' || cmd.level === 'info') {
                score++
            }

            // -----------------------------
            // Display verbose messages
            // -----------------------------
            if (global.argv.verbose &&
                (levels.indexOf(cmd.level) >= currentLevel ||
                (global.argv.level === 'all' && cmd.level === 'succeed'))) {
                utils.display('displayVerbose', [cmd])
            }
        }

        utils.display('displayScore', [score, res])

        // -----------------------------
        // Display bugets information
        // -----------------------------
        utils.display('displayBudgets', [budgetInfo])

        // -------------------------------
        // Print skipped scripts & plugins
        // -------------------------------
        if (skipped.length > 0) {
            utils.display('displaySkippedPlugins', [skipped])
        }
        if (skippedScripts.length > 0) {
            utils.display('displaySkippedScripts', [skippedScripts])
        }
        utils.display('end', [])
        process.exit(hasError ? 1 : 0)
    } catch (err) {
        utils.display('end', [])
        console.log(err)
        process.exit(1)
    }
})()
