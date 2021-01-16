const assert = require('assert')

describe('Require time', () => {
    after(() => {
        delete process.env.MODULE
    })
    it('should run loadDep and throw an error', async () => {
        process.env.MODULE = 'unknown'
        try {
            require('../src/plugins/require-time/loadDep')
            throw new Error('This test should have failed!')
        } catch (err) {
            assert.strictEqual(err.message.indexOf('Cannot find module \'unknown\'') === 0, true)
        }
    })
})
