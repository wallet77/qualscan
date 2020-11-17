'use strict'

module.exports = {
    cmd: 'npm outdated -json',
    title: 'Dependencies updates',
    callback: async (error, stdout, stderr) => {
        const data = JSON.parse(stdout)

        const res = {
            data: data,
            level: 'succeed'
        }

        if (error) {
            res.level = 'fail'
        }

        return res
    }
}
