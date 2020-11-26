const { cli } = require('./utils')
const assert = require('assert')

describe('run script', () => {
    it('should run script and return fail level (cause script does not exist', async () => {
        const result = await cli(['--tasks linter'], './tests/resources')
        assert.strictEqual(result.code, 1)
    })
})
