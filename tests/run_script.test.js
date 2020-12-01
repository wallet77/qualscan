const { cli } = require('./utils')
const assert = require('assert')

describe('run script', () => {
    it('should run qualscan and skips scrits because there is no script', async () => {
        const result = await cli(['--scripts linter --tasks'], './tests/resources')
        assert.strictEqual(result.code, 0)
    })

    it('should run qualscan and skips unknown scripts', async () => {
        const result = await cli(['--scripts unknown linter', '--tasks'], './tests/resources/scripts')
        assert.strictEqual(result.code, 0)
    })

    it('should run qualscan and fail on custom script', async () => {
        const result = await cli(['--scripts linter myScript', '--tasks'], './tests/resources/scripts')
        assert.strictEqual(result.code, 1)
    })
})
