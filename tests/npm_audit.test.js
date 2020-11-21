const cmd = require('../src/plugins/npm_audit/cmd')
const assert = require('assert')

describe('npm_audit', () => {
    it('should run npm_audit and return fail level', async () => {
        await cmd.callback(null, JSON.stringify({
            metadata: {
                vulnerabilities: {
                    info: 0,
                    low: 0,
                    moderate: 0,
                    high: 1,
                    critical: 0
                }
            }
        }), null)
        assert.strictEqual(cmd.level, 'fail')

        await cmd.callback(null, JSON.stringify({
            metadata: {
                vulnerabilities: {
                    info: 0,
                    low: 0,
                    moderate: 0,
                    high: 0,
                    critical: 1
                }
            }
        }), null)
        assert.strictEqual(cmd.level, 'fail')
    })

    it('should run npm_audit and return warn level', async () => {
        await cmd.callback(null, JSON.stringify({
            metadata: {
                vulnerabilities: {
                    info: 0,
                    low: 0,
                    moderate: 1,
                    high: 0,
                    critical: 0
                }
            }
        }), null)
        assert.strictEqual(cmd.level, 'warn')

        await cmd.callback(null, JSON.stringify({
            metadata: {
                vulnerabilities: {
                    info: 0,
                    low: 1,
                    moderate: 0,
                    high: 0,
                    critical: 0
                }
            }
        }), null)
        assert.strictEqual(cmd.level, 'warn')
    })

    it('should run npm_audit and return info level', async () => {
        await cmd.callback(null, JSON.stringify({
            metadata: {
                vulnerabilities: {
                    info: 1,
                    low: 0,
                    moderate: 0,
                    high: 0,
                    critical: 0
                }
            }
        }), null)
        assert.strictEqual(cmd.level, 'info')
    })
})
