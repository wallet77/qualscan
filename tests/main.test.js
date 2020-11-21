const path = require('path')
const exec = require('child_process').exec

const cli = (args, cwd) => {
    return new Promise(resolve => {
        exec(`nyc --reporter none node ${path.resolve('./index.js')} ${args.join(' ')}`,
            { cwd },
            (error, stdout, stderr) => {
                resolve({
                    code: error && error.code ? error.code : 0,
                    error,
                    stdout,
                    stderr
                })
            })
    })
}

describe('qualscan', () => {
    it('should run qualscan default behavior', async () => {
        const result = await cli(['--verbose', '--code-duplication="--ignore "*/resources/code_duplication_failed/*""'], '.')
        expect(result.code).toBe(0)
    })

    it('should run qualscan but failed (dependencies version throw an error)', async () => {
        const result = await cli(['--tasks npm_outdated'], './tests/resources')
        expect(result.code).toBe(1)
    })

    it('should run qualscan but skipped unknown plugins', async () => {
        const result = await cli(['--tasks unknownPlugin'], './tests/resources')
        expect(result.code).toBe(0)
    })

    it('should run qualscan but return 1 because one task has failed', async () => {
        const result = await cli(['--tasks npm_audit'], './tests/resources')
        expect(result.code).toBe(1)
    })

    it('should run qualscan but return 1 because code_duplication has failed', async () => {
        const result = await cli(['--tasks code_duplication'], '.')
        expect(result.code).toBe(1)
    })
})
