const assert = require('assert')
const cmd = require('../src/plugins/require-time/cmd')

describe('Require time', () => {
    after(() => {
        delete global.argv
    })
    it('should run loadDep and return an error', async () => {
        global.argv = {
            'require-time': {
                entrypoint: 'unknown',
                budget: {
                    fail: { entrypointTime: 500000000 }
                }
            }
        }
        await cmd.callback()
        assert.strictEqual(cmd.data.entrypointTime, 0)
        assert.strictEqual(cmd.data.raw.entrypoint.err.code, 'MODULE_NOT_FOUND')
    })
})
