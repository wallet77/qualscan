const utils = require('../src/utils')
const path = require('path')
const assert = require('assert')

describe('Utils', () => {
    after(() => {
        delete global.packagefile
    })

    it('should return default (index.js)', async () => {
        global.packagefile = {}
        const entrypoint = utils.getEntrypoint()
        assert.strictEqual(entrypoint, path.join(process.cwd(), 'index.js'))
    })

    it('should return exports as string', async () => {
        global.packagefile = {
            exports: 'exports.js'
        }
        const entrypoint = utils.getEntrypoint()
        assert.strictEqual(entrypoint, path.join(process.cwd(), 'exports.js'))
    })

    it('should return exports.require', async () => {
        global.packagefile = {
            exports: {
                require: 'require.js'
            }
        }
        const entrypoint = utils.getEntrypoint()
        assert.strictEqual(entrypoint, path.join(process.cwd(), 'require.js'))
    })

    it('should return exports with dot', async () => {
        global.packagefile = {
            exports: {
                '.': 'dot.js'
            }
        }
        const entrypoint = utils.getEntrypoint()
        assert.strictEqual(entrypoint, path.join(process.cwd(), 'dot.js'))
    })

    it('should return default cause bad exports', async () => {
        global.packagefile = {
            exports: {
                wtf: 'dot.js'
            }
        }
        const entrypoint = utils.getEntrypoint()
        assert.strictEqual(entrypoint, path.join(process.cwd(), 'index.js'))
    })
})
