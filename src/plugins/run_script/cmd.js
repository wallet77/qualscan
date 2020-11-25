'use strict'
const cmd = {
    cmd: '',
    title: 'Script',
    callback: async (error, stdout, stderr) => {
        cmd.data = stdout || stderr
        cmd.level = 'succeed'

        if (error) {
            cmd.level = 'fail'
            cmd.error = error
        }

        return cmd
    }
}

module.exports = cmd
