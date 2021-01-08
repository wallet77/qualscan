const { cli } = require('./utils')
const assert = require('assert')
const AbstractReporter = require('../src/reporters/AbstractReporter')
const AbstractPluginReporter = require('../src/reporters/AbstractPluginReporter')
const fs = require('fs')
const path = require('path')

class ReporterTest extends AbstractReporter {}

describe('Reporters', () => {
    it('should run qualscan but ignore unknown reporters', async () => {
        const result = await cli(['--reporters toto', '--code-duplication="--ignore tests/resources/code-duplication_failed/* --threshold 0.1 --gitignore"'], '.')
        assert.strictEqual(result.code, 0)
    })

    it('should use AbstractReporter and fail', async () => {
        try {
            const reporter = new AbstractReporter()
            assert.strictEqual(reporter, null)
            throw new Error('This test should have failed!')
        } catch (err) {
            assert.strictEqual(err.message, 'Abstract class "AbstractReporter" cannot be instantiated directly')
        }

        const reporter = new ReporterTest()

        try {
            reporter.displayBudgets()
            throw new Error('This test should have failed!')
        } catch (err) {
            assert.strictEqual(err.message, 'Method displayBudgets should be implemented!')
        }

        try {
            reporter.displaySkippedPlugins()
            throw new Error('This test should have failed!')
        } catch (err) {
            assert.strictEqual(err.message, 'Method displaySkippedPlugins should be implemented!')
        }

        try {
            reporter.displaySkippedScripts()
            throw new Error('This test should have failed!')
        } catch (err) {
            assert.strictEqual(err.message, 'Method displaySkippedScripts should be implemented!')
        }

        try {
            reporter.displayScore()
            throw new Error('This test should have failed!')
        } catch (err) {
            assert.strictEqual(err.message, 'Method displayScore should be implemented!')
        }

        try {
            reporter.start()
            throw new Error('This test should have failed!')
        } catch (err) {
            assert.strictEqual(err.message, 'Method start should be implemented!')
        }

        try {
            reporter.end()
            throw new Error('This test should have failed!')
        } catch (err) {
            assert.strictEqual(err.message, 'Method end should be implemented!')
        }

        try {
            reporter.displayVerbose()
        } catch (err) {
            throw new Error('This test should have passed!')
        }
    })

    it('should use AbstractReporter and fail', async () => {
        try {
            const reporter = new AbstractPluginReporter()
            assert.strictEqual(reporter, null)
            throw new Error('This test should have failed!')
        } catch (err) {
            assert.strictEqual(err.message, 'Abstract class "AbstractPluginReporter" cannot be instantiated directly')
        }
    })

    describe('JSON reporter', () => {
        const dir = path.join(process.cwd(), 'report/')
        const reportPath = path.join(dir, 'qualscan_report.json')

        afterEach(async () => {
            if (fs.existsSync(reportPath)) {
                await fs.promises.unlink(reportPath)
                await fs.promises.rmdir(dir)
            }
        })

        it('should run qualscan with json reporter', async () => {
            const result = await cli(['--reporters json', '--tasks project-size', '--scripts'], '.')
            assert.strictEqual(result.code, 0)
            const report = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'report/qualscan_report.json')))
            assert.strictEqual(report.score, 100)
        })

        it('should run qualscan with json reporter and print in console', async () => {
            const result = await cli(['--reporters json', '--reportPath ""', '--verbose', '--tasks project-size toto', '--scripts toto'], '.')
            assert.strictEqual(result.code, 0)
            assert.strictEqual(fs.existsSync(reportPath), false)
        })
    })
})
