const cmd = require('../src/plugins/dependencies-size/cmd')
const assert = require('assert')
const path = require('path')

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

    it('should run dependencies-size without dependencies', async () => {
        process.env.QUALSCAN_PROJECT_PATH = path.join(__dirname, './resources/no-dependency')
        await cmd.callback(null, 'test', null)
        assert.strictEqual(cmd.level, 'succeed')
    })
})
