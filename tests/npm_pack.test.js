const cmd = require('../src/plugins/npm_pack/cmd')
const assert = require('assert')

describe('npm_pack', () => {
    before(() => {
        global.argv = {
            'npm-pack': {
                budget: {
                    fail: { size: 50000, unpackedSize: 1000000, entryCount: 100 }
                }
            }
        }
    })

    it('should run npm_pack and return fail level', async () => {
        // too many files
        await cmd.callback(null, JSON.stringify([{
            entryCount: 101
        }]), null)
        assert.strictEqual(cmd.level, 'fail')

        // package too big
        await cmd.callback(null, JSON.stringify([{
            size: 50001
        }]), null)
        assert.strictEqual(cmd.level, 'fail')

        await cmd.callback(null, JSON.stringify([{
            size: 5000,
            unpackedSize: 1000001
        }]), null)
        assert.strictEqual(cmd.level, 'fail')
    })
})
