'use strict'
const path = require('path')

module.exports = {
    cmd: `${path.join(__dirname, '/../../../node_modules/.bin/jscpd')} -c ${path.join(__dirname, '/config.json')} ./`,
    title: 'Code duplication',
    callback: async (error, stdout, stderr) => {
        const res = {
            data: stdout,
            level: 'succeed'
        }

        if (error) {
            res.level = 'fail'
        }

        return res
    }
}
