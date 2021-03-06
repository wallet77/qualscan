const { cli } = require('./utils.js')
const assert = require('assert')

describe('qualscan', () => {
    it('should run qualscan default behavior', async () => {
        const result = await cli(['--verbose', '--code-duplication="--ignore tests/resources/code-duplication_failed/* --threshold 0.1 --gitignore"', '--require-time.budget.fail.entrypointTime 1000000000'], '.')
        assert.strictEqual(result.code, 0)
    })

    it('should run qualscan but failed (dependency has range version)', async () => {
        const result = await cli(['--tasks dependencies-exact-version', '--devd', '--verbose'], './tests/resources/dependencies-exact-version')
        assert.strictEqual(result.code, 1)
    })

    it('should run qualscan and returns 0 (dependencies version ignores bad version)', async () => {
        const result = await cli(['--tasks updates'], './tests/resources')
        assert.strictEqual(result.code, 0)
    })

    it('should run qualscan and fail (security audit throw an error)', async () => {
        const result = await cli(['--tasks security-audit', '--scripts'], './tests/resources/security-audit')
        assert.strictEqual(result.code, 1)
    })

    it('should run qualscan and fail (security audit throw an error for dev)', async () => {
        const result = await cli(['--tasks security-audit', '--scripts', '--devMode'], './tests/resources/security-audit/dev')
        assert.strictEqual(result.code, 1)
    })

    it('should run qualscan but skipped unknown plugins', async () => {
        const result = await cli(['--tasks unknownPlugin --scripts'], './tests/resources')
        assert.strictEqual(result.code, 0)
    })

    it('should run qualscan but return 1 because code-duplication has failed', async () => {
        const result = await cli(['--tasks code-duplication'], './tests/resources/')
        assert.strictEqual(result.code, 1)
    })

    it('should run qualscan but return 1 because it found unused dep', async () => {
        const result = await cli(['--tasks dependencies-check', '--verbose'], './tests/resources/')
        assert.strictEqual(result.code, 1)
    })

    it('should run qualscan but return 0 because no node_modules', async () => {
        const result = await cli(['--tasks dependencies-size', '--verbose'], './tests/resources/')
        assert.strictEqual(result.code, 0)
    })

    it('should run qualscan but return 0 because dep size is ok', async () => {
        const result = await cli(['--tasks dependencies-size', '--verbose'], '.')
        assert.strictEqual(result.code, 0)
    })

    it('should run qualscan without env var', async () => {
        delete process.env.SCRIPTS_LIST
        const result = await cli(['--tasks dependencies-exact-version --scripts'], '.')
        assert.strictEqual(result.code, 0)
        process.env.SCRIPTS_LIST = 'linter'
    })

    it('should run qualscan but failed (no package.json file)', async () => {
        const result = await cli(['--tasks updates'], './tests')
        assert.strictEqual(result.code, 1)
    })

    it('should run qualscan but failed to load qualscanrc (bad format)', async () => {
        const result = await cli(['--tasks updates'], './tests/resources/configFile')
        assert.strictEqual(result.code, 0)
    })

    it('should run qualscan without budget info', async () => {
        const result = await cli(['--tasks code-duplication --bi false'], './tests/resources/')
        assert.strictEqual(result.code, 1)
    })

    it('should run qualscan and export conf', async () => {
        const result = await cli(['exportConf'], '.')
        assert.strictEqual(result.code, 0)
    })
})
