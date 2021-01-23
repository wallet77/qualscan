const cmd = require('../src/plugins/security-audit/cmd')
const assert = require('assert')

describe('Security audit', () => {
    before(() => {
        global.argv = {
            'security-audit': {
                budget: {
                    fail: { critical: 0, high: 0 },
                    warn: { moderate: 0, low: 0 },
                    info: { info: 0 }
                }
            }
        }
    })

    it('should run security-audit and return fail level', async () => {
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

    it('should run security-audit and return warn level', async () => {
        await cmd.callback(null, JSON.stringify({
            metadata: {
                vulnerabilities: {
                    info: 1,
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

    it('should run security-audit and return info level', async () => {
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

    it('should run security-audit and return succeed level, even if no metadata retrieved', async () => {
        await cmd.callback(null, JSON.stringify({}), null)
        assert.strictEqual(cmd.level, 'succeed')
    })
})
