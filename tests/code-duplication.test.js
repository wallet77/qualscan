let cmd
const assert = require('assert')

describe('code-duplication', () => {
    before(() => {
        global.argv = {
            'code-duplication': {}
        }
        cmd = require('../src/plugins/code_duplication/cmd')
    })

    it('should run code-duplication and return fail level', async () => {
        await cmd.callback('err', null, null)
        assert.strictEqual(cmd.level, 'fail')
    })

    it('should run code-duplication and return succeed even if no report has been generated', async () => {
        await cmd.callback(null, {}, null)
        assert.strictEqual(cmd.level, 'succeed')
    })
})
