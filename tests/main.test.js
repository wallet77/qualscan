const { cli } = require('./utils.js')
const assert = require('assert')

describe('qualscan', () => {
    it('should run qualscan default behavior', async () => {
        const result = await cli(['--verbose', '--code-duplication="--ignore "*/resources/code_duplication_failed/*""'], '.')
        assert.strictEqual(result.code, 0)
    })

    it('should run qualscan but failed (dependencies version throw an error)', async () => {
        const result = await cli(['--tasks npm_outdated'], './tests/resources')
        assert.strictEqual(result.code, 1)
    })

    it('should run qualscan but skipped unknown plugins', async () => {
        const result = await cli(['--tasks unknownPlugin'], './tests/resources')
        assert.strictEqual(result.code, 0)
    })

    it('should run qualscan but return 1 because one task has failed', async () => {
        const result = await cli(['--tasks npm_audit'], './tests/resources')
        assert.strictEqual(result.code, 1)
    })

    it('should run qualscan but return 1 because code_duplication has failed', async () => {
        const result = await cli(['--tasks code_duplication'], '.')
        assert.strictEqual(result.code, 1)
    })
})
