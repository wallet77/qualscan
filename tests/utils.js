const path = require('path')
const exec = require('child_process').exec

module.exports = {
    cli: (args, cwd, cmd = `node ${path.resolve('./index.js')}`) => {
        return new Promise(resolve => {
            exec(`${cmd} ${args.join(' ')}`,
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
}
