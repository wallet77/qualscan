const cmd = require('../src/plugins/dependencies-exact-version/cmd')
const assert = require('assert')

describe('dependencies exact version', () => {
    let currentDir
    before(() => { currentDir = process.cwd(); global.argv = {} })
    after(() => process.chdir(currentDir))

    it('should run dependencies-exact-version and return succeed level', async () => {
        await cmd.callback(null, null, null)
        assert.strictEqual(cmd.level, 'succeed')
    })

    it('should run dependencies-exact-version and return fail level', async () => {
        process.chdir('./tests')
        await cmd.callback(null, null, null)
        assert.strictEqual(cmd.level, 'fail')
        assert.strictEqual(cmd.error.message.indexOf('Cannot find module') > -1, true)
        process.chdir('./resources')
        await cmd.callback(null, null, null)
        assert.strictEqual(cmd.data.jscpd, '^3.3.19')

        process.chdir('./dependencies-exact-version')
        await cmd.callback(null, null, null)
        assert.strictEqual(Object.keys(cmd.data).length, 0)

        global.argv['check-dev-dependencies'] = true
        await cmd.callback(null, null, null)
        assert.strictEqual(cmd.data.eslint, '^7.13.0')
    })
})
