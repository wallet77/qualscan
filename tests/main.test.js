const { cli } = require('./utils.js')
const assert = require('assert')

describe('qualscan', () => {
    it('should run qualscan default behavior', async () => {
        const result = await cli(['--verbose', '--code-duplication="--ignore tests/resources/code-duplication_failed/* --threshold 0.1 --gitignore"'], '.')
        assert.strictEqual(result.code, 0)
    })

    it('should run qualscan but failed (dependencies version throw an error)', async () => {
        const result = await cli(['--tasks updates'], './tests/resources')
        assert.strictEqual(result.code, 1)
    })

    it('should run qualscan but skipped unknown plugins', async () => {
        const result = await cli(['--tasks unknownPlugin --scripts'], './tests/resources')
        assert.strictEqual(result.code, 0)
    })

    it('should run qualscan and return 0 because audit has only one low vulnerability', async () => {
        const result = await cli(['--tasks security-audit --scripts'], './tests/resources')
        assert.strictEqual(result.code, 0)
    })

    it('should run qualscan but return 1 because code-duplication has failed', async () => {
        const result = await cli(['--tasks code-duplication'], './tests/resources/')
        assert.strictEqual(result.code, 1)
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
})
