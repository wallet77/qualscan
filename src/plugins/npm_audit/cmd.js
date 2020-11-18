'use strict'
const cmd = {
    cmd: 'npm audit -json',
    title: 'Security audit',
    callback: async (error, stdout, stderr) => {
        const data = JSON.parse(stdout)

        cmd.data = data
        cmd.level = 'succeed'

        if (error) {
            cmd.level = 'fail'
            cmd.data = error
        }

        return cmd
    }
}

module.exports = cmd
