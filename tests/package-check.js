const { cli } = require('./utils')
const assert = require('assert')

describe('package-check', () => {
    it('should run package-check and return a success', async () => {
        const result = await cli(['--tasks package-check'], './')
        assert.strictEqual(result.code, 0)
    })

    it('should run package-check and fail', async () => {
        const result = await cli(['--verbose', '--tasks package-check'], './tests/resources')
        assert.strictEqual(result.code, 1)
    })
})
