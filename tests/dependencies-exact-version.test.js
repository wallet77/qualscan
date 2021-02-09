const cmd = require('../src/plugins/dependencies-exact-version/cmd')
const assert = require('assert')
const path = require('path')

describe('dependencies exact version', () => {
    let currentDir
    before(() => {
        currentDir = process.cwd()
        global.argv = { 'dependencies-exact-version': { budget: { fail: { dependencies: 0, devDependencies: 0 } } } }
        global.packagefile = require(path.join(process.cwd(), 'package.json'))
        process.env.QUALSCAN_PROJECT_PATH = currentDir
    })
    after(() => {
        process.chdir(currentDir)
        delete process.env.QUALSCAN_PROJECT_PATH
    })

    it('should run dependencies-exact-version and return succeed level', async () => {
        await cmd.callback(null, null, null)
        assert.strictEqual(cmd.level, 'succeed')
    })

    it('should run dependencies-exact-version and return fail level', async () => {
        process.chdir('./tests/resources')
        process.env.QUALSCAN_PROJECT_PATH = process.cwd()
        global.packagefile = require(path.join(process.cwd(), 'package.json'))
        await cmd.callback(null, null, null)
        assert.strictEqual(Object.keys(cmd.data.dependencies).length, 0)

        process.chdir('./dependencies-exact-version')
        global.packagefile = require(path.join(process.cwd(), 'package.json'))
        process.env.QUALSCAN_PROJECT_PATH = process.cwd()
        await cmd.callback(null, null, null)
        assert.strictEqual(Object.keys(cmd.data.dependencies).length, 0)

        global.argv['dependencies-exact-version'].devDependencies = true
        await cmd.callback(null, null, null)
        assert.strictEqual(cmd.data.devDependencies.eslint, '^7.13.0')
    })
})
