const cmd = require('../src/plugins/project-size/cmd')
const assert = require('assert')

describe('Project\'s size', () => {
    before(() => {
        global.argv = {
            'project-size': {
                budget: {
                    fail: { size: 50000, unpackedSize: 1000000, entryCount: 100 }
                }
            }
        }
    })

    it('should run project-size and return fail level', async () => {
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
