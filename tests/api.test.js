const qualscan = require('../index')
const assert = require('assert')
const path = require('path')

describe('qualscan API', () => {
    after(() => {
        delete process.env.TASKS_LIST
        delete process.env.QUALSCAN_PROJECT_PATH
    })
    it('should run qualscan API, default behavior', async () => {
        process.env.TASKS_LIST = 'project-size'
        const report = await qualscan.run({
            reporters: ['json'],
            reportPath: ''
        }, path.join(__dirname, 'resources'))
        assert.strictEqual(report.data.score, 100)
    })

    it('should run qualscan API, but fail to load conf', async () => {
        process.env.QUALSCAN_PROJECT_PATH = './'
        try {
            await qualscan.run({
                reporters: ['json'],
                reportPath: ''
            })
            throw new Error('This test should hve failed!')
        } catch (err) {
            assert.strictEqual(err.message.indexOf('Cannot find module \'package.json\'') > -1, true)
        }
    })
})
