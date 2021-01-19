let cmd
const assert = require('assert')
const path = require('path')
const utils = require('../src/plugins/utils')

describe('Dependencies updates', () => {
    before(() => {
        global.argv = {
            updates: {
                budget: {
                    fail: { major: 0, minor: 5, patch: 10 },
                    warn: { major: 0, minor: 1, patch: 5 },
                    info: { major: 0, minor: 0, patch: 0 }
                }
            }
        }
        global.reporters = {
            text: ''
        }
        cmd = require(path.join(__dirname, '../src/plugins/updates/cmd'))
        utils.loadReporters(cmd, path.join(__dirname, '../src/plugins/updates/'))
    })

    it('should run updates and return an error', async () => {
        await cmd.callback(new Error('test'), JSON.stringify({}), null)
        assert.strictEqual(cmd.level, 'succeed')
        assert.strictEqual(cmd.error.message, 'test')
    })

    it('should run updates and return succeed level', async () => {
        await cmd.callback(null, JSON.stringify({
            eslint: {
                current: '7.13.0',
                wanted: '7.14.0',
                latest: '7.14.0',
                location: 'node_modules/eslint',
                type: 'devDependencies',
                homepage: 'https://eslint.org'
            }
        }), null)
        assert.strictEqual(cmd.level, 'succeed')
    })

    it('should run updates and return fail level (one major diff)', async () => {
        await cmd.callback(null, JSON.stringify({
            module: {
                current: '7.13.0',
                wanted: '8.0.0',
                latest: '8.0.0',
                location: 'node_modules/module',
                type: 'dependencies',
                homepage: 'https://module.org'
            }
        }), null)
        assert.strictEqual(cmd.level, 'fail')
    })

    it('should run updates and return info level (one minor diff)', async () => {
        await cmd.callback(null, JSON.stringify({
            module: {
                current: '7.13.0',
                wanted: '7.15.0',
                latest: '7.15.0',
                location: 'node_modules/module',
                type: 'dependencies',
                homepage: 'https://module.org'
            }
        }), null)
        assert.strictEqual(cmd.level, 'info')
        cmd.reporters.text.verbose()
    })

    it('should run updates and return info level (two minor diff)', async () => {
        await cmd.callback(null, JSON.stringify({
            module: {
                current: '7.13.0',
                wanted: '7.15.0',
                latest: '7.15.0',
                location: 'node_modules/module',
                type: 'dependencies',
                homepage: 'https://module.org'
            },
            module2: {
                current: '7.13.0',
                wanted: '7.15.0',
                latest: '7.15.0',
                location: 'node_modules/module',
                type: 'dependencies',
                homepage: 'https://module.org'
            }
        }), null)
        assert.strictEqual(cmd.level, 'warn')
    })

    it('should run updates and return info level (one patch diff)', async () => {
        await cmd.callback(null, JSON.stringify({
            module: {
                current: '7.15.0',
                wanted: '7.15.1',
                latest: '7.15.1',
                location: 'node_modules/module',
                type: 'dependencies',
                homepage: 'https://module.org'
            },
            module1: {
                current: '7.15.0',
                wanted: '7.15.0',
                latest: '7.15.0',
                location: 'node_modules/module1',
                type: 'dependencies',
                homepage: 'https://module1.org'
            }
        }), null)
        assert.strictEqual(cmd.level, 'info')
    })
})
