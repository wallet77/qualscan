const { cli } = require('./utils')
const cmd = require('../src/plugins/npm_outdated/cmd')
const assert = require('assert')

describe('npm_outdated', () => {
    it('should run npm_outdated and return a success', async () => {
        const result = await cli([], './tests/resources', 'node -e "require(\'../../src/plugins/npm_outdated/cmd.js\').callback(null, \'\', null)"')
        assert.strictEqual(result.code, 0)
    })

    it('should run npm_outdated and return an error', async () => {
        await cmd.callback(new Error('test'), JSON.stringify({}), null)
        assert.strictEqual(cmd.level, 'fail')
        assert.strictEqual(cmd.error.message, 'test')
    })

    it('should run npm_outdated and return info level', async () => {
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
        assert.strictEqual(cmd.level, 'info')
    })

    it('should run npm_outdated and return fail level (one major diff)', async () => {
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

    it('should run npm_outdated and return warn level (one minor diff)', async () => {
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
        assert.strictEqual(cmd.level, 'warn')
    })

    it('should run npm_outdated and return info level (one patch diff)', async () => {
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
