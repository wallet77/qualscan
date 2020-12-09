const cmd = require('../src/plugins/npm_pack/cmd')
const assert = require('assert')

describe('npm_pack', () => {
    it('should run npm_pack and return fail level', async () => {
        // too many files
        await cmd.callback(null, JSON.stringify([{
            entryCount: 101
        }]), null)
        assert.strictEqual(cmd.level, 'fail')

        // packge too big
        await cmd.callback(null, JSON.stringify([{
            size: 50001
        }]), null)
        assert.strictEqual(cmd.level, 'fail')

        await cmd.callback(null, JSON.stringify([{
            size: 5000,
            unpackedSize: 100001
        }]), null)
        assert.strictEqual(cmd.level, 'fail')
    })
})
