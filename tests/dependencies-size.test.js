const cmd = require('../src/plugins/dependencies-size/cmd')
const assert = require('assert')

describe('Dependencies\'s size', () => {
    before(() => {
        global.argv = {
            'dependencies-size': {
                budget: {
                    fail: { dependencies: 10 }
                }
            }
        }
        global.packagefile = {}
        process.env.QUALSCAN_PROJECT_PATH = './'
    })

    after(() => {
        delete global.packagefile
        delete process.env.QUALSCAN_PROJECT_PATH
        delete global.argv
    })

    it('should run dependencies-size without dependencies', async () => {
        await cmd.callback(null, '', null)
        assert.strictEqual(cmd.level, 'succeed')
    })
})
