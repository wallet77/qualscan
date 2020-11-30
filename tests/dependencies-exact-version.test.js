const cmd = require('../src/plugins/dependencies-exact-version/cmd')
const assert = require('assert')
const path = require('path')

describe('dependencies exact version', () => {
    let currentDir
    before(() => { currentDir = process.cwd(); global.argv = {}; global.packagefile = require(path.join(process.cwd(), 'package.json')) })
    after(() => process.chdir(currentDir))

    it('should run dependencies-exact-version and return succeed level', async () => {
        await cmd.callback(null, null, null)
        assert.strictEqual(cmd.level, 'succeed')
    })

    it('should run dependencies-exact-version and return fail level', async () => {
        process.chdir('./tests/resources')
        global.packagefile = require(path.join(process.cwd(), 'package.json'))
        await cmd.callback(null, null, null)
        assert.strictEqual(cmd.data.jscpd, '^3.3.19')

        process.chdir('./dependencies-exact-version')
        global.packagefile = require(path.join(process.cwd(), 'package.json'))
        await cmd.callback(null, null, null)
        assert.strictEqual(Object.keys(cmd.data).length, 0)

        global.argv['check-dev-dependencies'] = true
        await cmd.callback(null, null, null)
        assert.strictEqual(cmd.data.eslint, '^7.13.0')
    })
})
