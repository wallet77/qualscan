const { cli } = require('./utils')
const assert = require('assert')
const AbstractReporter = require('../src/reporters/AbstractReporter')
const AbstractPluginReporter = require('../src/reporters/AbstractPluginReporter')

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
})
