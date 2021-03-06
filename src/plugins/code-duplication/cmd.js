'use strict'
const path = require('path')
const fs = require('fs')
const utils = require(path.join(__dirname, '/../utils.js'))

const pathReport = path.join(__dirname, '/report/')
const fileReport = path.join(pathReport, 'jscpd-report.json')

const args = global.argv['code-duplication'].args || `-c ${path.join(__dirname, '/config.json')}`

const cmdLine = `${path.join(__dirname, utils.getBinDir(), 'jscpd')} ${args} ./ --reporters json --output ${pathReport}`

const cmd = {
    cmd: cmdLine,
    title: 'Code duplication',
    doc: 'https://github.com/wallet77/qualscan/blob/main/doc/code-duplication.md',
    callback: async (error, stdout, stderr) => {
        if (error) {
            cmd.error = error
            cmd.level = 'fail'
            return cmd
        }

        cmd.data = stdout
        cmd.level = 'succeed'

        const budget = global.argv['code-duplication'].budget

        utils.initBudget(cmd, budget, '% (', ')')

        if (fs.existsSync(fileReport)) {
            const rawdata = await fs.promises.readFile(fileReport)
            const data = JSON.parse(rawdata)
            cmd.data = data

            utils.processBudget(cmd, budget, cmd.data.statistics.total)

            await fs.promises.unlink(fileReport)
            await fs.promises.rmdir(pathReport)
        }

        return cmd
    }
}

utils.loadReporters(cmd, __dirname)

module.exports = cmd
